const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const scheduler = require('../services/scheduler');
const newsService = require('../services/newsService');
const logger = require('../utils/logger');
const { hasAdminPermissions } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('news')
    .setDescription('Fetch and broadcast or preview the latest B2B sales & lead generation news')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('action')
        .setDescription('Choose whether to post to the announcements channel or preview privately')
        .setRequired(false)
        .addChoices(
          { name: '📢 Post to Announcements', value: 'post' },
          { name: '👁️ Preview Privately', value: 'preview' }
        )
    ),

  /**
   * Execute /news command
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    logger.command(`User ${interaction.user.tag} invoked /news in "${interaction.guild.name}"`);

    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({
        content: '❌ **Access Denied**: You must have Administrator or Manage Server permissions to use `/news`.',
        ephemeral: true
      });
    }

    const action = interaction.options.getString('action') || 'post';

    if (action === 'preview') {
      await interaction.deferReply({ ephemeral: true });
      try {
        const articles = await newsService.fetchArticles({ limit: 3, ignoreCache: true });
        const embeds = newsService.formatNewsEmbeds(articles, { isManual: true });
        await interaction.editReply({
          content: '👁️ **Private Preview: [PART 1/5] 🌐 Macro Industrial & Capital Report:**',
          embeds: [embeds[0]]
        });
        if (embeds[1]) {
          await interaction.followUp({
            content: '👁️ **Private Preview: [PART 2/5] 📊 The Daily Top 30 Niche Matrix (Ranks #1 - #15):**',
            embeds: [embeds[1]],
            ephemeral: true
          });
        }
        if (embeds[2]) {
          await interaction.followUp({
            content: '👁️ **Private Preview: [PART 3/5] 📊 The Daily Top 30 Niche Matrix (Ranks #16 - #30):**',
            embeds: [embeds[2]],
            ephemeral: true
          });
        }
        if (embeds[3]) {
          await interaction.followUp({
            content: '👁️ **Private Preview: [PART 4/5] 🏆 The Apex Triad (Top 3 Outreach Targets):**',
            embeds: [embeds[3]],
            ephemeral: true
          });
        }
        if (embeds[4]) {
          await interaction.followUp({
            content: '👁️ **Private Preview: [PART 5/5] ⚡ Weaponized Outreach & Dead Lead Revival Playbook:**',
            embeds: [embeds[4]],
            ephemeral: true
          });
        }
      } catch (err) {
        await interaction.editReply({
          content: `❌ Failed to fetch news preview: ${err.message}`
        });
      }
      return;
    }

    // Broadcast to the server's news/announcements channel
    await interaction.deferReply({ ephemeral: true });

    try {
      const result = await scheduler.postNewsUpdate(interaction.guild, { isManual: true });
      if (result.success) {
        const channelList = result.channelNames
          ? result.channelNames.map(c => `\`#${c}\``).join(', ')
          : `\`#${result.channelName}\``;
        await interaction.editReply({
          content: `✅ Successfully dispatched 5-part institutional intelligence suite across ${channelList}!`
        });
      } else {
        await interaction.editReply({
          content: `❌ Failed to post news update: ${result.error}`
        });
      }
    } catch (error) {
      logger.error(`Error in /news command: ${error.message}`, error);
      await interaction.editReply({
        content: `❌ An unexpected error occurred: ${error.message}`
      });
    }
  }
};
