const { Client, GatewayIntentBits } = require('discord.js');
const { config } = require('../config');
const logger = require('../utils/logger');

const STRAY_CHANNEL_IDS = [
  '1551347186334437479', // duplicate website-intelligence in IC category
  '1551347188549030029', // duplicate linkedin-intelligence in IC category
  '1551347190360965160', // duplicate social-intelligence in IC category
  '1551347191891759226', // duplicate technology-intelligence in IC category
  '1551347195075235860'  // duplicate competitor-research in IC category
];

const RENAMES_MAP = {
  // Free Research Lab channels
  '1551325088350077050': '🏢・company-research',
  '1551325091067854991': '👤・prospect-research',
  '1551325093324521502': '🌐・website-intelligence',
  '1551325094976954532': '💼・linkedin-intelligence',
  '1551325098441572362': '📱・social-intelligence',
  '1551325100899303486': '💻・technology-intelligence',
  '1551325103193718876': '🕵️・competitor-research',

  // IC Reanimation lost-deals
  '1551325381272019117': '📉・lost-deals',

  // Voice channels
  '1551325464490942475': '🎧 ｜ Outreach Lab',
  '1551325487261810810': '🔒 ｜ IC Private Research',
  '1551325490336235662': '🔒 ｜ Founder Office Hours',
  '1551325492588584970': '🔒 ｜ Closed War Room'
};

const delay = ms => new Promise(r => setTimeout(r, ms));
const withTimeout = (p, ms) => Promise.race([
  p,
  new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout (${ms}ms)`)), ms))
]);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('clientReady', async () => {
  logger.boot('Finalizing channel names and cleaning up stray duplicates...');
  const guild = await client.guilds.fetch(config.guildId);
  await guild.channels.fetch();

  // 1. Delete the 5 stray duplicates created in IC category
  logger.channel('--- Cleaning Stray Channels ---');
  for (const id of STRAY_CHANNEL_IDS) {
    const ch = guild.channels.cache.get(id);
    if (ch) {
      try {
        await ch.delete('Clean up duplicate channel in wrong category');
        logger.channel(`Deleted duplicate channel #${ch.name} (${id})`);
        await delay(350);
      } catch (err) {
        logger.warn(`Could not delete channel ${id}: ${err.message}`);
      }
    }
  }

  // 2. Rename the remaining channels to include their emoji
  logger.channel('--- Renaming Remaining Channels with Emojis ---');
  for (const [id, newName] of Object.entries(RENAMES_MAP)) {
    const ch = guild.channels.cache.get(id);
    if (ch && ch.name !== newName) {
      try {
        await withTimeout(ch.setName(newName, 'Dead Lead Society: Add fitting emoji'), 3000);
        logger.channel(`Renamed [${id}]: "${ch.name}" -> "${newName}"`);
        await delay(450);
      } catch (err) {
        logger.warn(`Could not rename [${id}] "${ch.name}": ${err.message}`);
      }
    } else if (ch) {
      logger.channel(`Channel [${id}] already matches: "${newName}"`);
    }
  }

  // 3. Rename category 1551325155945619457 to 🗣️ ┃ OUTREACH LAB (with timeout)
  const outreachCat = guild.channels.cache.get('1551325155945619457');
  if (outreachCat && outreachCat.name !== '🗣️ ┃ OUTREACH LAB') {
    try {
      await withTimeout(outreachCat.setName('🗣️ ┃ OUTREACH LAB', 'Dead Lead Society: Category Fix'), 2500);
      logger.channel(`Renamed Category: "${outreachCat.name}" -> "🗣️ ┃ OUTREACH LAB"`);
    } catch (err) {
      logger.warn(`Outreach Lab category under 10m rate limit, will settle shortly: ${err.message}`);
    }
  }

  logger.boot('Finalization script completed.');
  client.destroy();
  process.exit(0);
});

client.login(config.token);
