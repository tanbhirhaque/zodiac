const { Client, GatewayIntentBits } = require('discord.js');
const { config } = require('../config');
const logger = require('../utils/logger');

const CATEGORY_DIRECT_MAP = [
  // Inner Circle categories first
  { id: '1551325325089181737', name: '👑 ┃ IC: LIVE RESEARCH LAB' },
  { id: '1551325337550585876', name: '👑 ┃ IC: LEAD BUILDING' },
  { id: '1551325356768632974', name: '👑 ┃ IC: OUTREACH EXPERIMENTS' },
  { id: '1551325372002468030', name: '🧟 ┃ IC: REANIMATION LAB' },
  { id: '1551325386967744532', name: '🧠 ┃ IC: INTELLIGENCE VAULT' },
  { id: '1551325405737255014', name: '🏆 ┃ IC: PROOF ROOM' },
  { id: '1551325430487974080', name: '💎 ┃ IC: VIP RESOURCES' },
  { id: '1551325444786229278', name: '📈 ┃ IC: ACCOUNT GROWTH' },
  { id: '1551325460657344703', name: '🔊 ┃ OPEN VOICE SUITE' },
  { id: '1551325484481118381', name: '🔒 ┃ IC: PRIVATE WAR ROOMS' },
  // Open Society categories
  { id: '1551325012924043264', name: '🚪 ┃ START HERE' },
  { id: '1551325036319739984', name: '🧭 ┃ MARKET INTELLIGENCE' },
  { id: '1551325052287459419', name: '🎯 ┃ ICP LAB' },
  { id: '1551325069781762068', name: '👤 ┃ BUYER INTELLIGENCE' },
  { id: '1551325086592667778', name: '🔬 ┃ RESEARCH LAB' },
  { id: '1551325105483948093', name: '🛰️ ┃ SIGNAL INTELLIGENCE' },
  { id: '1551325134479163392', name: '🧲 ┃ LEAD FACTORY' },
  { id: '1551325155945619457', name: '🗣️ ┃ OUTREACH LAB' },
  { id: '1551325182805934099', name: '🧪 ┃ MESSAGE LAB' },
  { id: '1551325207308926976', name: '🪦 ┃ THE GRAVEYARD' },
  { id: '1551325223544950985', name: '🩺 ┃ THE AUTOPSY' },
  { id: '1551325239370195064', name: '🤝 ┃ SALES & CLOSING' },
  { id: '1551325263051366431', name: '💰 ┃ CLIENT REVENUE' },
  { id: '1551325284525936722', name: '📚 ┃ RESOURCE VAULT' }
];

const delay = ms => new Promise(r => setTimeout(r, ms));
const withTimeout = (p, ms) => Promise.race([
  p,
  new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout (${ms}ms)`)), ms))
]);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('clientReady', async () => {
  logger.boot('Starting direct category name synchronization...');
  const guild = await client.guilds.fetch(config.guildId);
  await guild.channels.fetch();

  for (const item of CATEGORY_DIRECT_MAP) {
    const cat = guild.channels.cache.get(item.id);
    if (cat) {
      if (cat.name !== item.name) {
        try {
          await withTimeout(cat.setName(item.name, 'Dead Lead Society: Category Reorganization'), 3500);
          logger.channel(`Renamed Category [${item.id}]: "${cat.name}" -> "${item.name}"`);
          await delay(500);
        } catch (err) {
          logger.warn(`Could not rename category ${item.id} ("${cat.name}"): ${err.message}`);
        }
      } else {
        logger.channel(`Category [${item.id}] already matches: "${item.name}"`);
      }
    } else {
      logger.warn(`Category not found by ID: ${item.id}`);
    }
  }

  logger.boot('Direct category synchronization completed.');
  client.destroy();
  process.exit(0);
});

client.login(config.token);
