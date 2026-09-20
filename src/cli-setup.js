const { Client, GatewayIntentBits, Events } = require('discord.js');
const { config, validateConfig } = require('./config');
const logger = require('./utils/logger');
const serverSetup = require('./services/serverSetup');
const roleManager = require('./services/roleManager');
const channelManager = require('./services/channelManager');
const { loadServerStructure } = require('./config');

async function runCliSetup() {
  const validation = validateConfig({ requireGuildId: true });
  if (!validation.valid) {
    logger.error('Missing configuration:');
    validation.errors.forEach(err => logger.error(` - ${err}`));
    process.exit(1);
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds]
  });

  client.once(Events.ClientReady, async () => {
    try {
      logger.boot(`Connected to Discord as ${client.user.tag}`);
      logger.setup(`Fetching target guild: ${config.guildId}...`);

      const guild = await client.guilds.fetch(config.guildId);
      logger.setup(`Found guild: "${guild.name}" (${guild.memberCount} members)`);

      // 1. Audit before setup
      const structure = loadServerStructure();
      const roleAudit = roleManager.auditRoles(guild, structure.roles);
      const channelAudit = channelManager.auditChannels(guild, structure.categories);

      logger.audit(`Audit before setup: ${roleAudit.existing.length}/${structure.roles.length} roles exist; ${channelAudit.existingCategories.length}/${structure.categories.length} categories exist; ${channelAudit.missingChannels.length} channels missing.`);

      // 2. Run Idempotent Server Setup
      logger.setup(`Executing server synchronization...`);
      const result = await serverSetup.syncServer(guild, { dryRun: false });

      if (result.success) {
        logger.setup(`[SUCCESS] Server structure is fully synchronized!`);
        logger.setup(`- Roles Created: ${result.summary.rolesCreated.length} (Existing: ${result.summary.rolesExisting.length})`);
        logger.setup(`- Categories Created: ${result.summary.categoriesCreated.length} (Existing: ${result.summary.categoriesExisting.length})`);
        logger.setup(`- Channels Created: ${result.summary.channelsCreated.length} (Existing: ${result.summary.channelsExisting.length})`);
      } else {
        logger.warn(`Setup finished with notices:`);
        result.summary.errors.forEach(e => logger.error(` - ${e}`));
      }
    } catch (error) {
      logger.error(`Setup encountered an error: ${error.message}`, error);
    } finally {
      client.destroy();
      logger.boot('CLI setup complete.');
      process.exit(0);
    }
  });

  client.login(config.token).catch(err => {
    logger.error(`Failed to login: ${err.message}`);
    process.exit(1);
  });
}

runCliSetup();
