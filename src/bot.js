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

// Import Core Services
const scheduler = require('./services/scheduler');
const onboardingService = require('./services/onboardingService');
const mentorService = require('./services/mentorService');
const autopsyService = require('./services/autopsyService');
const { startHealthServer, stopHealthServer } = require('./services/healthServer');

// Handle unhandled rejections and process errors safely
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception caught:', error);
});

logger.boot('Dead Lead Society Bot is starting...');

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

// Initialize Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Register slash commands collection
client.commands = new Collection();
client.commands.set(setupCommand.data.name, setupCommand);
client.commands.set(auditCommand.data.name, auditCommand);
client.commands.set(newsCommand.data.name, newsCommand);
client.commands.set(reanimateCommand.data.name, reanimateCommand);
client.commands.set(roastCommand.data.name, roastCommand);
client.commands.set(triggerCommand.data.name, triggerCommand);
client.commands.set(applyCommand.data.name, applyCommand);

// Bot Ready Event
client.once(Events.ClientReady, () => {
  logger.boot(`Logged in as ${client.user.tag} (ID: ${client.user.id})`);
  logger.boot('Connected successfully.');
  logger.boot(`Serving in ${client.guilds.cache.size} guild(s).`);

  // Initialize automated news & autopsy schedules
  scheduler.init(client);

  // Set rich presence
  client.user.setPresence({
    activities: [{
      name: 'Zodiac | /reanimate | /roast | /trigger',
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

  // 2. Handle Button Clicks (Autopsy Reveals, Apply Buttons)
  if (interaction.isButton()) {
    try {
      if (interaction.customId.startsWith('btn_reveal_autopsy_')) {
        await autopsyService.handleButtonClick(interaction);
      } else if (interaction.customId === 'btn_trigger_apply') {
        const modal = applyCommand.buildVipModal();
        await interaction.showModal(modal);
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

  // 3. Prefix Command Fallbacks (!reanimate, !roast, !trigger, !apply, !vip)
  const trimmed = message.content.trim();

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

// Client Error Event
client.on('error', (error) => {
  logger.error('Discord client encountered an error:', error);
});

// Graceful shutdown
const shutdown = async (signal) => {
  logger.boot(`Received ${signal}. Shutting down bot gracefully...`);
  await stopHealthServer();
  scheduler.destroy();
  client.destroy();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Connect to Discord Gateway
client.login(config.token).catch((err) => {
  logger.error(`Failed to connect to Discord Gateway: ${err.message}`);
  process.exit(1);
});
