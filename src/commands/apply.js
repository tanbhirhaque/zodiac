const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');
const { createBrandedEmbed, BRAND, channelMatches } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Build the VIP Application Modal
 */
function buildVipModal() {
  const modal = new ModalBuilder()
    .setCustomId('modal_vip_apply')
    .setTitle('The Inner Circle VIP Admission');

  const businessInput = new TextInputBuilder()
    .setCustomId('vip_business')
    .setLabel('Business Name & Core Service / Offer')
    .setPlaceholder('e.g. Acme Acquisition - B2B Cold Outbound for SaaS')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(100);

  const dealSizeInput = new TextInputBuilder()
    .setCustomId('vip_deal_size')
    .setLabel('Target ICP & Average Deal Size / Retainer')
    .setPlaceholder('e.g. Series A Founders, $6,500/mo Retainer')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(100);

  const revenueInput = new TextInputBuilder()
    .setCustomId('vip_revenue')
    .setLabel('Current Monthly Revenue Tier')
    .setPlaceholder('e.g. $5k-$15k/mo, $20k-$50k/mo, $50k+/mo')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(50);

  const bottleneckInput = new TextInputBuilder()
    .setCustomId('vip_bottleneck')
    .setLabel('Primary Pipeline or Reanimation Bottleneck')
    .setPlaceholder('e.g. Leads ghosting after proposal, low cold email deliverability, weak buyer intent...')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(500);

  modal.addComponents(
    new ActionRowBuilder().addComponents(businessInput),
    new ActionRowBuilder().addComponents(dealSizeInput),
    new ActionRowBuilder().addComponents(revenueInput),
    new ActionRowBuilder().addComponents(bottleneckInput)
  );

  return modal;
}

/**
 * Handle Modal Submission from Applicant
 *
 * @param {import('discord.js').ModalSubmitInteraction} interaction
 */
async function handleModalSubmit(interaction) {
  if (interaction.customId !== 'modal_vip_apply') return;

  const business = interaction.fields.getTextInputValue('vip_business');
  const dealSize = interaction.fields.getTextInputValue('vip_deal_size');
  const revenue = interaction.fields.getTextInputValue('vip_revenue');
  const bottleneck = interaction.fields.getTextInputValue('vip_bottleneck');

  logger.command(`Received VIP Application from ${interaction.user.tag} (${business})`);

  // 1. Reply to applicant with private confirmation
  const applicantEmbed = createBrandedEmbed({
    title: '👑 VIP CANDIDATE DOSSIER TRANSMITTED',
    description: [
      `Thank you, **${interaction.user.displayName}**. Your admission application for **The Inner Circle** has been securely logged.\n`,
      '### 🔒 Review Protocol:',
      '• Inner Circle seats are strictly limited to active B2B operators to maintain syndicate signal clarity.',
      '• The **Founder** reviews applicant metrics within **24 hours**.',
      '• If approved, you will receive an invitation credential to unlock the 9 private execution categories.\n',
      '> *"In client acquisition, speed and leverage separate the operators from the spectators."*'
    ].join('\n'),
    color: 0x8E44AD // VIP Royal Purple
  });

  await interaction.reply({ embeds: [applicantEmbed], ephemeral: true });

  // 2. Format VIP Dossier for the Founder & Staff
  const dossierEmbed = createBrandedEmbed({
    title: '🚨 NEW INNER CIRCLE VIP APPLICATION',
    description: [
      `**Applicant**: <@${interaction.user.id}> (\`${interaction.user.tag}\`)`,
      `**User ID**: \`${interaction.user.id}\``,
      `**Applied At**: <t:${Math.floor(Date.now() / 1000)}:F>\n`,
      '---',
      `**🏢 Business & Offer**: \`${business}\``,
      `**🎯 Target ICP & Deal Size**: \`${dealSize}\``,
      `**💰 Monthly Revenue**: \`${revenue}\``,
      `\n**🩺 Stated Bottleneck**:\n> ${bottleneck}`
    ].join('\n'),
    color: 0xE67E22,
    fields: [
      {
        name: '⚡ Next Action for Founder',
        value: `Send a direct message or invite to <@${interaction.user.id}> to finalize Inner Circle onboarding.`,
        inline: false
      }
    ]
  });

  // Try delivering dossier to Founder or staff alert channel
  try {
    const guild = interaction.guild;
    if (guild) {
      // Look for Founder or Owner
      const founderRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'founder');
      const warRoom = guild.channels.cache.find(c =>
        channelMatches(c.name, 'announcements') ||
        channelMatches(c.name, 'closed-war-room') ||
        channelMatches(c.name, 'live-prospect-research')
      );

      // Notify Founder via DM if possible, or post to private war room
      const owner = await guild.fetchOwner().catch(() => null);
      if (owner) {
        await owner.send({ embeds: [dossierEmbed] }).catch(() => {});
      }

      if (warRoom && warRoom.isTextBased()) {
        await warRoom.send({
          content: founderRole ? `<@&${founderRole.id}> 🔔 New VIP Inner Circle Application received!` : '🔔 New VIP Application:',
          embeds: [dossierEmbed]
        }).catch(() => {});
      }
    }
  } catch (err) {
    logger.error(`Error delivering VIP dossier notification: ${err.message}`);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('apply')
    .setDescription('Apply for admission into The Inner Circle (VIP Operator Syndicate)')
    .setDMPermission(false),

  /**
   * Execute slash command /apply
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const modal = buildVipModal();
    await interaction.showModal(modal);
  },

  buildVipModal,
  handleModalSubmit
};
