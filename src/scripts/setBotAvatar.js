const { Client, GatewayIntentBits, Events } = require('discord.js');
const { config, validateConfig } = require('../config');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

const validation = validateConfig({ requireGuildId: false });
if (!validation.valid) {
  logger.error('Missing configuration in .env:');
  validation.errors.forEach(e => logger.error(` - ${e}`));
  process.exit(1);
}

const avatarPath = path.resolve(__dirname, '../../assets/zodiac-avatar.png');
if (!fs.existsSync(avatarPath)) {
  logger.error(`Avatar file not found at: ${avatarPath}`);
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, async () => {
  logger.boot(`Connected as ${client.user.tag}. Updating profile photo to Zodiac emblem...`);

  try {
    const avatarBuffer = fs.readFileSync(avatarPath);
    await client.user.setAvatar(avatarBuffer);
    logger.boot(`✅ Successfully updated ${client.user.tag}'s profile avatar!`);
    console.log('AVATAR_UPDATE_SUCCESS');
  } catch (error) {
    logger.error(`Failed to update avatar: ${error.message}`, error);
    console.log('AVATAR_UPDATE_FAILED:', error.message);
  } finally {
    client.destroy();
    process.exit(0);
  }
});

client.login(config.token).catch(err => {
  logger.error(`Failed to login: ${err.message}`);
  process.exit(1);
});
