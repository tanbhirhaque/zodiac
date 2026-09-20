const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');
const { createBrandedEmbed, BRAND } = require('../utils/helpers');
const logger = require('../utils/logger');

const STREAKS_FILE = path.join(__dirname, '../../data/streaks.json');

function loadStreaks() {
  try {
    if (fs.existsSync(STREAKS_FILE)) {
      return JSON.parse(fs.readFileSync(STREAKS_FILE, 'utf8'));
    }
  } catch (err) {
    logger.error(`Error loading streaks: ${err.message}`);
  }
  return {};
}

function saveStreaks(data) {
  try {
    const dir = path.dirname(STREAKS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STREAKS_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    logger.error(`Error saving streaks: ${err.message}`);
  }
}

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('streak')
    .setDescription('Log your daily outbound activity and track your consistency streak')
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('action')
        .setDescription('Choose whether to log today\'s reps or view your streak stats')
        .setRequired(true)
        .addChoices(
          { name: '🔥 Log Today\'s Outbound Activity', value: 'log' },
          { name: '📊 View Current Streak & Lifetime Stats', value: 'view' }
        )
    )
    .addIntegerOption(option =>
      option
        .setName('emails')
        .setDescription('Number of cold emails sent today')
        .setRequired(false)
        .setMinValue(0)
    )
    .addIntegerOption(option =>
      option
        .setName('dms')
        .setDescription('Number of LinkedIn / Social DMs sent today')
        .setRequired(false)
        .setMinValue(0)
    )
    .addIntegerOption(option =>
      option
        .setName('calls')
        .setDescription('Number of cold calls made today')
        .setRequired(false)
        .setMinValue(0)
    ),

  /**
   * Execute /streak
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const action = interaction.options.getString('action');
    const emails = interaction.options.getInteger('emails') || 0;
    const dms = interaction.options.getInteger('dms') || 0;
    const calls = interaction.options.getInteger('calls') || 0;

    const userId = interaction.user.id;
    const today = getTodayString();
    const streaks = loadStreaks();

    let userStat = streaks[userId] || {
      username: interaction.user.tag,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      totalEmails: 0,
      totalDMs: 0,
      totalCalls: 0
    };

    if (action === 'log') {
      const totalRepsToday = emails + dms + calls;
      if (totalRepsToday === 0) {
        return interaction.reply({
          content: '⚠️ Please specify at least one activity (emails, DMs, or calls) when logging outbound.',
          ephemeral: true
        });
      }

      // Check date continuity
      if (!userStat.lastActiveDate) {
        userStat.currentStreak = 1;
      } else if (userStat.lastActiveDate === today) {
        // Already logged today, keep streak
      } else {
        const lastDate = new Date(userStat.lastActiveDate);
        const currentDate = new Date(today);
        const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          userStat.currentStreak += 1;
        } else {
          userStat.currentStreak = 1; // Reset streak
        }
      }

      userStat.lastActiveDate = today;
      userStat.totalEmails += emails;
      userStat.totalDMs += dms;
      userStat.totalCalls += calls;
      if (userStat.currentStreak > userStat.longestStreak) {
        userStat.longestStreak = userStat.currentStreak;
      }

      streaks[userId] = userStat;
      saveStreaks(streaks);

      logger.command(`User ${interaction.user.tag} logged streak: ${userStat.currentStreak} days (+${totalRepsToday} reps)`);

      const embed = createBrandedEmbed({
        title: `🔥 OUTBOUND DISCIPLINE LOGGED: DAY ${userStat.currentStreak} STREAK`,
        description: [
          `**Operator**: <@${userId}>\n`,
          `### 🎯 Today\'s Reps:`,
          `• **Cold Emails**: \`${emails}\``,
          `• **Social / LinkedIn DMs**: \`${dms}\``,
          `• **Cold Calls**: \`${calls}\``,
          `• **Total Daily Output**: \`${totalRepsToday} touches\`\n`,
          '---',
          `### 🏆 Streak Status:`,
          `🔥 **Current Active Streak**: **${userStat.currentStreak} Days**`,
          `⭐ **Personal Best**: **${userStat.longestStreak} Days**`,
          '\n> *"Outbound success is not talent. It is ruthless, mathematical consistency over 90 days."*'
        ].join('\n'),
        color: BRAND.COLOR_PRIMARY
      });

      await interaction.reply({ embeds: [embed] });
    } else {
      const embed = createBrandedEmbed({
        title: `📊 OUTBOUND LIFETIME STATS: ${interaction.user.displayName.toUpperCase()}`,
        description: [
          `**Operator**: <@${userId}>\n`,
          `🔥 **Current Streak**: \`${userStat.currentStreak} Days Consecutive\``,
          `⭐ **Longest Streak**: \`${userStat.longestStreak} Days\``,
          `📅 **Last Active**: \`${userStat.lastActiveDate || 'Never logged'}\`\n`,
          '---',
          `### 📈 Lifetime Volume Generated:`,
          `• **Total Cold Emails**: \`${userStat.totalEmails.toLocaleString()}\``,
          `• **Total Social / LinkedIn DMs**: \`${userStat.totalDMs.toLocaleString()}\``,
          `• **Total Cold Calls**: \`${userStat.totalCalls.toLocaleString()}\``,
          `• **Total Outbound Pipeline Reps**: \`${(userStat.totalEmails + userStat.totalDMs + userStat.totalCalls).toLocaleString()}\``
        ].join('\n'),
        color: BRAND.COLOR_INFO
      });

      await interaction.reply({ embeds: [embed] });
    }
  },

  loadStreaks,
  saveStreaks
};
