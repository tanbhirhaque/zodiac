const {
  Client,
  Collection,
  GatewayIntentBits,
  ActivityType,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const { config, validateConfig } = require('./config');
const logger = require('./utils/logger');
const { createBrandedEmbed, BRAND } = require('./utils/helpers');

// Import Slash Commands
const setupCommand = require('./commands/setup');
const auditCommand = require('./commands/audit');
const newsCommand = require('./commands/news');
const reanimateCommand = require('./commands/reanimate');
const roastCommand = require('./commands/roast');
const triggerCommand = require('./commands/trigger');
const applyCommand = require('./commands/apply');
const duelCommand = require('./commands/duel');
const calculatorCommand = require('./commands/calculator');
const dnsCommand = require('./commands/dnsScan');
const winCommand = require('./commands/win');
const nicheCommand = require('./commands/nicheMatch');
const streakCommand = require('./commands/streak');
const clauseCommand = require('./commands/clause');

// Import Core Services
const scheduler = require('./services/scheduler');
const onboardingService = require('./services/onboardingService');
const mentorService = require('./services/mentorService');
const autopsyService = require('./services/autopsyService');
const { startHealthServer, stopHealthServer } = require('./services/healthServer');
const welcomeGuideService = require('./services/welcomeGuideService');

// Handle unhandled rejections and process errors safely
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception caught:', error);
});

logger.boot('Zodiac is starting...');

// Start keep-alive HTTP server for 24/7 cloud hosting (Render, Koyeb, Railway)
startHealthServer(config.port);

// Validate environment variables before attempting connection
const validation = validateConfig({ requireGuildId: false });
if (!validation.valid) {
  logger.error('Missing configuration in .env file:');
  validation.errors.forEach(err => logger.error(` - ${err}`));
  logger.info('');
  logger.info('To start the bot:');
  logger.info('1. Open the .env file in the project root.');
  logger.info('2. Add your DISCORD_TOKEN, CLIENT_ID, and GUILD_ID.');
  logger.info('3. Run "npm run deploy" to register slash commands.');
  logger.info('4. Run "npm start" to launch the bot.');
  process.exit(1);
}

let activeClient = null;

function bindEvents(client) {
  // Register slash commands collection (14 total commands)
  client.commands = new Collection();
client.commands.set(setupCommand.data.name, setupCommand);
client.commands.set(auditCommand.data.name, auditCommand);
client.commands.set(newsCommand.data.name, newsCommand);
client.commands.set(reanimateCommand.data.name, reanimateCommand);
client.commands.set(roastCommand.data.name, roastCommand);
client.commands.set(triggerCommand.data.name, triggerCommand);
client.commands.set(applyCommand.data.name, applyCommand);
client.commands.set(duelCommand.data.name, duelCommand);
client.commands.set(calculatorCommand.data.name, calculatorCommand);
client.commands.set(dnsCommand.data.name, dnsCommand);
client.commands.set(winCommand.data.name, winCommand);
client.commands.set(nicheCommand.data.name, nicheCommand);
client.commands.set(streakCommand.data.name, streakCommand);
client.commands.set(clauseCommand.data.name, clauseCommand);

// Bot Ready Event
client.once(Events.ClientReady, () => {
  logger.boot(`Logged in as ${client.user.tag} (ID: ${client.user.id})`);
  logger.boot('Connected successfully.');
  logger.boot(`Serving in ${client.guilds.cache.size} guild(s).`);

  // Initialize automated news & autopsy schedules
  scheduler.init(client);

  // Enforce server display name as Zodiac
  for (const [, guild] of client.guilds.cache) {
    guild.members.fetchMe().then(me => {
      if (me.nickname !== 'Zodiac') me.setNickname('Zodiac').catch(() => {});
    }).catch(() => {});
  }

  // Set rich presence
  client.user.setPresence({
    activities: [{
      name: 'Zodiac | /reanimate | /duel | /apply',
      type: ActivityType.Custom,
      state: 'Zodiac | Reviving Dead Leads'
    }],
    status: 'online'
  });
});

// Interaction Router (Slash Commands, Modals, Buttons)
client.on(Events.InteractionCreate, async (interaction) => {
  // 1. Handle Modal Submissions (VIP Applications)
  if (interaction.isModalSubmit()) {
    try {
      if (interaction.customId === 'modal_vip_apply') {
        await applyCommand.handleModalSubmit(interaction);
      }
    } catch (error) {
      logger.error(`Error handling modal submission: ${error.message}`, error);
    }
    return;
  }

  // 2. Handle Button Clicks (Autopsy Reveals, Apply Buttons, Duel Buttons)
  if (interaction.isButton()) {
    try {
      if (interaction.customId.startsWith('btn_reveal_autopsy_')) {
        await autopsyService.handleButtonClick(interaction);
      } else if (interaction.customId === 'btn_trigger_apply') {
        const modal = applyCommand.buildVipModal();
        await interaction.showModal(modal);
      } else if (interaction.customId.startsWith('btn_duel_')) {
        await duelCommand.handleButtonClick(interaction);
      }
    } catch (error) {
      logger.error(`Error handling button click: ${error.message}`, error);
    }
    return;
  }

  // 3. Handle Slash Commands
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    logger.warn(`Received unknown command: /${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Error handling /${interaction.commandName}: ${error.message}`, error);

    const errorMessage = {
      content: '❌ An unexpected error occurred while executing this command.',
      ephemeral: true
    };

    if (interaction.replied) {
      await interaction.followUp(errorMessage).catch(() => {});
    } else if (interaction.deferred) {
      await interaction.editReply(errorMessage).catch(() => {});
    } else {
      await interaction.reply(errorMessage).catch(() => {});
    }
  }
});

