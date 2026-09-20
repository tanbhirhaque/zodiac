const { Client, Collection, GatewayIntentBits, ActivityType, Events } = require('discord.js');
const { config, validateConfig } = require('./config');
const logger = require('./utils/logger');
const setupCommand = require('./commands/setup');
const auditCommand = require('./commands/audit');
const newsCommand = require('./commands/news');
const scheduler = require('./services/scheduler');
const onboardingService = require('./services/onboardingService');
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

// Initialize Discord Client with Guilds and GuildMessages intents
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

// Bot Ready Event
client.once(Events.ClientReady, () => {
  logger.boot(`Logged in as ${client.user.tag} (ID: ${client.user.id})`);
  logger.boot('Connected successfully.');
  logger.boot(`Serving in ${client.guilds.cache.size} guild(s).`);

  // Initialize automated 9:00 AM & 7:00 PM news jobs
  scheduler.init(client);

  // Set rich presence
  client.user.setPresence({
    activities: [{
      name: 'Reviving Dead Leads | /news',
      type: ActivityType.Custom,
      state: 'Reviving Dead Leads | /news'
    }],
    status: 'online'
  });
});

// Slash Command Interaction Router
client.on(Events.InteractionCreate, async (interaction) => {
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

// Automatic Onboarding & Introduction Verification Router
client.on(Events.MessageCreate, async (message) => {
  try {
    await onboardingService.handleMessage(message);
  } catch (error) {
    logger.error(`Error in messageCreate onboarding handler: ${error.message}`, error);
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
