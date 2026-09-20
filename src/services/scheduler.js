const cron = require('node-cron');
const { ChannelType } = require('discord.js');
const logger = require('../utils/logger');
const newsService = require('./newsService');
const { createBrandedEmbed, BRAND } = require('../utils/helpers');
const { config } = require('../config');

function resolveSafeTimezone(tz) {
  const candidate = (tz || config.timezone || process.env.TIMEZONE || 'Asia/Dhaka').trim();
  try {
    Intl.DateTimeFormat(undefined, { timeZone: candidate });
    return candidate;
  } catch {
    logger.warn(`Invalid timezone "${candidate}" specified. Falling back to UTC.`);
    return 'UTC';
  }
}

const DEFAULT_TIMEZONE = resolveSafeTimezone(config.timezone);
const TARGET_CHANNEL_NAMES = ['industrial-news-room', 'industry-news-room', 'news-room', 'announcements', 'general-discussion'];

class SchedulerService {
  constructor() {
    this.jobs = [];
    this.timezone = DEFAULT_TIMEZONE;
  }

  /**
   * Find a specific channel by name (case-insensitive with normalized hyphens)
   *
   * @param {import('discord.js').Guild} guild
   * @param {string} channelName
   * @returns {import('discord.js').TextChannel|null}
   */
  findChannelByName(guild, channelName) {
    if (!guild || !channelName) return null;
    const target = channelName.trim().toLowerCase().replace(/\s+/g, '-');
    return guild.channels.cache.find(
      c => c.type === ChannelType.GuildText && c.name.toLowerCase().replace(/\s+/g, '-') === target
    ) || null;
  }

  /**
   * Locate the best fallback channel for news updates in the guild
   *
   * @param {import('discord.js').Guild} guild
   * @returns {import('discord.js').TextChannel|null}
   */
  findNewsChannel(guild) {
    if (!guild) return null;

    for (const name of TARGET_CHANNEL_NAMES) {
      const channel = this.findChannelByName(guild, name);
      if (channel) return channel;
    }

    // Fallback to first text channel the bot can send messages in
    return guild.channels.cache.find(
      c => c.type === ChannelType.GuildText && c.permissionsFor(guild.members.me)?.has('SendMessages')
    ) || null;
  }

