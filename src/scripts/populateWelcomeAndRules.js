const { Client, GatewayIntentBits, Events, MessageType } = require('discord.js');
const { config, validateConfig } = require('../config');
const { createBrandedEmbed, BRAND } = require('../utils/helpers');
const logger = require('../utils/logger');

const validation = validateConfig({ requireGuildId: true });
if (!validation.valid) {
  logger.error('Cannot populate welcome/rules due to missing configuration:');
  validation.errors.forEach(err => logger.error(` - ${err}`));
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once(Events.ClientReady, async () => {
  logger.boot('Populating #welcome and #rules channels (idempotent mode)...');

  try {
    const guild = await client.guilds.fetch(config.guildId);
    if (!guild) {
      logger.error(`Guild ${config.guildId} not found.`);
      process.exit(1);
    }

    await guild.channels.fetch();

    const welcomeChan = guild.channels.cache.find(c => c.name.toLowerCase() === 'welcome');
    const rulesChan = guild.channels.cache.find(c => c.name.toLowerCase() === 'rules');
    const introsChan = guild.channels.cache.find(c => c.name.toLowerCase() === 'intros-and-networking');

    // =========================================================================
    // 1. POPULATE #welcome
    // =========================================================================
    if (welcomeChan) {
      logger.channel('Synchronizing welcome manifesto in #welcome...');

      const welcomeEmbed1 = createBrandedEmbed({
        title: '💀 WELCOME TO DEAD LEAD SOCIETY',
        description: [
          '***"Where Dead Leads Get a Second Chance."***\n',
          'In the modern B2B landscape, **95% of sales pipelines stall, go dark, or die in procurement bureaucracy**. Most agencies and sales teams abandon these leads, burning thousands of dollars chasing cold new traffic.',
          '',
          '**The Dead Lead Society was founded on a proven truth:**',
          '> *A stalled, unresponsive lead who engaged with you 60 days ago is 5x more valuable than a stranger—if you possess the market intelligence and the right weaponized revival psychology to reactivate them.*',
          '',
          'You have entered an institutional community of B2B agency owners, cold email specialists, appointment setters, and high-ticket deal closers dedicated to pipeline monetization.'
        ].join('\n'),
        color: 0xE67E22,
        fields: [
          {
            name: '📊 Daily Tier-1 Market Intelligence',
            value: 'Every day at 09:00 AM & 07:00 PM, our intelligence engine analyzes 90+ B2B verticals across US, UK, Canada & Australia to deliver the **Daily Top 30 Matrix**, macroeconomic capital trends, and the highest-probability attack verticals.',
            inline: false
          },
          {
            name: '💼 The Deal Room & Lead Strategies',
            value: 'Access battle-tested 9-word revival questions, multi-channel revival frameworks, and the `#deal-room` forum where society members partner to monetize dead pipelines.',
            inline: false
          },
          {
            name: '⚡ Ready-To-Deploy Weaponized Assets',
            value: 'Never write cold copy from scratch. Access daily cold email/DM hooks, objection demolition scripts, and live commercial citations tailored to current corporate buying cycles.',
            inline: false
          }
        ]
      });

      const welcomeEmbed2 = createBrandedEmbed({
        title: '🚪 MANDATORY ONBOARDING: UNLOCK YOUR FULL ACCESS',
        description: [
          'To maintain our elite standard and protect proprietary deal data, new members start with restricted access.\n',
          `**Follow these 2 simple steps to unlock the full server:**\n`,
          `**1️⃣ Review the Protocols**: Read through <#${rulesChan?.id || 'rules'}> to understand our community standards.`,
          `**2️⃣ Introduce Yourself within 24 Hours**: Head over to <#${introsChan?.id || 'intros-and-networking'}> and post:`,
          `> • **Your Name / Agency / Business**`,
          `> • **Your Core Service & Expertise**`,
          `> • **The Primary Industries / Niches You Target**`,
          '',
          '⚡ **Instant Unlock**: Upon posting your introduction, our bot will automatically assign you the **`Community Member`** role, granting full access to the **Industrial News Room**, **Deal Room**, **Society Discussion**, and **Strategy Voice Lounges**!'
        ].join('\n'),
        color: BRAND.COLOR_SUCCESS
      });

      const existingMsgs = await welcomeChan.messages.fetch({ limit: 30 }).catch(() => null);
      let found1 = null;
      let found2 = null;

      if (existingMsgs) {
        for (const [, msg] of existingMsgs) {
          if (msg.author.id === client.user.id && msg.embeds.length > 0) {
            const title = msg.embeds[0].title || '';
            if (title.includes('WELCOME TO DEAD LEAD SOCIETY')) found1 = msg;
            if (title.includes('MANDATORY ONBOARDING')) found2 = msg;
          }
          // Clean up automated pin notification system messages
          if (msg.type === MessageType.ChannelPinnedMessage) {
            await msg.delete().catch(() => {});
          }
        }
      }

      if (found1) {
        await found1.edit({ embeds: [welcomeEmbed1] });
        logger.channel('Updated existing #welcome manifesto embed in-place.');
      } else {
        await welcomeChan.send({ embeds: [welcomeEmbed1] });
        logger.channel('Posted new #welcome manifesto embed.');
      }

      if (found2) {
        await found2.edit({ embeds: [welcomeEmbed2] });
        if (!found2.pinned) await found2.pin().catch(() => {});
        logger.channel('Updated existing #welcome onboarding embed in-place.');
      } else {
        const msg2 = await welcomeChan.send({ embeds: [welcomeEmbed2] });
        await msg2.pin().catch(() => {});
        logger.channel('Posted and pinned new #welcome onboarding embed.');
      }
    }

    // =========================================================================
    // 2. POPULATE #rules
    // =========================================================================
    if (rulesChan) {
      logger.channel('Synchronizing operational rules in #rules...');

      const rulesEmbed = createBrandedEmbed({
        title: '📜 DEAD LEAD SOCIETY: OPERATIONAL PROTOCOLS & CODE OF CONDUCT',
        description: [
          '***High Signal. Zero Fluff. Strict Accountability.***\n',
          'Membership in Dead Lead Society is a privilege. Every rule below is strictly enforced to protect member data, maintain signal clarity, and foster a high-performance environment:\n'
        ].join('\n'),
        color: BRAND.COLOR_DANGER,
        fields: [
          {
            name: '⏱️ Rule 1: Mandatory 24-Hour Introduction Requirement',
            value: 'Every newly joined member **must post an introduction** in <#intros-and-networking> within **24 hours** of entering the server.\n*Penalty*: Failure to introduce yourself within 24 hours will permanently restrict your view strictly to `START HERE`. To regain access, you will be required to contact an **ADMIN** for manual review.',
            inline: false
          },
          {
            name: '⚡ Rule 2: 7-Day Inactivity Strike & Removal Policy',
            value: 'This society thrives on active deal execution and collaborative intelligence. Members who remain inactive for **7 consecutive days** (no check-ins, no discussions, zero engagement) will be automatically pruned and removed/banned to preserve our high-signal collective.',
            inline: false
          },
          {
            name: '🚫 Rule 3: Strict Zero-Tolerance for Unsolicited DMs / Cold Pitching',
            value: 'Pitching, scraping member lists, or sending unsolicited sales offers, affiliate links, or promotional DMs to fellow members without explicit prior consent is strictly prohibited.\n*Penalty*: **Immediate, permanent ban** without warning or second chances.',
            inline: false
          },
          {
            name: '🔒 Rule 4: Deal Room & Proprietary Lead Confidentiality',
            value: 'All pipeline data, lead identities, contract values, and conversation transcripts shared in <#deal-room> and <#lead-strategies> are strictly confidential. Exposing or sharing member data outside this server will result in instant expulsion and permanent blacklisting.',
            inline: false
          },
          {
            name: '💎 Rule 5: High Signal-to-Noise & Proof of Execution',
            value: 'No low-effort tire kicking, generic guru quotes, or promotional spam. We value real campaign metrics, A/B test results, cold email open/reply data, and actionable B2B revive strategies.',
            inline: false
          },
          {
            name: '🤝 Rule 6: High-Status Professional Conduct & Mutual Respect',
            value: 'Treat fellow operators, agency founders, and specialists with institutional respect. Constructive critique, sharp debate, and intellectual challenge are welcomed; toxicity, harassment, or bad-faith behavior will not be tolerated.',
            inline: false
          }
        ]
      });

      const existingRulesMsgs = await rulesChan.messages.fetch({ limit: 30 }).catch(() => null);
      let foundRules = null;

      if (existingRulesMsgs) {
        for (const [, msg] of existingRulesMsgs) {
          if (msg.author.id === client.user.id && msg.embeds.length > 0) {
            const title = msg.embeds[0].title || '';
            if (title.includes('OPERATIONAL PROTOCOLS')) foundRules = msg;
          }
          // Clean up automated pin notification system messages
          if (msg.type === MessageType.ChannelPinnedMessage) {
            await msg.delete().catch(() => {});
          }
        }
      }

      if (foundRules) {
        await foundRules.edit({ embeds: [rulesEmbed] });
        if (!foundRules.pinned) await foundRules.pin().catch(() => {});
        logger.channel('Updated existing #rules embed in-place.');
      } else {
        const msgRules = await rulesChan.send({ embeds: [rulesEmbed] });
        await msgRules.pin().catch(() => {});
        logger.channel('Posted and pinned new #rules embed.');
      }
    }

    logger.boot('Welcome and rules synchronization complete (zero duplicates).');
  } catch (error) {
    logger.error(`Error populating welcome/rules: ${error.message}`, error);
  } finally {
    client.destroy();
    process.exit(0);
  }
});

client.login(config.token).catch(err => {
  logger.error(`Failed to connect to Discord: ${err.message}`);
  process.exit(1);
});
