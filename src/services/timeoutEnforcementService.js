const fs = require('fs');
const path = require('path');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logger = require('../utils/logger');
const { createBrandedEmbed, BRAND, channelMatches } = require('../utils/helpers');

const TRACKER_FILE = path.resolve(__dirname, '../../data/onboarding-tracker.json');
const WINDOW_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

class TimeoutEnforcementService {
  constructor() {
    this.tracker = {};
    this.loadTracker();
  }

  loadTracker() {
    try {
      if (fs.existsSync(TRACKER_FILE)) {
        const raw = fs.readFileSync(TRACKER_FILE, 'utf8');
        this.tracker = JSON.parse(raw);
      }
    } catch (err) {
      logger.error(`[TIMEOUT-ENFORCEMENT] Failed to load tracker: ${err.message}`);
      this.tracker = {};
    }
  }

  saveTracker() {
    try {
      const dir = path.dirname(TRACKER_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(TRACKER_FILE, JSON.stringify(this.tracker, null, 2), 'utf8');
    } catch (err) {
      logger.error(`[TIMEOUT-ENFORCEMENT] Failed to save tracker: ${err.message}`);
    }
  }

  /**
   * Register a member when joining or when initializing tracker
   *
   * @param {import('discord.js').GuildMember} member
   * @param {object} [options]
   * @param {boolean} [options.sendDm=true]
   */
  async registerNewMember(member, { sendDm = true } = {}) {
    if (!member || member.user.bot) return;

    const now = Date.now();
    const existing = this.tracker[member.id];

    if (existing && existing.status === 'introduced') {
      return;
    }

    this.tracker[member.id] = {
      userId: member.id,
      username: member.user.tag,
      displayName: member.displayName,
      joinedAt: existing ? existing.joinedAt : now,
      deadline: existing ? existing.deadline : now + WINDOW_DURATION_MS,
      extensionsUsed: existing ? (existing.extensionsUsed || 0) : 0,
      noticesSent: existing ? existing.noticesSent : {
        welcome: true,
        halfway: false,
        finalWarning: false
      },
      status: existing ? existing.status : 'pending'
    };
    this.saveTracker();

    if (sendDm) {
      await this.sendPersonalGuidanceDM(member);
    }
  }

  /**
   * Send 1-on-1 personal guidance and copy-paste template via DM
   *
   * @param {import('discord.js').GuildMember} member
   */
  async sendPersonalGuidanceDM(member) {
    try {
      const introChan = member.guild.channels.cache.find(c => channelMatches(c.name, 'introductions'));
      const introRef = introChan ? `<#${introChan.id}>` : '#introductions';

      const dmEmbed = createBrandedEmbed({
        title: `🪦 DEAD LEAD SOCIETY — MANDATORY OPERATOR ACTIVATION`,
        description: [
          `Welcome to **Dead Lead Society**, **${member.displayName}**!\n`,
          `I am **Zodiac**, the autonomous pipeline intelligence engine of the Society.`,
          `All 14 institutional departments are currently **restricted** until your operator background is registered.\n`,
          `### ⏱️ STRICT 24-HOUR ACTIVATION PROTOCOL:`,
          `You have exactly **24 hours** from joining to post your background in ${introRef}.`,
          `*If you fail to introduce yourself within 24 hours, you will receive **no roles** and will be quarantined in the **Timeout Zone**.*\n`,
          `### 📋 COPY & PASTE THIS TEMPLATE INTO ${introRef}:`,
          '```yaml',
          'Name / Agency: [Your Name / Agency or Company]',
          'Core Offer: [What B2B service or offer do you sell?]',
          'Target ICP: [Industry, company size, or ideal buyer titles]',
          'Stalled Pipeline: [Where are prospects currently ghosting or dying?]',
          '```\n',
          `As soon as you post this in ${introRef}, Zodiac will verify your introduction, grant the **\`Society Member\`** credential, and unlock the entire operating arsenal.`
        ].join('\n'),
        color: BRAND.COLOR_PRIMARY
      });

      await member.send({ embeds: [dmEmbed] }).catch(() => {
        logger.warn(`[TIMEOUT-ENFORCEMENT] Could not DM ${member.user.tag} (DMs disabled).`);
      });
    } catch (err) {
      logger.error(`[TIMEOUT-ENFORCEMENT] Error sending guidance DM: ${err.message}`);
    }
  }

  /**
   * Mark user as successfully introduced
   *
   * @param {string} userId
   * @param {import('discord.js').Guild} [guild]
   */
  async markIntroduced(userId, guild) {
    if (!userId) return;

    if (!this.tracker[userId]) {
      this.tracker[userId] = {
        userId,
        joinedAt: Date.now(),
        deadline: Date.now(),
        extensionsUsed: 0,
        noticesSent: { welcome: true, halfway: true, finalWarning: true },
        status: 'introduced'
      };
    } else {
      this.tracker[userId].status = 'introduced';
    }
    this.saveTracker();

    // If member has Timed Out role, remove it
    if (guild) {
      try {
        const member = await guild.members.fetch(userId).catch(() => null);
        if (member) {
          const timeoutRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'timed out');
          if (timeoutRole && member.roles.cache.has(timeoutRole.id)) {
            await member.roles.remove(timeoutRole, 'Introduction verified: Cleared timeout state');
          }
        }
      } catch (err) {
        logger.warn(`[TIMEOUT-ENFORCEMENT] Could not clear timeout role for ${userId}: ${err.message}`);
      }
    }
  }

