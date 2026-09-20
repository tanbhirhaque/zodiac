const { Client, GatewayIntentBits, Events, MessageType } = require('discord.js');
const { config, validateConfig } = require('../config');
const { createBrandedEmbed, BRAND, channelMatches } = require('../utils/helpers');
const logger = require('../utils/logger');

const validation = validateConfig({ requireGuildId: true });
if (!validation.valid) {
  logger.error('Cannot populate onboarding channels due to missing configuration:');
  validation.errors.forEach(err => logger.error(` - ${err}`));
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once(Events.ClientReady, async () => {
  logger.boot('Populating START HERE onboarding channels (idempotent mode)...');

  try {
    const guild = await client.guilds.fetch(config.guildId);
    if (!guild) {
      logger.error(`Guild ${config.guildId} not found.`);
      process.exit(1);
    }

    await guild.channels.fetch();

    const welcomeChan = guild.channels.cache.find(c => channelMatches(c.name, 'welcome'));
    const rulesChan = guild.channels.cache.find(c => channelMatches(c.name, 'rules'));
    const howChan = guild.channels.cache.find(c => channelMatches(c.name, 'how-the-society-works'));
    const mapChan = guild.channels.cache.find(c => channelMatches(c.name, 'server-map'));
    const introChan = guild.channels.cache.find(c => channelMatches(c.name, 'introductions') || channelMatches(c.name, 'intros-and-networking'));

    // Helper to post or update embed idempotently
    const syncEmbed = async (channel, embed, searchTitle, { pin = false } = {}) => {
      if (!channel) return;
      const msgs = await channel.messages.fetch({ limit: 20 }).catch(() => null);
      let found = null;

      if (msgs) {
        for (const [, msg] of msgs) {
          if (msg.author.id === client.user.id && msg.embeds.length > 0) {
            const title = msg.embeds[0].title || '';
            if (title.includes(searchTitle)) {
              found = msg;
              break;
            }
          }
          if (msg.type === MessageType.ChannelPinnedMessage) {
            await msg.delete().catch(() => {});
          }
        }
      }

      if (found) {
        await found.edit({ embeds: [embed] });
        logger.channel(`Updated existing #${channel.name} [${searchTitle}] embed in-place.`);
      } else {
        const sent = await channel.send({ embeds: [embed] });
        if (pin) await sent.pin().catch(() => {});
        logger.channel(`Posted new #${channel.name} [${searchTitle}] embed.`);
      }
    };

    // =========================================================================
    // 1. POPULATE #welcome
    // =========================================================================
    if (welcomeChan) {
      logger.channel('Synchronizing manifesto in #welcome...');

      const welcomeEmbed1 = createBrandedEmbed({
        title: '🪦 WELCOME TO DEAD LEAD SOCIETY',
        description: [
          '***"Where Dead Leads Get a Second Chance."***\n',
          'Some leads do not say no.',
          'They simply disappear.\n',
          'In modern B2B, **over 90% of sales opportunities stall, ghost, or die in procurement bureaucracy**. Most agencies and sales teams abandon these leads, burning thousands of dollars chasing cold new traffic.',
          '',
          '**Dead Lead Society was founded on a proven truth:**',
          '> *A stalled prospect who already engaged with your offer has 5x more latent commercial value than a complete stranger—if you possess the market intelligence, diagnosis, and psychology to reanimate them.*',
          '',
          'This is **NOT** a generic cold email group. This is an institutional intelligence society for understanding markets, identifying buyers, engineering conversations, winning clients, and compounding lifetime value.'
        ].join('\n'),
        color: BRAND.COLOR_PRIMARY,
        fields: [
          {
            name: '🔄 The Complete Client Acquisition Journey',
            value: '`MARKET` → `ICP` → `BUYER` → `RESEARCH` → `SIGNAL` → `LEAD` → `QUALIFICATION` → `OUTREACH` → `CONVERSATION` → `DISCOVERY` → `PROPOSAL` → `NEGOTIATION` → `CLIENT` → `RETENTION` → `EXPANSION` → `REFERRAL`',
            inline: false
          },
          {
            name: '🧟 The Dead Lead Reanimation Loop',
            value: '`DEAD LEAD` → `AUTOPSY` → `DIAGNOSIS` → `RE-STRATEGY` → `REANIMATION`',
            inline: false
          }
        ]
      });

      const welcomeEmbed2 = createBrandedEmbed({
        title: '🏛️ MEMBERSHIP ARCHITECTURE: YOUR SOCIETY CREDENTIALS',
        description: [
          '**🏛️ SOCIETY MEMBER (Full Institutional Access)**',
          '• **Status**: *Official Society Membership*',
          '• Unrestricted access to all **14 core departments**: Market Intelligence, ICP Engineering, Buyer Psychology, Signal Tracking, Lead Factory, Multi-Channel Outreach, Graveyard & Forensic Autopsy Forums, and Resource Vaults.\n',
          '🚪 **How to Activate Your Society Access:**',
          `1. Review the operational protocols in <#${rulesChan?.id || 'rules'}>.`,
          `2. Post your background in <#${introChan?.id || 'introductions'}> within **24 hours** (Name, Agency/Business, Core Service, Target Niches).`,
          '3. **Zodiac** will automatically grant you the **`Society Member`** credential!'
        ].join('\n'),
        color: BRAND.COLOR_SUCCESS
      });

      const welcomeEmbed3 = createBrandedEmbed({
        title: '👑 THE INNER CIRCLE: VIP OPERATOR PRIVILEGES',
        description: [
          '***The Private Syndicate for High-Ticket Client Acquisition & Pipeline Reanimation.***\n',
          'For agency founders, enterprise sales specialists, and operators running active campaigns who require **direct live execution, custom pipeline construction, and hands-on deal reanimation**.\n',
          '### 💎 Exclusive VIP Privileges & Capabilities:'
        ].join('\n'),
        color: 0x8E44AD, // Royal Obsidian / VIP Purple
        fields: [
          {
            name: '🔬 1. Live Account & Prospect Teardowns',
            value: 'Direct live teardowns of your active enterprise targets, C-suite buying committee mapping, and live intent signal extraction before sending outreach.',
            inline: false
          },
          {
            name: '🧲 2. Bespoke Lead Building & Custom Scrapers',
            value: 'Private custom list-building workflows, verified C-suite contact scraping, and proprietary lead scoring algorithms tailored to your exact offer.',
            inline: false
          },
          {
            name: '🧪 3. Live Outreach Experiments & Copy Labs',
            value: 'Live A/B testing of your outbound sequences, inbox deliverability audits, and high-ticket messaging tear-downs by veteran operators before spending capital.',
            inline: false
          },
          {
            name: '🧟 4. Signature Dead Lead Reanimation Sprints',
            value: 'Private deployment of battle-tested ghost-recovery campaigns, psychological break-up scripts, and irresistible Second Chance Offers to resurrect stalled pipeline into active revenue.',
            inline: false
          },
          {
            name: '🧠 5. Proprietary Intelligence Vault & Toolkits',
            value: 'Unrestricted access to confidential 7-figure acquisition playbooks, proprietary agency SOPs, legal contract/retainer templates, and Tier-1 market databases.',
            inline: false
          },
          {
            name: '🔒 6. Private War Rooms & Founder Office Hours',
            value: 'Direct audio access to high-stakes strategy sessions, closed-door deal reviews, and private mastermind sprints with the Founder.',
            inline: false
          },
          {
            name: '🏆 7. The Proof Room',
            value: 'Uncensored access to verified case studies, six-figure deal breakdowns, and real-time client win forensics.',
            inline: false
          },
          {
            name: '👑 VIP Admission Pathway',
            value: 'Inner Circle seats are curated and limited to active operators. For evaluation criteria and private onboarding, reach out directly to the **Founder**.',
            inline: false
          }
        ]
      });

      await syncEmbed(welcomeChan, welcomeEmbed1, 'WELCOME TO DEAD LEAD SOCIETY');
      await syncEmbed(welcomeChan, welcomeEmbed2, 'MEMBERSHIP ARCHITECTURE', { pin: true });
      await syncEmbed(welcomeChan, welcomeEmbed3, 'THE INNER CIRCLE: VIP OPERATOR PRIVILEGES', { pin: true });
    }

    // =========================================================================
    // 2. POPULATE #rules
    // =========================================================================
    if (rulesChan) {
      logger.channel('Synchronizing operational rules in #rules...');

      const rulesEmbed = createBrandedEmbed({
        title: '📜 OPERATIONAL PROTOCOLS & CODE OF CONDUCT',
        description: [
          '***High Signal. Zero Fluff. Strict Accountability.***\n',
          'Membership in Dead Lead Society is a privilege. Every rule below is strictly enforced to protect member data, maintain signal clarity, and foster a high-performance environment:\n'
        ].join('\n'),
        color: BRAND.COLOR_DANGER,
        fields: [
          {
            name: '⏱️ Protocol 1: Mandatory Introduction Requirement',
            value: `Every new member must post their background in <#${introChan?.id || 'introductions'}> within **24 hours** of joining to unlock access beyond START HERE.`,
            inline: false
          },
          {
            name: '🚫 Protocol 2: Zero-Tolerance for Unsolicited DMs & Cold Pitching',
            value: 'Pitching, scraping member lists, or sending unsolicited sales offers, affiliate links, or promotional DMs to fellow members is strictly prohibited.\n*Penalty*: **Immediate, permanent ban** without warning.',
            inline: false
          },
          {
            name: '🔒 Protocol 3: Deal Room & Proprietary Lead Confidentiality',
            value: 'All pipeline data, lead identities, contract values, and transcripts shared in society laboratories are confidential. Exposing member data outside this server results in permanent blacklisting.',
            inline: false
          },
          {
            name: '💎 Protocol 4: Proof of Execution & High Signal-to-Noise',
            value: 'No low-effort tire kicking, generic guru quotes, or promotional spam. Share real campaign metrics, A/B test results, cold email open/reply data, and actionable B2B revive strategies.',
            inline: false
          },
          {
            name: '🤝 Protocol 5: High-Status Professional Conduct',
            value: 'Treat fellow operators, agency founders, and specialists with institutional respect. Constructive critique, sharp debate, and intellectual challenge are welcomed; toxicity is not.',
            inline: false
          }
        ]
      });

      await syncEmbed(rulesChan, rulesEmbed, 'OPERATIONAL PROTOCOLS', { pin: true });
    }

    // =========================================================================
    // 3. POPULATE #how-the-society-works
    // =========================================================================
    if (howChan) {
      logger.channel('Synchronizing operating guide in #how-the-society-works...');

      const howEmbed = createBrandedEmbed({
        title: '⚙️ HOW THE SOCIETY OPERATES',
        description: [
          'Dead Lead Society is organized around the complete customer acquisition and monetization lifecycle.',
          '',
          '### 📚 Standard Resource-Post Format',
          'To keep the **Resource Vault** institutional and avoid unstructured link dumps, all shared tools, templates, and frameworks must use this format:\n',
          '```text',
          'RESOURCE NAME: [Tool/Template Name]',
          'CATEGORY: [e.g. Lead Database / Outreach / AI / CRM]',
          'WHAT IT DOES: [1-2 concise sentences]',
          'WHO SHOULD USE IT: [Target agency / sales role]',
          'BEST USE CASE: [Specific scenario where it excels]',
          'TOOL PRICING: [Open / Freemium / Commercial ($/mo)]',
          'ALTERNATIVES: [Comparable tools]',
          'HOW TO USE: [Actionable step-by-step or link]',
          'COMMUNITY NOTES: [Your personal experience / caveats]',
          '```\n',
          '### 🪦 Using The Graveyard & The Autopsy Forums',
          '• **The Graveyard**: When an account goes cold, ghosted, or rejected, create a post with appropriate diagnostic tags (`ICP`, `Buyer`, `Timing`, `Signal`, `Message`, `Offer`, `Price`).',
          '• **The Autopsy**: Break down why the deal stalled. Submit message transcripts, offer angles, and objections for collaborative community diagnosis.'
        ].join('\n'),
        color: BRAND.COLOR_INFO
      });

      await syncEmbed(howChan, howEmbed, 'HOW THE SOCIETY OPERATES', { pin: true });
    }

    // =========================================================================
    // 4. POPULATE #server-map
    // =========================================================================
    if (mapChan) {
      logger.channel('Synchronizing architectural map in #server-map...');

      const mapEmbed = createBrandedEmbed({
        title: '🗺️ DEAD LEAD SOCIETY: COMPLETE SERVER MAP',
        description: [
          'Navigate the society using the sequential customer acquisition pipeline:\n',
          '```text',
          '1.  🚪 START HERE            → Onboarding, Rules & Introductions',
          '2.  🧭 MARKET INTELLIGENCE   → Macro Research, Gaps & Demand Signals',
          '3.  🎯 ICP LAB               → Ideal Customer Profile Frameworks & Fit',
          '4.  👤 BUYER INTELLIGENCE    → Decision-Makers, Committees & Psychology',
          '5.  🔬 RESEARCH LAB          → Company, Website & LinkedIn Recon',
          '6.  🛰️ SIGNAL INTELLIGENCE   → Hiring, Funding & Leadership Triggers',
          '7.  🧲 LEAD FACTORY          → Sourcing, Enrichment & Lead Scoring',
          '8.  🗣️ OUTREACH LAB          → Email, LinkedIn, Phone, Video & Referrals',
          '9.  🧪 MESSAGE LAB           → Openers, Personalization & Follow-Ups',
          '10. 🪦 THE GRAVEYARD (Forum) → Documenting Ghosted & Stalled Deals',
          '11. 🩺 THE AUTOPSY (Forum)   → Forensic Diagnosis of Failed Pipeline',
          '12. 🤝 SALES & CLOSING       → Discovery, Proposals & Negotiation',
          '13. 💰 CLIENT REVENUE        → Onboarding, Retention, Upsells & LTV',
          '14. 📚 RESOURCE VAULT        → Curated Tools, Frameworks & Case Studies',
          '------------------------------------------------------------------',
          '👑  THE INNER CIRCLE (VIP EXECUTION) → Private Execution, Labs & Reanimation',
          '    • Live Research Lab      → Real-Time Account Teardowns',
          '    • Lead Building Room     → Bespoke Account & Contact Construction',
          '    • Outreach Experiments   → Live A/B Split Testing & Optimization',
          '    • Reanimation Lab        → Signature Revival Sprints on Dead Deals',
          '    • Intelligence Vault     → Proprietary Enterprise Frameworks',
          '    • Proof Room (Forum)     → Verified Revenue & Revival Breakthroughs',
          '    • Inner Circle Resources → Private Scrapers, Decks & SOPs',
          '    • Account Growth         → Enterprise Expansion & Retention Engines',
          '    • Voice Suite            → War Rooms & Private Office Hours',
          '```\n',
          'Use this architecture to diagnose exactly where your pipeline is breaking down and deploy targeted community intelligence.'
        ].join('\n'),
        color: BRAND.COLOR_PRIMARY
      });

      await syncEmbed(mapChan, mapEmbed, 'COMPLETE SERVER MAP', { pin: true });
    }

    logger.boot('START HERE onboarding synchronization complete (zero duplicates).');
  } catch (error) {
    logger.error(`Error populating onboarding channels: ${error.message}`, error);
  } finally {
    client.destroy();
    process.exit(0);
  }
});

client.login(config.token).catch(err => {
  logger.error(`Failed to connect to Discord: ${err.message}`);
  process.exit(1);
});
