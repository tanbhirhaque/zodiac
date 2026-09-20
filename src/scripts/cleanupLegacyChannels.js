const { Client, GatewayIntentBits, Events } = require('discord.js');
const { config } = require('../config');
const logger = require('../utils/logger');

const LEGACY_CHANNEL_IDS = [
  // Channels
  '1549568991926812802', // intros-and-networking
  '1549568989993242694', // general-discussion
  '1549568998746628226', // deal-room
  '1549568996184039496', // lead-strategies
  '1549569002702118934', // Community Lounge
  '1549569005314900068', // Strategy Session
  '1549590019922985050', // macro-market-trends
  '1549590022783762523', // apex-outreach-picks
  '1549590025346490430', // weaponized-playbooks
  '1549590017318457365', // daily-top-30
  '1549584591772323844', // industrial-news-room
  '1549590029666623599', // seller-decision-room
  // Categories
  '1549568977599078473', // 📌 START HERE
  '1549568987241644155', // 💬 THE SOCIETY
  '1549568994137088050', // 💼 LEAD REVIVAL
  '1549569000512688219', // 🔊 VOICE LOUNGE
  '1549590015397466163'  // 📊 ︱ INDUSTRIAL NEWS ROOM
];

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, async () => {
  logger.boot('Starting legacy channel cleanup...');
  try {
    const guild = await client.guilds.fetch(config.guildId);
    if (!guild) {
      logger.error('Target guild not found.');
      process.exit(1);
    }

    await guild.channels.fetch();

    let deletedCount = 0;
    for (const channelId of LEGACY_CHANNEL_IDS) {
      const channel = guild.channels.cache.get(channelId);
      if (channel) {
        try {
          await channel.delete('Removing legacy channels in favor of 158-channel institutional architecture');
          logger.channel(`Deleted legacy channel/category: "${channel.name}" (ID: ${channel.id})`);
          deletedCount++;
        } catch (err) {
          logger.warn(`Could not delete "${channel.name}": ${err.message}`);
        }
      }
    }

    logger.boot(`Cleanup complete. Deleted ${deletedCount} legacy channels/categories.`);
  } catch (error) {
    logger.error(`Error during legacy cleanup: ${error.message}`, error);
  } finally {
    client.destroy();
    process.exit(0);
  }
});

client.login(config.token).catch(err => {
  logger.error(`Login error: ${err.message}`);
  process.exit(1);
});