  /**
   * Periodic check executed by scheduler
   *
   * @param {import('discord.js').Client} client
   */
  async checkPendingDeadlines(client) {
    const now = Date.now();

    for (const [userId, record] of Object.entries(this.tracker)) {
      if (record.status !== 'pending') continue;

      const remainingMs = record.deadline - now;

      // 1. Deadline Expired -> Send to Timeout Zone
      if (remainingMs <= 0) {
        await this.enforceTimeout(client, record);
        continue;
      }

      // 2. Final Warning (2 Hours Remaining)
      if (remainingMs <= 2 * 60 * 60 * 1000 && !record.noticesSent.finalWarning) {
        await this.sendCountdownNotice(client, record, 2);
        record.noticesSent.finalWarning = true;
        this.saveTracker();
        continue;
      }

      // 3. Halfway Notice (12 Hours Remaining)
      if (remainingMs <= 12 * 60 * 60 * 1000 && !record.noticesSent.halfway) {
        await this.sendCountdownNotice(client, record, 12);
        record.noticesSent.halfway = true;
        this.saveTracker();
      }
    }
  }

  /**
   * Send countdown warning notice via DM
   */
  async sendCountdownNotice(client, record, hoursLeft) {
    try {
      const user = await client.users.fetch(record.userId).catch(() => null);
      if (!user) return;

      const isFinal = hoursLeft <= 2;
      const title = isFinal
        ? `🚨 FINAL WARNING: 2 Hours Remaining to Activate Society Credentials`
        : `⏰ HALFWAY NOTICE: 12 Hours Left to Complete Your Introduction`;

      const noticeEmbed = createBrandedEmbed({
        title,
        description: [
          `**Attention <@${record.userId}>**,`,
          `Your onboarding countdown is ticking. You have **${hoursLeft} hours remaining** to post your introduction in the introductions channel.\n`,
          `**Protocol Reminder**:`,
          `• Post your Name, Offer, Target ICP in the introductions channel.`,
          isFinal
            ? `⚠️ **CRITICAL**: If you do not post within **${hoursLeft} hours**, Zodiac will lock your account and quarantine you in the **Timeout Zone** with zero channel access.`
            : `• Failure to submit within the 24-hour window will result in quarantine in the Timeout Zone.`
        ].join('\n'),
        color: isFinal ? BRAND.COLOR_DANGER : BRAND.COLOR_WARNING
      });

      await user.send({ embeds: [noticeEmbed] }).catch(() => {
        logger.warn(`[TIMEOUT-ENFORCEMENT] Could not send ${hoursLeft}h notice to ${user.tag} (DMs closed).`);
      });
      logger.setup(`[TIMEOUT-ENFORCEMENT] Sent ${hoursLeft}h countdown notice to ${user.tag}`);
    } catch (err) {
      logger.error(`[TIMEOUT-ENFORCEMENT] Error sending notice to ${record.userId}: ${err.message}`);
    }
  }

