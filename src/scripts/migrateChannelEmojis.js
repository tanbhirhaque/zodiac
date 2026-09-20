const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { config, validateConfig } = require('../config');
const logger = require('../utils/logger');
const { channelMatches, normalizeChannelName } = require('../utils/helpers');

const validation = validateConfig({ requireGuildId: true });
if (!validation.valid) {
  logger.error('Cannot run migration due to missing configuration:');
  validation.errors.forEach(err => logger.error(` - ${err}`));
  process.exit(1);
}

// Category mappings: old normalized/partial name -> new institutional name
const CATEGORY_MAP = {
  'start here': '🚪 ┃ START HERE',
  'market intelligence': '🧭 ┃ MARKET INTELLIGENCE',
  'icp lab': '🎯 ┃ ICP LAB',
  'buyer intelligence': '👤 ┃ BUYER INTELLIGENCE',
  'research lab': '🔬 ┃ RESEARCH LAB',
  'signal intelligence': '🛰️ ┃ SIGNAL INTELLIGENCE',
  'lead factory': '🧲 ┃ LEAD FACTORY',
  'outreach lab': '🗣️ ┃ OUTREACH LAB',
  'message lab': '🧪 ┃ MESSAGE LAB',
  'the graveyard': '🪦 ┃ THE GRAVEYARD',
  'the autopsy': '🩺 ┃ THE AUTOPSY',
  'sales closing': '🤝 ┃ SALES & CLOSING',
  'sales & closing': '🤝 ┃ SALES & CLOSING',
  'client revenue': '💰 ┃ CLIENT REVENUE',
  'resource vault': '📚 ┃ RESOURCE VAULT',
  'open society voice': '🔊 ┃ OPEN VOICE SUITE',
  'live research lab': '👑 ┃ IC: LIVE RESEARCH LAB',
  'lead building room': '👑 ┃ IC: LEAD BUILDING',
  'outreach experiment lab': '👑 ┃ IC: OUTREACH EXPERIMENTS',
  'reanimation lab': '🧟 ┃ IC: REANIMATION LAB',
  'intelligence vault': '🧠 ┃ IC: INTELLIGENCE VAULT',
  'proof room': '🏆 ┃ IC: PROOF ROOM',
  'inner circle resources': '💎 ┃ IC: VIP RESOURCES',
  'account growth': '📈 ┃ IC: ACCOUNT GROWTH',
  'inner circle voice': '🔒 ┃ IC: PRIVATE WAR ROOMS'
};

