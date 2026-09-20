const { REST, Routes } = require('discord.js');
const { config, validateConfig } = require('./config');
const logger = require('./utils/logger');
const setupCommand = require('./commands/setup');
const auditCommand = require('./commands/audit');
const newsCommand = require('./commands/news');

/**
 * Slash command registration script.
 * Executed via: npm run deploy
 */
async function deployCommands() {
  logger.boot('Preparing slash command deployment...');

  // Validate credentials
  const validation = validateConfig({ requireGuildId: false });
  if (!validation.valid) {
    logger.error('Cannot deploy slash commands due to missing configuration:');
    validation.errors.forEach(err => logger.error(` - ${err}`));
    logger.info('Please update your .env file with valid credentials before running "npm run deploy".');
    process.exit(1);
  }

  const commands = [
    setupCommand.data.toJSON(),
    auditCommand.data.toJSON(),
    newsCommand.data.toJSON()
  ];

  const rest = new REST({ version: '10' }).setToken(config.token);

  try {
    logger.command(`Deploying ${commands.length} application (/) commands...`);

    if (config.guildId) {
      // Guild-specific deployment (instant update)
      logger.command(`Targeting guild ID: ${config.guildId}`);
      const data = await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands }
      );
      logger.boot(`Successfully registered ${data.length} guild slash commands!`);
    } else {
      // Global deployment (takes up to an hour across Discord CDN)
      logger.command('No GUILD_ID provided. Registering globally across Discord...');
      const data = await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commands }
      );
      logger.boot(`Successfully registered ${data.length} global slash commands!`);
    }
  } catch (error) {
    logger.error(`Deployment failed: ${error.message}`, error);
    process.exit(1);
  }
}

deployCommands();