// Message Router (Onboarding, @Zodiac Mentions & Prefix Commands)
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  // 1. Process Onboarding Introduction Verification
  try {
    await onboardingService.handleMessage(message);
  } catch (error) {
    logger.error(`Error in messageCreate onboarding handler: ${error.message}`, error);
  }

  // 2. Tactical AI Mentor Mode (@Zodiac Mentions or !ask)
  if (message.mentions.has(client.user.id) || message.content.startsWith('!ask')) {
    try {
      await mentorService.handleMention(message);
      return;
    } catch (error) {
      logger.error(`Error in mentorService: ${error.message}`, error);
    }
  }

  const trimmed = message.content.trim();

  // 3. Prefix Commands

  // !duel
  if (trimmed.startsWith('!duel')) {
    const obj = duelCommand.getRandomObjection();
    const embed = duelCommand.buildDuelEmbed(obj);
    const row = duelCommand.buildDuelButtons(obj.id);
    await message.reply({ embeds: [embed], components: [row] }).catch(() => {});
    return;
  }

  // !calculator or !math
  if (trimmed.startsWith('!calculator') || trimmed.startsWith('!math')) {
    const parts = trimmed.split(/\s+/).slice(1);
    const leads = parseInt(parts[0], 10) || 25;
    const dealSize = parseInt(parts[1], 10) || 3500;
    const res = calculatorCommand.calculateLostPipeline(leads, dealSize);

    const embed = createBrandedEmbed({
      title: '🪦 LOST PIPELINE REVENUE CALCULATION',
      description: [
        `**Stalled Accounts**: \`${res.deadLeads}\` | **Average Retainer**: \`$${res.dealSize.toLocaleString()}\``,
        `### Total Dormant Value: **$${res.totalValue.toLocaleString()}**\n`,
        `• **10% Conservative Revival**: \`+$${res.conservativeRevive.toLocaleString()}\` net cash`,
        `• **15% Benchmark Revival**: \`+$${res.benchmarkRevive.toLocaleString()}\` net cash`,
        `• **22% High-Execution Revival**: \`+$${res.aggressiveRevive.toLocaleString()}\` net cash\n`,
        '*Run `/calculator` for full interactive quota and domain infrastructure math.*'
      ].join('\n'),
      color: BRAND.COLOR_PRIMARY
    });
    await message.reply({ embeds: [embed] }).catch(() => {});
    return;
  }

  // !dns <domain>
  if (trimmed.startsWith('!dns')) {
    const rawDomain = trimmed.replace(/^!dns\s*/i, '').trim();
    if (!rawDomain) {
      return message.reply({ content: '🔍 **Usage**: `!dns yourdomain.com` (or run `/dns`)' }).catch(() => {});
    }

    try {
      const res = await dnsCommand.scanDomain(rawDomain);
      const embed = createBrandedEmbed({
        title: `🔍 DNS SCAN: ${res.domain.toUpperCase()}`,
        description: [
          `### Status: **${res.badge}**\n`,
          `**SPF**: ${res.spfRecord ? '✅ `VERIFIED`' : '❌ `MISSING`'}`,
          `**DMARC**: ${res.dmarcRecord ? '✅ `CONFIGURED`' : '❌ `MISSING`'}`,
          `**Provider**: \`${res.mailProvider}\``
        ].join('\n'),
        color: res.color,
        fields: res.recommendations.length > 0 ? [{
          name: '🛠️ Recommendations',
          value: res.recommendations.map(r => `• ${r}`).join('\n')
        }] : []
      });
      await message.reply({ embeds: [embed] }).catch(() => {});
    } catch (err) {
      await message.reply({ content: `❌ Error scanning DNS for \`${rawDomain}\`: ${err.message}` }).catch(() => {});
    }
    return;
  }

  // !niche <service>
  if (trimmed.startsWith('!niche')) {
    const embed = createBrandedEmbed({
      title: '🗂️ HIGH-TICKET NICHE MATCHMAKER',
      description: 'Use `/niche` to discover top 3 verified B2B niches, economic buyer titles, and battle-tested hooks for your agency service.',
      color: BRAND.COLOR_PRIMARY
    });
    await message.reply({ embeds: [embed] }).catch(() => {});
    return;
  }

  // !clause
  if (trimmed.startsWith('!clause')) {
    const embed = createBrandedEmbed({
      title: '📑 IRON-CLAD CONTRACT CLAUSE GENERATOR',
      description: 'Deploy `/clause` to generate ready-to-paste contract protections: Kill-Fee, Scope Creep Surcharge, Payment Delinquency Suspension, and IP Withholding.',
      color: BRAND.COLOR_PRIMARY
    });
    await message.reply({ embeds: [embed] }).catch(() => {});
    return;
  }

  // !streak
  if (trimmed.startsWith('!streak')) {
    const embed = createBrandedEmbed({
      title: '🔥 OUTBOUND STREAK & DISCIPLINE TRACKER',
      description: 'Log your daily outbound reps (cold emails, DMs, calls) and track your consistency streak using `/streak`.',
      color: BRAND.COLOR_PRIMARY
    });
    await message.reply({ embeds: [embed] }).catch(() => {});
    return;
  }

  // !reanimate or !autopsy
  if (trimmed.startsWith('!reanimate') || trimmed.startsWith('!autopsy')) {
    const rawInput = trimmed.replace(/^!(reanimate|autopsy)\s*/i, '');
    const prospect = rawInput || 'Enterprise Prospect / Ghosted Deal';
    const data = reanimateCommand.generateReanimationData(prospect, 'Stalled deal submitted via text', 'ghosted_after_proposal');

    const embed = createBrandedEmbed({
      title: '🧟 FORENSIC AUTOPSY & REANIMATION DOSSIER',
      description: [
        `**Target Prospect**: \`${prospect}\`\n`,
        `### 🩺 Cause of Death:\n**${data.causeOfDeath}**`,
        `> ${data.diagnosis}`,
        `\n**Recovery Latency**: \`${data.probability}\``
      ].join('\n'),
      color: BRAND.COLOR_PRIMARY,
      fields: [
        { name: data.script1Title, value: `\`\`\`text\n${data.script1}\n\`\`\``, inline: false },
        { name: data.script2Title, value: `\`\`\`text\n${data.script2}\n\`\`\``, inline: false },
        { name: data.script3Title, value: `\`\`\`text\n${data.script3}\n\`\`\``, inline: false },
        { name: '👑 The Inner Circle', value: '*For custom live pipeline surgery, deploy `/apply` or contact the Founder.*', inline: false }
      ]
    });

    await message.reply({ embeds: [embed] }).catch(() => {});
    return;
  }

  // !roast or !teardown
  if (trimmed.startsWith('!roast') || trimmed.startsWith('!teardown')) {
    const rawCopy = trimmed.replace(/^!(roast|teardown)\s*/i, '');
    if (!rawCopy) {
      return message.reply({ content: '🩸 **Usage**: `!roast [paste your cold email or pitch copy here]` (or use `/roast`)' }).catch(() => {});
    }

    const analysis = roastCommand.analyzeCopy(rawCopy, 'C-Suite Executive');
    const embed = createBrandedEmbed({
      title: '🩸 RUTHLESS OUTREACH TEARDOWN & ROAST',
      description: [
        `**Word Count**: \`${analysis.wordCount}\` | **Self-References**: \`${analysis.selfWords}\`\n`,
        `### Verdict:\n> **${analysis.verdict}**\n`,
        `**Spam Risk**: \`${analysis.spamScore}%\` | **Readability Score**: \`${analysis.readabilityScore}/100\``
      ].join('\n'),
      color: analysis.readabilityScore < 50 ? BRAND.COLOR_DANGER : BRAND.COLOR_WARNING,
      fields: [
        { name: '✨ High-Status Rewrite', value: `\`\`\`text\n${analysis.rewrite}\n\`\`\``, inline: false },
        { name: '👑 Inner Circle Outreach Lab', value: '*Deploy `/apply` to unlock live A/B split testing & deliverability audits.*', inline: false }
      ]
    });

    await message.reply({ embeds: [embed] }).catch(() => {});
    return;
  }

  // !trigger [industry]
  if (trimmed.startsWith('!trigger')) {
    const industryKey = trimmed.replace(/^!trigger\s*/i, '').trim().toLowerCase() || 'saas';
    const industryData = triggerCommand.INDUSTRY_TRIGGERS[industryKey] || triggerCommand.INDUSTRY_TRIGGERS.saas;

    const fields = industryData.triggers.slice(0, 3).map((t, idx) => ({
      name: `${idx + 1}. ${t.signal}`,
      value: `**Trigger**: ${t.why}\n**Hook**: \`${t.hook}\``,
      inline: false
    }));

    fields.push({
      name: '👑 Inner Circle Signal Hunting',
      value: '*Deploy `/trigger` for full 5 signals or `/apply` for custom scraped lists.*',
      inline: false
    });

    const embed = createBrandedEmbed({
      title: `🎯 BUYER INTENT TRIGGERS: ${industryData.name.toUpperCase()}`,
      description: 'Use verified buying triggers to initiate outbound with high authority:',
      color: BRAND.COLOR_SUCCESS,
      fields
    });

    await message.reply({ embeds: [embed] }).catch(() => {});
    return;
  }

  // !apply or !vip
  if (trimmed.startsWith('!apply') || trimmed.startsWith('!vip')) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('btn_trigger_apply')
        .setLabel('Open VIP Application Form')
        .setStyle(ButtonStyle.Success)
        .setEmoji('👑')
    );

    const embed = createBrandedEmbed({
      title: '👑 THE INNER CIRCLE: VIP ADMISSION',
      description: [
        '***The Private Syndicate for High-Ticket Client Acquisition & Pipeline Reanimation.***\n',
        '• **Live Account Teardowns** on your active enterprise targets.',
        '• **Bespoke Lead Building & Custom Scrapers** for your exact offer.',
        '• **Live Copy Split-Testing Labs** & deliverability audits.',
        '• **Signature Dead Lead Reanimation Sprints** with the Founder.\n',
        'Click the button below to submit your evaluation credentials:'
      ].join('\n'),
      color: 0x8E44AD
    });

    await message.reply({ embeds: [embed], components: [row] }).catch(() => {});
    return;
  }
});

  // New Member Join Event (Orientation & Guide)
  client.on(Events.GuildMemberAdd, async (member) => {
    try {
      await welcomeGuideService.handleNewMember(member);
    } catch (error) {
      logger.error(`Error in GuildMemberAdd welcome handler: ${error.message}`, error);
    }
  });

  // Client Error Event
  client.on('error', (error) => {
    logger.error('Discord client encountered an error:', error);
  });
}

// Graceful shutdown
const shutdown = async (signal) => {
  logger.boot(`Received ${signal}. Shutting down bot gracefully...`);
  await stopHealthServer();
  scheduler.destroy();
  if (activeClient) activeClient.destroy();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Connect to Discord Gateway with privileged intent auto-detection
async function startBot() {
  const fullIntents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ];
  const standardIntents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ];

  let client = new Client({ intents: fullIntents });
  bindEvents(client);
  activeClient = client;

  try {
    await client.login(config.token);
    logger.boot('Privileged GuildMembers intent active: Real-time join orientation enabled.');
  } catch (err) {
    if (err.message && err.message.includes('disallowed intents')) {
      logger.warn('[INTENTS] GuildMembers intent not enabled in Discord Developer Portal. Falling back to standard intents...');
      client.destroy();
      client = new Client({ intents: standardIntents });
      bindEvents(client);
      activeClient = client;
      await client.login(config.token);
      logger.boot('Connected successfully with standard intents.');
    } else {
      logger.error(`Failed to connect to Discord Gateway: ${err.message}`);
      process.exit(1);
    }
  }
}

startBot();