  /**
   * Enforce timeout on an expired user
   */
  async enforceTimeout(client, record) {
    record.status = 'timed_out';
    this.saveTracker();

    try {
      for (const [, guild] of client.guilds.cache) {
        const member = await guild.members.fetch(record.userId).catch(() => null);
        if (!member) continue;

        const timeoutRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'timed out');
        if (timeoutRole) {
          await member.roles.add(timeoutRole, 'Onboarding window expired: 24h deadline passed without introduction');
          logger.setup(`[TIMEOUT-ENFORCEMENT] Applied "Timed Out" role to ${member.user.tag}`);
        }

        // Post notice in ⏳・timeout-zone
        const timeoutChan = guild.channels.cache.find(c => channelMatches(c.name, 'timeout-zone'));
        if (timeoutChan && timeoutChan.isTextBased()) {
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('btn_request_timeout_extension')
              .setLabel('🔄 Request 24h Reactivation')
              .setStyle(ButtonStyle.Primary)
              .setEmoji('⏳')
          );

          const timeoutEmbed = createBrandedEmbed({
            title: `⏳ Onboarding Window Expired: ${member.displayName}`,
            description: [
              `<@${member.id}>, your **24-hour introduction window has expired** without completing verification.\n`,
              `**Current Status**: **Quarantined in Timeout Zone**`,
              `• You do not possess the \`Society Member\` credential.`,
              `• All 14 institutional departments and outreach labs are locked.\n`,
              `**Need a second chance?**`,
              `If you were unavailable or busy, click the button below to claim a **one-time 24-hour reactivation extension** and complete your introduction:`
            ].join('\n'),
            color: BRAND.COLOR_DANGER
          });

          await timeoutChan.send({
            content: `⚠️ <@${member.id}>`,
            embeds: [timeoutEmbed],
            components: [row]
          }).catch(() => {});
        }

        // Also DM user
        const dmEmbed = createBrandedEmbed({
          title: `⏳ Onboarding Window Expired — Quarantined in Timeout Zone`,
          description: [
            `Hello **${member.displayName}**,\n`,
            `Your **24-hour onboarding window in Dead Lead Society has expired** without an introduction.\n`,
            `You have been placed in the **Timeout Zone** and can no longer access server departments.\n`,
            `If you still wish to join, inspect the **#timeout-zone** channel in Discord and click **[Request 24h Reactivation]** to unlock a final 24-hour window.`
          ].join('\n'),
          color: BRAND.COLOR_DANGER
        });
        await member.send({ embeds: [dmEmbed] }).catch(() => {});
      }
    } catch (err) {
      logger.error(`[TIMEOUT-ENFORCEMENT] Failed to enforce timeout on ${record.userId}: ${err.message}`);
    }
  }

  /**
   * Handle interactive extension button click
   *
   * @param {import('discord.js').ButtonInteraction} interaction
   */
  async handleExtensionRequest(interaction) {
    const userId = interaction.user.id;
    const record = this.tracker[userId];

    if (!record) {
      return interaction.reply({
        content: '❌ No active onboarding record found for your account.',
        ephemeral: true
      });
    }

    if (record.extensionsUsed >= 1) {
      return interaction.reply({
        content: '❌ **Extension Limit Reached**: You have already utilized your one-time 24-hour reactivation. Please contact the Founder or a Moderator for manual evaluation.',
        ephemeral: true
      });
    }

    record.extensionsUsed = (record.extensionsUsed || 0) + 1;
    record.deadline = Date.now() + WINDOW_DURATION_MS;
    record.status = 'pending';
    record.noticesSent = {
      welcome: true,
      halfway: false,
      finalWarning: false
    };
    this.saveTracker();

    // Remove Timed Out role
    const timeoutRole = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'timed out');
    if (timeoutRole && interaction.member.roles.cache.has(timeoutRole.id)) {
      await interaction.member.roles.remove(timeoutRole, 'User claimed 24h reactivation extension').catch(() => {});
    }

    const introChan = interaction.guild.channels.cache.find(c => channelMatches(c.name, 'introductions'));
    const introRef = introChan ? `<#${introChan.id}>` : '#introductions';

    const successEmbed = createBrandedEmbed({
      title: '✅ 24-Hour Reactivation Granted',
      description: [
        `Your onboarding window has been reset for **another 24 hours**.\n`,
        `Head over to ${introRef} now and post your background using the template to unlock your **\`Society Member\`** credential!`,
        `*Deadline expires: <t:${Math.floor(record.deadline / 1000)}:R>*`
      ].join('\n'),
      color: BRAND.COLOR_SUCCESS
    });

    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    logger.setup(`[TIMEOUT-ENFORCEMENT] Granted 24h reactivation extension to ${interaction.user.tag}`);
  }
}

module.exports = new TimeoutEnforcementService();