// Channel mappings: old normalized channel name -> new emoji-enhanced name
const CHANNEL_MAP = {
  // START HERE
  'welcome': '👋・welcome',
  'rules': '📜・rules',
  'how-the-society-works': '⚙️・how-the-society-works',
  'server-map': '🗺️・server-map',
  'introductions': '💬・introductions',
  'announcements': '📢・announcements',

  // MARKET INTELLIGENCE
  'market-research': '📊・market-research',
  'industry-research': '🏢・industry-research',
  'market-trends': '📈・market-trends',
  'market-gaps': '🕳️・market-gaps',
  'competitor-intelligence': '🕵️・competitor-intelligence',
  'demand-signals': '⚡・demand-signals',

  // ICP LAB
  'icp-framework': '📐・icp-framework',
  'icp-research': '🔍・icp-research',
  'niche-selection': '🎯・niche-selection',
  'account-fit': '🧩・account-fit',
  'icp-case-studies': '📑・icp-case-studies',
  'icp-resources': '🗂️・icp-resources',

  // BUYER INTELLIGENCE
  'buyer-persona': '👤・buyer-persona',
  'decision-makers': '👔・decision-makers',
  'buying-committee': '👥・buying-committee',
  'pain-points': '🩹・pain-points',
  'triggers': '💡・triggers',
  'buyer-psychology': '🧠・buyer-psychology',
  'buyer-interviews': '🎙️・buyer-interviews',

  // RESEARCH LAB
  'company-recon': '🏢・company-recon',
  'website-intel': '🌐・website-intel',
  'financial-intel': '💹・financial-intel',
  'tech-stack-intel': '💻・tech-stack-intel',
  'linkedin-recon': '💼・linkedin-recon',
  'job-posting-intel': '📋・job-posting-intel',
  'research-tools': '🛠️・research-tools',

  // SIGNAL INTELLIGENCE
  'hiring-signals': '🚀・hiring-signals',
  'funding-signals': '💰・funding-signals',
  'executive-moves': '♟️・executive-moves',
  'tech-change-signals': '🔄・tech-change-signals',
  'intent-data': '🎯・intent-data',
  'news-triggers': '📰・news-triggers',
  'signal-stacks': '🥞・signal-stacks',
  'signal-templates': '📋・signal-templates',

  // LEAD FACTORY
  'lead-sourcing': '⛏️・lead-sourcing',
  'lead-generation': '🧲・lead-generation',
  'lead-enrichment': '✨・lead-enrichment',
  'data-hygiene': '🧼・data-hygiene',
  'lead-verification': '✅・lead-verification',
  'lead-scoring': '📊・lead-scoring',
  'lead-databases': '🗄️・lead-databases',

  // OUTREACH LAB
  'cold-email': '✉️・cold-email',
  'cold-calling': '📞・cold-calling',
  'linkedin-outreach': '💼・linkedin-outreach',
  'video-outreach': '🎥・video-outreach',
  'multi-channel': '🔀・multi-channel',
  'follow-up-strategy': '🔁・follow-up-strategy',
  'deliverability': '📬・deliverability',
  'outreach-tools': '⚙️・outreach-tools',

  // MESSAGE LAB
  'subject-lines': '🎯・subject-lines',
  'cold-hooks': '🪝・cold-hooks',
  'problem-statements': '⚠️・problem-statements',
  'value-propositions': '💎・value-propositions',
  'call-to-action': '🔘・call-to-action',
  'message-frameworks': '📐・message-frameworks',
  'personalization': '🎨・personalization',

  // THE GRAVEYARD
  'dead-leads': '🪦・dead-leads',
  'ghosted': '👻・ghosted',
  'not-interested': '🚫・not-interested',
  'bad-timing': '⏳・bad-timing',
  'lost-deals': '📉・lost-deals',
  'resurrection-pit': '⚰️・resurrection-pit',

  // THE AUTOPSY
  'lead-autopsy': '🩺・lead-autopsy',
  'message-autopsy': '📝・message-autopsy',
  'offer-autopsy': '🏷️・offer-autopsy',
  'conversation-autopsy': '💬・conversation-autopsy',
  'deal-autopsy': '🔍・deal-autopsy',

  // SALES & CLOSING
  'discovery-calls': '🎙️・discovery-calls',
  'qualification': '🎯・qualification',
  'sales-demo': '🖥️・sales-demo',
  'objection-handling': '🛡️・objection-handling',
  'pricing-strategy': '🏷️・pricing-strategy',
  'proposal-lab': '📑・proposal-lab',
  'closing': '🤝・closing',

  // CLIENT REVENUE
  'client-onboarding': '🚀・client-onboarding',
  'client-delivery': '📦・client-delivery',
  'account-retention': '🔒・account-retention',
  'upselling': '📈・upselling',
  'cross-selling': '🔀・cross-selling',
  'client-referrals': '🎁・client-referrals',
  'churn-prevention': '🦺・churn-prevention',
  'ltv-optimization': '💎・ltv-optimization',

  // RESOURCE VAULT
  'prompts': '🤖・prompts',
  'templates': '📄・templates',
  'scripts': '📜・scripts',
  'frameworks': '📐・frameworks',
  'checklists': '📋・checklists',
  'swipe-files': '📂・swipe-files',
  'tools-stack': '🧰・tools-stack',
  'books': '📚・books',
  'podcasts': '🎧・podcasts',
  'newsletters': '📰・newsletters',
  'agencies': '🏢・agencies',
  'free-databases': '🗄️・free-databases',
  'free-scrapers': '🕷️・free-scrapers',
  'job-boards': '📌・job-boards',
  'chrome-extensions': '🧩・chrome-extensions',

  // BUYER INTELLIGENCE (Additional)
  'jobs-to-be-done': '🎯・jobs-to-be-done',
  'buyer-research': '🔍・buyer-research',

  // RESEARCH LAB (Additional)
  'company-research': '🏢・company-research',
  'prospect-research': '👤・prospect-research',
  'website-intelligence': '🌐・website-intelligence',
  'linkedin-intelligence': '💼・linkedin-intelligence',
  'social-intelligence': '📱・social-intelligence',
  'technology-intelligence': '💻・technology-intelligence',
  'competitor-research': '🕵️・competitor-research',

  // SIGNAL INTELLIGENCE (Additional)
  'buying-signals': '⚡・buying-signals',
  'intent-signals': '🎯・intent-signals',
  'expansion-signals': '🚀・expansion-signals',
  'leadership-changes': '♟️・leadership-changes',
  'technology-signals': '🔄・technology-signals',
  'trigger-events': '💥・trigger-events',

  // LEAD FACTORY (Additional)
  'lead-qualification': '🎯・lead-qualification',
  'account-lists': '📋・account-lists',
  'contact-finding': '🔍・contact-finding',

  // OUTREACH LAB (Additional)
  'social-dm': '💬・social-dm',
  'referral-outreach': '🎁・referral-outreach',
  'warm-introduction': '🤝・warm-introduction',
  'networking': '🌐・networking',

  // MESSAGE LAB (Additional)
  'opening-lines': '🪝・opening-lines',
  'follow-ups': '🔁・follow-ups',
  'outreach-experiments': '🔬・outreach-experiments',

  // THE GRAVEYARD (Additional)
  'rejected': '🚫・rejected',
  'no-response': '🔇・no-response',
  'failed-outreach': '📉・failed-outreach',

  // SALES & CLOSING (Additional)
  'discovery-call': '🎙️・discovery-call',
  'sales-conversation': '💬・sales-conversation',
  'proposal': '📑・proposal',
  'negotiation': '⚖️・negotiation',

  // CLIENT REVENUE (Additional)
  'client-retention': '🔒・client-retention',
  'upsell': '📈・upsell',
  'cross-sell': '🔀・cross-sell',
  'account-growth': '📊・account-growth',
  'recurring-revenue': '🔁・recurring-revenue',
  'referrals': '🎁・referrals',
  'lifetime-value': '💎・lifetime-value',

  // RESOURCE VAULT (Additional)
  'email-tools': '✉️・email-tools',
  'linkedin-tools': '💼・linkedin-tools',
  'crm-tools': '🗂️・crm-tools',
  'automation-tools': '⚡・automation-tools',
  'ai-tools': '🤖・ai-tools',
  'sales-tools': '🤝・sales-tools',
  'analytics-tools': '📊・analytics-tools',
  'research-papers': '📑・research-papers',
  'case-studies': '🏆・case-studies',

  // INNER CIRCLE: LIVE RESEARCH LAB
  'live-prospect-research': '🔬・live-prospect-research',
  'live-company-research': '🏢・live-company-research',
  'live-buyer-research': '👤・live-buyer-research',
  'signal-hunting': '🛰️・signal-hunting',

  // INNER CIRCLE: LEAD BUILDING
  'lead-building': '🧲・lead-building',
  'prospect-lists': '📋・prospect-lists',

  // INNER CIRCLE: OUTREACH EXPERIMENTS
  'message-testing': '🧪・message-testing',
  'ab-testing': '📊・ab-testing',
  'personalization-lab': '🎨・personalization-lab',
  'follow-up-lab': '🔁・follow-up-lab',
  'campaign-analysis': '📈・campaign-analysis',

  // INNER CIRCLE: REANIMATION LAB
  'revive-dead-leads': '🧟・revive-dead-leads',
  'ghost-recovery': '👻・ghost-recovery',
  'old-prospect-revival': '🔥・old-prospect-revival',
  'second-chance': '⚡・second-chance',

  // INNER CIRCLE: INTELLIGENCE VAULT
  'advanced-frameworks': '📐・advanced-frameworks',
  'research-database': '🗄️・research-database',
  'buyer-intelligence': '🧠・buyer-intelligence',
  'outreach-intelligence': '📡・outreach-intelligence',
  'private-case-studies': '💎・private-case-studies',
  'advanced-systems': '⚙️・advanced-systems',

  // INNER CIRCLE: PROOF ROOM
  'wins': '🏆・wins',
  'first-reply': '💬・first-reply',
  'first-meeting': '📅・first-meeting',
  'first-client': '🤝・first-client',
  'reanimated-lead': '🧟・reanimated-lead',
  'closed-deal': '💰・closed-deal',
  'retained-client': '🔒・retained-client',
  'account-expansion': '📈・account-expansion',
  'referral': '🎁・referral',

  // INNER CIRCLE: RESOURCES
  'private-templates': '📄・private-templates',
  'private-frameworks': '📐・private-frameworks',
  'private-research': '🔬・private-research',
  'resource-drops': '📦・resource-drops',

  // INNER CIRCLE: ACCOUNT GROWTH
  'client-health': '🩺・client-health',
  'retention-strategy': '🛡️・retention-strategy',
  'expansion-opportunities': '🚀・expansion-opportunities',
  'upsell-lab': '📈・upsell-lab',
  'cross-sell-lab': '🔀・cross-sell-lab',
  'referral-engine': '🎁・referral-engine',

  // VOICE SUITES
  'research room': '🎙️ ｜ Research Room',
  'outreach lab': '🎧 ｜ Outreach Lab',
  'autopsy room': '🩺 ｜ Autopsy Room',
  'reanimation room': '🧟 ｜ Reanimation Room',
  'deal room': '🤝 ｜ Deal Room',
  'office hours': '💼 ｜ Office Hours',
  'society lounge': '☕ ｜ Society Lounge',
  'private research room': '🔒 ｜ IC Private Research',
  'inner circle office hours': '🔒 ｜ Founder Office Hours',
  'war room': '🔒 ｜ Closed War Room'
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, async () => {
  logger.boot('Starting Category & Channel Emoji Migration...');

  try {
    const guild = await client.guilds.fetch(config.guildId);
    if (!guild) {
      logger.error(`Guild ${config.guildId} not found.`);
      process.exit(1);
    }

    await guild.channels.fetch();

    // 1. UPDATE SERVER-STRUCTURE.JSON FIRST
    const structurePath = path.resolve(__dirname, '../../config/server-structure.json');
    const structure = JSON.parse(fs.readFileSync(structurePath, 'utf8'));

    let jsonCategoriesUpdated = 0;
    let jsonChannelsUpdated = 0;

    for (const cat of structure.categories) {
      const normalizedCat = normalizeChannelName(cat.name).replace(/-/g, ' ');
      const newCatName = CATEGORY_MAP[normalizedCat];
      if (newCatName && cat.name !== newCatName) {
        cat.name = newCatName;
        jsonCategoriesUpdated++;
      }

      const isInnerCircle = cat.name.includes('IC:') || cat.name.includes('INNER CIRCLE');
      const isStartHere = cat.name.includes('START HERE');
      const tierTag = isStartHere ? '[ONBOARDING]' : isInnerCircle ? '[INNER CIRCLE]' : '[OPEN SOCIETY]';

      for (const chan of cat.channels) {
        const normalizedChan = normalizeChannelName(chan.name);
        const newChanName = CHANNEL_MAP[normalizedChan] ||
                            CHANNEL_MAP[normalizedChan.replace(/-/g, ' ')] ||
                            CHANNEL_MAP[chan.name.toLowerCase()];
        if (newChanName && chan.name !== newChanName) {
          chan.name = newChanName;
          jsonChannelsUpdated++;
        }

        if (chan.topic && !chan.topic.startsWith('[')) {
          chan.topic = `${tierTag} ${chan.topic}`;
        }
      }
    }

    fs.writeFileSync(structurePath, JSON.stringify(structure, null, 2), 'utf8');
    logger.setup(`Updated server-structure.json (${jsonCategoriesUpdated} categories, ${jsonChannelsUpdated} channels).`);

    // 2. MIGRATE DISCORD LIVE CATEGORIES
    logger.channel('--- Migrating Categories on Discord ---');
    for (const cat of structure.categories) {
      const discordCat = guild.channels.cache.find(
        c => c.type === 4 && (c.name === cat.name || channelMatches(c.name, cat.name))
      );

      if (discordCat && discordCat.name !== cat.name) {
        try {
          await discordCat.setName(cat.name, 'Dead Lead Society: Category Reorganization');
          logger.channel(`Renamed Category: "${discordCat.name}" -> "${cat.name}"`);
          await delay(450);
        } catch (err) {
          logger.warn(`Could not rename category "${discordCat.name}": ${err.message}`);
        }
      }
    }

    // 3. MIGRATE DISCORD LIVE CHANNELS
    logger.channel('--- Migrating Channels on Discord ---');
    let migratedCount = 0;
    let alreadySyncedCount = 0;

    for (const cat of structure.categories) {
      const discordCat = guild.channels.cache.find(
        c => c.type === 4 && (c.name === cat.name || channelMatches(c.name, cat.name))
      );
      const catId = discordCat ? discordCat.id : null;

      for (const chanConfig of cat.channels) {
        // Find existing channel under category
        const discordChan = guild.channels.cache.find(c => {
          if (catId && c.parentId !== catId) return false;
          return c.name === chanConfig.name || channelMatches(c.name, chanConfig.name);
        });

        if (!discordChan) {
          logger.warn(`Channel not found: "${chanConfig.name}" under category "${cat.name}"`);
          continue;
        }

        const needsNameUpdate = discordChan.name !== chanConfig.name;
        const needsTopicUpdate = chanConfig.topic && discordChan.topic !== chanConfig.topic && typeof discordChan.setTopic === 'function';

        if (needsNameUpdate || needsTopicUpdate) {
          try {
            if (needsNameUpdate) {
              await discordChan.setName(chanConfig.name, 'Dead Lead Society: Add fitting emoji');
              logger.channel(`Renamed #${discordChan.name} -> #${chanConfig.name}`);
              await delay(450);
            }
            if (needsTopicUpdate) {
              await discordChan.setTopic(chanConfig.topic);
              await delay(200);
            }
            migratedCount++;
          } catch (chanErr) {
            logger.warn(`Failed to update #${discordChan.name}: ${chanErr.message}`);
            if (chanErr.status === 429) {
              const retryAfter = (chanErr.rawError?.retry_after || 5) * 1000;
              logger.warn(`Rate limited. Waiting ${retryAfter}ms...`);
              await delay(retryAfter + 1000);
            }
          }
        } else {
          alreadySyncedCount++;
        }
      }
    }

    logger.boot(`Migration finished! Updated: ${migratedCount}, Already Synced: ${alreadySyncedCount}.`);
  } catch (error) {
    logger.error(`Migration error: ${error.message}`, error);
  } finally {
    client.destroy();
    process.exit(0);
  }
});

client.login(config.token).catch(err => {
  logger.error(`Failed to connect to Discord: ${err.message}`);
  process.exit(1);
});
