const { SlashCommandBuilder } = require('discord.js');
const { createBrandedEmbed, BRAND } = require('../utils/helpers');
const logger = require('../utils/logger');

function calculateLostPipeline(deadLeads, dealSize) {
  const totalValue = deadLeads * dealSize;
  const conservativeRevive = Math.round(totalValue * 0.10);
  const benchmarkRevive = Math.round(totalValue * 0.15);
  const aggressiveRevive = Math.round(totalValue * 0.22);

  return {
    deadLeads,
    dealSize,
    totalValue,
    conservativeRevive,
    benchmarkRevive,
    aggressiveRevive
  };
}

function calculateOutboundQuota(monthlyGoal, dealSize) {
  const clientsNeeded = Math.ceil(monthlyGoal / dealSize);
  // Assuming 20% close rate on discovery calls:
  const callsNeeded = Math.ceil(clientsNeeded / 0.20);
  // Assuming 50% of positive replies convert to booked calls:
  const repliesNeeded = Math.ceil(callsNeeded / 0.50);
  // Assuming 2% positive reply rate on verified outbound:
  const totalOutreachNeeded = Math.ceil(repliesNeeded / 0.02);
  // Over 20 business days per month:
  const dailyEmails = Math.ceil(totalOutreachNeeded / 20);
  // Safe sending cap: 35 emails/inbox/day
  const inboxesNeeded = Math.ceil(dailyEmails / 35);
  // 2 inboxes per secondary domain:
  const domainsNeeded = Math.ceil(inboxesNeeded / 2);

  return {
    monthlyGoal,
    dealSize,
    clientsNeeded,
    callsNeeded,
    repliesNeeded,
    totalOutreachNeeded,
    dailyEmails,
    inboxesNeeded,
    domainsNeeded
  };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calculator')
    .setDescription('Calculate lost pipeline revenue or outbound capacity quotas')
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('mode')
        .setDescription('Select calculation model')
        .setRequired(true)
        .addChoices(
          { name: '🪦 Lost Pipeline (Dead Lead Revenue Value)', value: 'lost_pipeline' },
          { name: '🎯 Outbound Quota (Domain, Inbox & Send Math)', value: 'outbound_quota' }
        )
    )
    .addIntegerOption(option =>
      option
        .setName('leads_or_goal')
        .setDescription('Dead leads count (for Lost Pipeline) OR Target Monthly Revenue in $ (for Quota)')
        .setRequired(true)
        .setMinValue(1)
    )
    .addIntegerOption(option =>
      option
        .setName('deal_size')
        .setDescription('Average Deal Size or Client Lifetime Value ($)')
        .setRequired(true)
        .setMinValue(100)
    ),

  /**
   * Execute /calculator
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const mode = interaction.options.getString('mode');
    const metric1 = interaction.options.getInteger('leads_or_goal');
    const dealSize = interaction.options.getInteger('deal_size');

    logger.command(`User ${interaction.user.tag} invoked /calculator [mode: ${mode}]`);

    let embed;
    if (mode === 'lost_pipeline') {
      const res = calculateLostPipeline(metric1, dealSize);
      embed = createBrandedEmbed({
        title: '🪦 LOST PIPELINE & REANIMATION REVENUE MODEL',
        description: [
          `**Stalled Accounts in Graveyard**: \`${res.deadLeads} prospects\``,
          `**Average Deal Value**: \`$${res.dealSize.toLocaleString()}\``,
          `### 💰 Total Dormant Pipeline: **$${res.totalValue.toLocaleString()}**\n`,
          'Most agencies write these off as zeros and spend $5,000+ on new ads.',
          'Here is the net cash latent in your graveyard at standard revival benchmarks:'
        ].join('\n'),
        color: BRAND.COLOR_PRIMARY,
        fields: [
          {
            name: '🥉 Conservative (10% Recovery)',
            value: `**+$${res.conservativeRevive.toLocaleString()}** in net revenue ($0 ad spend)`,
            inline: true
          },
          {
            name: '🥈 Society Benchmark (15% Recovery)',
            value: `**+$${res.benchmarkRevive.toLocaleString()}** in net revenue ($0 ad spend)`,
            inline: true
          },
          {
            name: '🥇 High-Execution (22% Recovery)',
            value: `**+$${res.aggressiveRevive.toLocaleString()}** in net revenue ($0 ad spend)`,
            inline: true
          },
          {
            name: '⚡ Tactical Move',
            value: 'Deploy `/reanimate` right now to generate Dean Jackson 9-word emails and negative-reverse breakup scripts for these accounts.',
            inline: false
          },
          {
            name: '👑 Inner Circle Reanimation Sprints',
            value: '*For custom deal autopsies and hands-on revival sprints, apply for **The Inner Circle** (`/apply`).*',
            inline: false
          }
        ]
      });
    } else {
      const res = calculateOutboundQuota(metric1, dealSize);
      embed = createBrandedEmbed({
        title: '🎯 INSTITUTIONAL OUTBOUND CAPACITY & QUOTA MATH',
        description: [
          `**Monthly Target Revenue**: \`$${res.monthlyGoal.toLocaleString()}/mo\``,
          `**Average Deal Retainer**: \`$${res.dealSize.toLocaleString()}\`\n`,
          `### 🏆 Target: **${res.clientsNeeded} Closed Client(s) / Month**`,
          'Here is the exact mathematical volume and infrastructure required to hit this quota:'
        ].join('\n'),
        color: BRAND.COLOR_SUCCESS,
        fields: [
          {
            name: '📞 Discovery Calls Needed',
            value: `\`${res.callsNeeded} calls\` (assuming 20% close rate)`,
            inline: true
          },
          {
            name: '💬 Positive Replies Needed',
            value: `\`${res.repliesNeeded} replies\` (assuming 50% call booking rate)`,
            inline: true
          },
          {
            name: '📬 Total Monthly Outreach',
            value: `\`${res.totalOutreachNeeded.toLocaleString()} sends\` (assuming 2% reply rate)`,
            inline: true
          },
          {
            name: '✉️ Daily Email Quota',
            value: `\`${res.dailyEmails} emails/day\` (across 20 business days)`,
            inline: true
          },
          {
            name: '📥 Sending Inboxes Needed',
            value: `\`${res.inboxesNeeded} inboxes\` (max 35 sends/inbox to preserve health)`,
            inline: true
          },
          {
            name: '🌐 Secondary Domains Needed',
            value: `\`${res.domainsNeeded} domains\` (2 inboxes per domain)`,
            inline: true
          },
          {
            name: '👑 Inner Circle Infrastructure',
            value: '*Want verified high-intent lead scraping and inbox deliverability audits? Apply for **The Inner Circle** (`/apply`).*',
            inline: false
          }
        ]
      });
    }

    await interaction.reply({ embeds: [embed] });
  },

  calculateLostPipeline,
  calculateOutboundQuota
};
