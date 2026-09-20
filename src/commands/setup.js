const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const serverSetup = require('../services/serverSetup');
const logger = require('../utils/logger');
const { hasAdminPermissions, createBrandedEmbed, BRAND } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configure Dead Lead Society server roles, categories, and channels idempotently')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addBooleanOption(option =>
      option
        .setName('dry_run')
        .setDescription('Simulate the setup process without making real changes in Discord')
        .setRequired(false)
    ),

  /**
   * Execute /setup command
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    logger.command(`User ${interaction.user.tag} invoked /setup in "${interaction.guild.name}"`);

    // Verify administrator / manage guild permissions
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({
        content: '❌ **Access Denied**: You must have Administrator or Manage Server permissions to run `/setup`.',
        ephemeral: true
      });
    }

    // Acknowledge interaction (setup can take a few seconds)
    await interaction.deferReply({ ephemeral: false });

    const dryRun = interaction.options.getBoolean('dry_run') || false;

    try {
      const result = await serverSetup.syncServer(interaction.guild, { dryRun });
      const { summary } = result;

      const formatList = (items, emptyMsg = 'None') => {
        if (!items || items.length === 0) return `*${emptyMsg}*`;
        if (items.length <= 5) return items.map(i => `• \`${i}\``).join('\n');
        return items.slice(0, 5).map(i => `• \`${i}\``).join('\n') + `\n*...and ${items.length - 5} more*`;
      };

      const embedColor = result.success
        ? (dryRun ? BRAND.COLOR_INFO : BRAND.COLOR_SUCCESS)
        : (summary.errors.length > 0 ? BRAND.COLOR_WARNING : BRAND.COLOR_DANGER);

      const title = dryRun
        ? '🔍 Dead Lead Society Setup — Simulation (Dry Run)'
        : (result.success ? '✅ Dead Lead Society Setup — Complete' : '⚠️ Dead Lead Society Setup — Completed with Warnings');

      const description = dryRun
        ? 'Simulated server synchronization. **No changes were made to Discord.**'
        : 'Server synchronization complete. Existing resources were preserved with zero duplicates created.';

      const fields = [
        {
          name: '🎭 Roles',
          value: `Created: **${summary.rolesCreated.length}**\nExisting: **${summary.rolesExisting.length}**\n${formatList(summary.rolesCreated, 'All configured roles existed')}`,
          inline: true
        },
        {
          name: '📁 Categories',
          value: `Created: **${summary.categoriesCreated.length}**\nExisting: **${summary.categoriesExisting.length}**\n${formatList(summary.categoriesCreated, 'All configured categories existed')}`,
          inline: true
        },
        {
          name: '💬 Channels',
          value: `Created: **${summary.channelsCreated.length}**\nExisting: **${summary.channelsExisting.length}**\n${formatList(summary.channelsCreated, 'All configured channels existed')}`,
          inline: true
        }
      ];

      if (summary.errors.length > 0) {
        fields.push({
          name: '⚠️ Warnings / Errors',
          value: summary.errors.slice(0, 4).map(e => `• ${e}`).join('\n'),
          inline: false
        });
      }

      const embed = createBrandedEmbed({
        title,
        description,
        color: embedColor,
        fields
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      logger.error(`Error executing /setup: ${error.message}`, error);
      const errorEmbed = createBrandedEmbed({
        title: '❌ Setup Execution Failed',
        description: `An unexpected error occurred while executing setup:\n\`\`\`${error.message}\`\`\``,
        color: BRAND.COLOR_DANGER
      });
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