  /**
   * Broadcast industry intelligence across specialized channels for online service sellers
   *
   * @param {import('discord.js').Guild} guild
   * @param {object} [options]
   * @param {boolean} [options.isMorning=true]
   * @param {boolean} [options.isManual=false]
   * @returns {Promise<{ success: boolean, channelName?: string, channelNames?: string[], articleCount?: number, error?: string }>}
   */
  async postNewsUpdate(guild, { isMorning = true, isManual = false } = {}) {
    try {
      const articles = await newsService.fetchArticles({ limit: 3, ignoreCache: isManual });
      const embeds = newsService.formatNewsEmbeds(articles, { isMorning, isManual });

      const updatedChannels = [];

      // Look up specialized channels for online service sellers
      const macroChan = this.findChannelByName(guild, 'macro-market-trends');
      const top30Chan = this.findChannelByName(guild, 'daily-top-30');
      const apexChan = this.findChannelByName(guild, 'apex-outreach-picks');
      const playbookChan = this.findChannelByName(guild, 'weaponized-playbooks');
      const masterChan = this.findChannelByName(guild, 'industrial-news-room');

      // 1. Dispatch Part 1 to #macro-market-trends
      if (macroChan && embeds[0]) {
        try {
          await macroChan.send({ embeds: [embeds[0]] });
          updatedChannels.push(macroChan.name);
        } catch (chanErr) {
          logger.error(`Failed to dispatch Part 1 to #${macroChan.name}: ${chanErr.message}`);
        }
      }

      // 2. Dispatch Part 2 & Part 3 to #daily-top-30
      if (top30Chan) {
        try {
          if (embeds[1]) await top30Chan.send({ embeds: [embeds[1]] });
          if (embeds[2]) {
            await new Promise(r => setTimeout(r, 500));
            await top30Chan.send({ embeds: [embeds[2]] });
          }
          updatedChannels.push(top30Chan.name);
        } catch (chanErr) {
          logger.error(`Failed to dispatch Part 2/3 to #${top30Chan.name}: ${chanErr.message}`);
        }
      }

      // 3. Dispatch Part 4 to #apex-outreach-picks
      if (apexChan && embeds[3]) {
        try {
          await apexChan.send({ embeds: [embeds[3]] });
          updatedChannels.push(apexChan.name);
        } catch (chanErr) {
          logger.error(`Failed to dispatch Part 4 to #${apexChan.name}: ${chanErr.message}`);
        }
      }

      // 4. Dispatch Part 5 to #weaponized-playbooks
      if (playbookChan && embeds[4]) {
        try {
          await playbookChan.send({ embeds: [embeds[4]] });
          updatedChannels.push(playbookChan.name);
        } catch (chanErr) {
          logger.error(`Failed to dispatch Part 5 to #${playbookChan.name}: ${chanErr.message}`);
        }
      }

      // 5. Dispatch full 5-part master briefing to #industrial-news-room
      if (masterChan) {
        try {
          for (let i = 0; i < embeds.length; i++) {
            await masterChan.send({ embeds: [embeds[i]] });
            if (i < embeds.length - 1) {
              await new Promise(r => setTimeout(r, 500));
            }
          }
          if (!updatedChannels.includes(masterChan.name)) {
            updatedChannels.push(masterChan.name);
          }
        } catch (chanErr) {
          logger.error(`Failed to dispatch master briefing to #${masterChan.name}: ${chanErr.message}`);
        }
      }

      // 6. Dispatch High-Urgency Niche Decision Alert to #announcements
      const announcementsChan = this.findChannelByName(guild, 'announcements');
      if (announcementsChan) {
        try {
          const timeLabel = isMorning ? '09:00 AM Edition' : '07:00 PM Edition';
          const top30 = newsService.getRankedTop30Niches();
          const apexTop3 = top30.slice(0, 3);
          const top3Badges = apexTop3.map(n => `**#${n.rank} ${n.name}** [${n.avgDealSize}]`).join('\n• ');
          const decisionChan = this.findChannelByName(guild, 'seller-decision-room');

          const alertEmbed = createBrandedEmbed({
            title: `⚡ IMMEDIATE NICHE OPPORTUNITY ALERT (${timeLabel})`,
            description: [
              `Today's fresh Tier-1 market intelligence and **Daily Top 30 Matrix** have dropped across the **📊 ︱ INDUSTRIAL NEWS ROOM**.`,
              '',
              `🔥 **Today's Highest-Probability Attack Verticals (Apex Triad)**:`,
              `• ${top3Badges}`,
              '',
              `🎯 **SERVICE SELLER MOBILIZATION PROTOCOL**:`,
              `If your agency, technical service, or lead generation expertise aligns with today's top niches, **make your decision and mobilize immediately**!\n`,
              `• **1. Review Urgent Catalysts**: Check real-time buying triggers in ${top30Chan ? `<#${top30Chan.id}>` : '`#daily-top-30`'} & ${apexChan ? `<#${apexChan.id}>` : '`#apex-outreach-picks`'}.`,
              `• **2. Deploy Ready-To-Use Hooks**: Grab cold email copy and 9-word dead lead revival scripts in ${playbookChan ? `<#${playbookChan.id}>` : '`#weaponized-playbooks`'}.`,
              `• **3. War-Room Strategy**: Hop into ${decisionChan ? `<#${decisionChan.id}>` : '`#seller-decision-room`'} to coordinate angles with fellow sellers.\n`,
              `*Corporate budget windows in Tier-1 markets close quickly. Strike while decision-maker buying urgency is at its peak!*`
            ].join('\n'),
            color: 0xE67E22
          });

          await announcementsChan.send({ embeds: [alertEmbed] });
          if (!updatedChannels.includes(announcementsChan.name)) {
            updatedChannels.push(announcementsChan.name);
          }
        } catch (chanErr) {
          logger.error(`Failed to dispatch alert to #${announcementsChan.name}: ${chanErr.message}`);
        }
      }

      // Fallback: If none of the specialized channels exist, post to generic channel
      if (updatedChannels.length === 0) {
        const fallbackChannel = this.findNewsChannel(guild);
        if (fallbackChannel) {
          for (const embed of embeds) {
            await fallbackChannel.send({ embeds: [embed] });
          }
          updatedChannels.push(fallbackChannel.name);
        } else {
          const err = `Could not find any announcements or text channels in guild "${guild.name}"`;
          logger.error(`[NEWS] ${err}`);
          return { success: false, error: err };
        }
      }

      // Save posted URLs to avoid duplicates
      newsService.savePostedUrls(articles.map(a => a.link));

      logger.news(`Dispatched 5-part intelligence suite across #${updatedChannels.join(', #')} in "${guild.name}" (Morning: ${isMorning}, Manual: ${isManual})`);
      return {
        success: true,
        channelName: updatedChannels[0],
        channelNames: updatedChannels,
        articleCount: articles.length
      };
    } catch (error) {
      logger.error(`Failed to post news update: ${error.message}`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Initialize automated cron schedules for 9:00 AM and 7:00 PM
   *
   * @param {import('discord.js').Client} client
   */
  init(client) {
    logger.scheduler(`Initializing automated news scheduler (Timezone: ${DEFAULT_TIMEZONE})...`);

    // 1. Morning Job: 9:00 AM every day ('0 9 * * *')
    const morningJob = cron.schedule('0 9 * * *', async () => {
      logger.scheduler('Running 9:00 AM Morning Industry News cron job...');
      await this.broadcastToGuilds(client, { isMorning: true });
    }, {
      timezone: DEFAULT_TIMEZONE
    });

    // 2. Evening Job: 7:00 PM (19:00) every day ('0 19 * * *')
    const eveningJob = cron.schedule('0 19 * * *', async () => {
      logger.scheduler('Running 7:00 PM Evening Industry News cron job...');
      await this.broadcastToGuilds(client, { isMorning: false });
    }, {
      timezone: DEFAULT_TIMEZONE
    });

    this.jobs.push(morningJob, eveningJob);
    logger.scheduler(`Automated news jobs active: Daily at 9:00 AM and 7:00 PM (${DEFAULT_TIMEZONE})`);
  }

  /**
   * Send the update to all active guilds
   */
  async broadcastToGuilds(client, { isMorning = true } = {}) {
    for (const [guildId, guild] of client.guilds.cache) {
      logger.scheduler(`Broadcasting news to guild: "${guild.name}" (${guildId})`);
      await this.postNewsUpdate(guild, { isMorning, isManual: false });
    }
  }

  /**
   * Stop all scheduled jobs
   */
  destroy() {
    this.jobs.forEach(job => job.stop());
    this.jobs = [];
    logger.scheduler('All scheduled news jobs stopped.');
  }
}

module.exports = new SchedulerService();
