const { Client, GatewayIntentBits, Events } = require('discord.js');
const { config } = require('../config');
const logger = require('../utils/logger');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, async () => {
  try {
    const guild = await client.guilds.fetch(config.guildId);
    if (!guild) {
      logger.error('Guild not found.');
      process.exit(1);
    }

    const me = await guild.members.fetchMe();
    await me.setNickname('Zodiac');
    logger.boot(`Server nickname successfully changed to: "${me.displayName}"`);
  } catch (error) {
    logger.error(`Failed to change nickname: ${error.message}`);
  } finally {
    client.destroy();
    process.exit(0);
  }
});

client.login(config.token).catch(err => {
  logger.error(`Login error: ${err.message}`);
  process.exit(1);
});
