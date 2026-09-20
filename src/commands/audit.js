const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { loadServerStructure } = require('../config');
const roleManager = require('../services/roleManager');
const channelManager = require('../services/channelManager');
const logger = require('../utils/logger');
const { hasAdminPermissions, checkBotPermissions, createBrandedEmbed, BRAND } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('audit')
    .setDescription('Inspect server structure, bot permissions, and detect missing or duplicate resources')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  /**
   * Execute /audit command
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    logger.command(`User ${interaction.user.tag} invoked /audit in "${interaction.guild.name}"`);

    // Verify administrator / manage guild permissions
    if (!hasAdminPermissions(interaction.member)) {
      return interaction.reply({
        content: '❌ **Access Denied**: You must have Administrator or Manage Server permissions to run `/audit`.',
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: false });

    try {
      const guild = interaction.guild;
      const client = interaction.client;
      let structure;

      try {
        structure = loadServerStructure();
      } catch (err) {
        return interaction.editReply({
          content: `❌ **Configuration Error**: Failed to load \`server-structure.json\`: ${err.message}`
        });
      }

      // 1. Bot & Server Status
      const botPerms = checkBotPermissions(guild);
      const pingText = client.ws.ping >= 0 ? `${Math.round(client.ws.ping)} ms` : 'Connecting...';
      const totalGuildMembers = guild.memberCount;

      // 2. Audit Roles
      const roleAudit = roleManager.auditRoles(guild, structure.roles || []);

      // 3. Audit Channels & Categories
      const channelAudit = channelManager.auditChannels(guild, structure.categories || []);

      // 4. Determine Overall Setup Status
      const totalMissing = roleAudit.missing.length + channelAudit.missingCategories.length + channelAudit.missingChannels.length;
      const totalConfiguredItems = (structure.roles?.length || 0) +
        (structure.categories?.length || 0) +
        (structure.categories?.reduce((acc, cat) => acc + (cat.channels?.length || 0), 0) || 0);

      let statusBadge = '🟢 Fully Configured';
      let statusColor = BRAND.COLOR_SUCCESS;

      if (totalMissing === totalConfiguredItems) {
        statusBadge = '🔴 Not Configured (Run `/setup` to initialize)';
        statusColor = BRAND.COLOR_DANGER;
      } else if (totalMissing > 0) {
        statusBadge = `🟡 Partially Configured (${totalMissing} items missing)`;
        statusColor = BRAND.COLOR_WARNING;
      }

      // Format missing resources list
      const missingList = [];
      if (roleAudit.missing.length > 0) {
        missingList.push(`**Roles**: ${roleAudit.missing.map(r => `\`${r}\``).join(', ')}`);
      }
      if (channelAudit.missingCategories.length > 0) {
        missingList.push(`**Categories**: ${channelAudit.missingCategories.map(c => `\`${c}\``).join(', ')}`);
      }
      if (channelAudit.missingChannels.length > 0) {
        missingList.push(`**Channels**: ${channelAudit.missingChannels.slice(0, 6).map(c => `\`${c}\``).join(', ')}${channelAudit.missingChannels.length > 6 ? ` *(+${channelAudit.missingChannels.length - 6} more)*` : ''}`);
      }

      // Format duplicates list
      const allDuplicates = [...roleAudit.duplicates, ...channelAudit.duplicates];

      const fields = [
        {
          name: '📡 System & Server Health',
          value: [
            `• **Server**: ${guild.name} (\`${guild.id}\`)`,
            `• **Members**: ${totalGuildMembers}`,
            `• **WebSocket Latency**: \`${pingText}\``,
            `• **Setup Status**: ${statusBadge}`
          ].join('\n'),
          inline: false
        },
        {
          name: '🛡️ Bot Permissions',
          value: botPerms.hasAll
            ? '✅ All required permissions granted (`Manage Channels`, `Manage Roles`, `View Channels`, `Send Messages`, `Embed Links`)'
            : `⚠️ **Missing Permissions**: ${botPerms.missing.map(p => `\`${p}\``).join(', ')}`,
          inline: false
        },
        {
          name: '📊 Guild Totals',
          value: [
            `• Categories: **${guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size}**`,
            `• Text Channels: **${guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size}**`,
            `• Voice Channels: **${guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size}**`,
            `• Forum Channels: **${guild.channels.cache.filter(c => c.type === ChannelType.GuildForum).size}**`,
            `• Roles: **${guild.roles.cache.size}**`
          ].join('\n'),
          inline: true
        },
        {
          name: '🎯 Structure Match',
          value: [
            `• Configured Roles: **${roleAudit.existing.length}/${structure.roles?.length || 0}** found`,
            `• Configured Categories: **${channelAudit.existingCategories.length}/${structure.categories?.length || 0}** found`,
            `• Configured Channels: **${channelAudit.existingChannels.length}** found`
          ].join('\n'),
          inline: true
        }
      ];

      if (missingList.length > 0) {
        fields.push({
          name: '🔍 Missing Configured Resources',
          value: missingList.join('\n'),
          inline: false
        });
      }

      if (allDuplicates.length > 0) {
        fields.push({
          name: '⚠️ Duplicate Resources Detected',
          value: allDuplicates.map(d => `• ${d}`).join('\n'),
          inline: false
        });
      }

      const embed = createBrandedEmbed({
        title: `📋 Server Audit — ${guild.name}`,
        description: `Audit inspection against \`server-structure.json\` configuration.`,
        color: statusColor,
        fields
      });

      logger.audit(`Completed /audit report for "${guild.name}"`);
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      logger.error(`Error executing /audit: ${error.message}`, error);
      const errorEmbed = createBrandedEmbed({
        title: '❌ Audit Execution Failed',
        description: `An unexpected error occurred during audit:\n\`\`\`${error.message}\`\`\``,
        color: BRAND.COLOR_DANGER
      });
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
