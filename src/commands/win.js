const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');
const { createBrandedEmbed, BRAND, channelMatches } = require('../utils/helpers');
const logger = require('../utils/logger');

const WINS_FILE = path.join(__dirname, '../../data/wins.json');

function loadWinsData() {
  try {
    if (fs.existsSync(WINS_FILE)) {
      return JSON.parse(fs.readFileSync(WINS_FILE, 'utf8'));
    }
  } catch (err) {
    logger.error(`Error loading wins data: ${err.message}`);
  }
  return { totalRevenue: 145000, wins: [] };
}

function saveWinsData(data) {
  try {
    const dir = path.dirname(WINS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(WINS_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    logger.error(`Error saving wins data: ${err.message}`);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('win')
    .setDescription('Log a closed deal, reanimated lead, or outbound victory to the community ticker')
    .setDMPermission(false)
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Total Deal Value / Retainer ($USD)')
        .setRequired(true)
        .setMinValue(50)
    )
    .addStringOption(option =>
      option
        .setName('win_type')
        .setDescription('Select type of milestone')
        .setRequired(true)
        .addChoices(
          { name: '🧟 Reanimated Dead Lead', value: 'Reanimated Dead Lead' },
          { name: '🤝 Closed Retainer Client', value: 'Closed Retainer Client' },
          { name: '📅 High-Ticket Discovery Meeting Booked', value: 'Meeting Booked' },
          { name: '💬 First High-Value Cold Reply', value: 'Positive Cold Reply' }
        )
    )
    .addStringOption(option =>
      option
        .setName('story')
        .setDescription('Briefly share what script, trigger, or angle unlocked this victory')
        .setRequired(true)
    ),

  /**
   * Execute /win
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const winType = interaction.options.getString('win_type');
    const story = interaction.options.getString('story');

    logger.command(`User ${interaction.user.tag} logged win: $${amount} [${winType}]`);

    const data = loadWinsData();
    data.totalRevenue = (data.totalRevenue || 0) + amount;
    data.wins.push({
      userId: interaction.user.id,
      username: interaction.user.tag,
      amount,
      winType,
      story,
      timestamp: Date.now()
    });
    saveWinsData(data);

    const winEmbed = createBrandedEmbed({
      title: `🎉 REVENUE EVENT LOGGED: $${amount.toLocaleString()} [${winType.toUpperCase()}]`,
      description: [
        `**Operator**: <@${interaction.user.id}> (\`${interaction.user.displayName}\`)`,
        `**Milestone**: \`${winType}\``,
        `**Value Added**: \`+$${amount.toLocaleString()} USD\`\n`,
        '---',
        `### 📖 Execution Notes:`,
        `> *"${story}"*\n`,
        '---',
        `### 🏆 Total Pipeline Resurrected by Society:`,
        `# **$${data.totalRevenue.toLocaleString()} USD**`,
        '\n*Proof of execution separates operators from spectators. Keep compounding.*'
      ].join('\n'),
      color: BRAND.COLOR_SUCCESS,
      fields: [
        {
          name: '👑 The Proof Room & Inner Circle',
          value: '*For verified six-figure deal autopsies and uncensored client win breakdowns, explore **The Inner Circle** (`/apply`).*',
          inline: false
        }
      ]
    });

    await interaction.reply({ embeds: [winEmbed] });

    // Also broadcast to #wins or #proof-room if different channel
    try {
      const winsChan = interaction.guild?.channels.cache.find(c =>
        channelMatches(c.name, 'wins') ||
        channelMatches(c.name, 'proof-room')
      );
      if (winsChan && winsChan.id !== interaction.channelId && winsChan.isTextBased()) {
        await winsChan.send({ embeds: [winEmbed] }).catch(() => {});
      }
    } catch {
      // Non-critical
    }
  },

  loadWinsData,
  saveWinsData
};
