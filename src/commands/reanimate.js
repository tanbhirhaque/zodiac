const { SlashCommandBuilder } = require('discord.js');
const { createBrandedEmbed, BRAND } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Tactical Reanimation Script Generator
 */
function generateReanimationData(prospect, lastInteraction, scenario) {
  const scenarioMap = {
    ghosted_after_proposal: {
      causeOfDeath: 'Decision Paralysis & Unquantified ROI Risk',
      diagnosis: 'The prospect expressed interest, received a proposal, and retreated into safety. "Checking in" reinforces your neediness and triggers defense mechanisms.',
      probability: '65% Revival Probability',
      script1Title: '⚡ The 9-Word Binary Reset',
      script1: `"{FirstName}, have you given up on solving {SpecificProblem} this quarter?"`,
      script2Title: '🚪 The Negative-Reverse Breakup',
      script2: `"Hi {FirstName},\n\nTypically when I don't hear back after a proposal review, it means either priorities have shifted or this isn't the right fit right now—both of which are completely fine.\n\nI'll go ahead and close out your file so I don't clutter your inbox.\n\nIf anything changes down the line, you know where to find me."`,
      script3Title: '📈 The Third-Party Proof Trigger',
      script3: `"Hi {FirstName},\n\nThought of our conversation regarding {SpecificGoal}. We just published a teardown showing how [Similar Brand/Competitor] cut acquisition costs by 28% without increasing ad spend.\n\nNo pitch or call needed—worth sending over the 2-minute breakdown?"`
    },
    ghosted_after_discovery: {
      causeOfDeath: 'Priority Drift & Lack of Emotional Momentum',
      diagnosis: 'A great call was had, but no micro-commitment was anchored. The prospect returned to their daily fires and your deal became "Item #14" on their priority list.',
      probability: '72% Revival Probability',
      script1Title: '🎯 The 1-Line Urgency Test',
      script1: `"{FirstName}, is {CoreMetric} still a focus for your team this month?"`,
      script2Title: '🔄 The Graceful File Closure',
      script2: `"Hi {FirstName},\n\nAssuming you're buried in quarterly execution. Should I pause our notes on {Initiative} until next quarter, or is this still on your immediate roadmap?"`,
      script3Title: '💡 The Value-First Mini Audit',
      script3: `"Hi {FirstName},\n\nRan a quick scan on your current [Ad Library / Tech Stack / Outbound]. Spotted 2 quick leaks you can plug internally today without hiring anyone.\n\nMind if I send the 30-second loom over?"`
    },
    no_reply_cold_email: {
      causeOfDeath: 'Commoditized Pattern Recognition',
      diagnosis: 'The prospect grouped your pitch into "Generic Salesperson" within 1.5 seconds. Your email was too self-focused, too long, or had too much friction in the call-to-action.',
      probability: '42% Cold Revival Probability',
      script1Title: '🪝 The Frictionless Single-Question Opener',
      script1: `"{FirstName}, curious if you're currently handling {SpecificFunction} in-house or working with external partners?"`,
      script2Title: '🥊 The Contrarian Point-of-View',
      script2: `"Hi {FirstName},\n\nMost {JobTitles} I speak with are tired of generic {ServiceType} pitches that promise the world and deliver unqualified leads.\n\nWe engineered a signal-based model that only triggers when your buyer is actively hiring. Open to seeing the workflow?"`,
      script3Title: '🎁 The Zero-Risk Free Resource',
      script3: `"Hi {FirstName},\n\nPut together a targeted list of 15 verified {TargetICP} accounts in your territory showing buying intent this week. Happy to drop the sheet in your inbox if useful."`
    },
    objection_timing: {
      causeOfDeath: 'Polite Brush-Off (Low Perceived Cost of Inaction)',
      diagnosis: '"Bad timing" almost always means "not high enough priority to risk my reputation or time". You must reframe inaction as a compounding loss.',
      probability: '58% Revival Probability',
      script1Title: '⏱️ The Timeline Realignment',
      script1: `"{FirstName}, totally understood. When you say bad timing, is that until next month, or should we revisit next fiscal year?"`,
      script2Title: '⚖️ The Cost-of-Waiting Reframe',
      script2: `"Hi {FirstName},\n\nUnderstood on the timing. Quick question: while this is on pause, what is the cost of letting {CurrentProblem} persist for another 90 days?\n\nIf it's negligible, definitely wait. If it's bleeding revenue, might be worth a 5-minute conversation."`,
      script3Title: '📊 The Low-Pressure Benchmark',
      script3: `"Hi {FirstName},\n\nNo pressure to connect right now. While you're in planning mode, here is a 1-page benchmark sheet showing what tier-1 teams in your space are allocating for {KeyMetric}. Hope it helps your Q2 budgeting."`
    },
    objection_budget: {
      causeOfDeath: 'Price Anchor Misalignment & Value Asymmetry',
      diagnosis: 'If they say "no budget", you either pitched the wrong buyer or failed to tie your solution to an existing profit center or pain expense.',
      probability: '52% Revival Probability',
      script1Title: '💰 The Funding Allocation Probe',
      script1: `"{FirstName}, fair enough. Did the budget get reallocated elsewhere, or is the ROI simply not clear yet?"`,
      script2Title: '🧩 The Staged Pilot Offer',
      script2: `"Hi {FirstName},\n\nBudget freezes happen. If we staged this as a self-funding 30-day pilot where fees are tied directly to {Milestone}, would that be worth exploring?"`,
      script3Title: '📉 The Downsell / Core Asset Angle',
      script3: `"Hi {FirstName},\n\nIf the full scope doesn't fit right now, we can extract just the {CoreModule} so you get {ImmediateBenefit} at 1/3 of the investment. Let me know if that makes financial sense."`
    }
  };

  return scenarioMap[scenario] || scenarioMap.ghosted_after_proposal;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reanimate')
    .setDescription('Diagnose why a B2B lead died and generate 3 clinical reanimation scripts')
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('prospect')
        .setDescription('Prospect job title, company type, or offer (e.g. VP of Sales at $10M SaaS)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('scenario')
        .setDescription('Select the exact situation where the deal stalled')
        .setRequired(true)
        .addChoices(
          { name: '👻 Ghosted After Proposal', value: 'ghosted_after_proposal' },
          { name: '💤 Stalled After Discovery Call', value: 'ghosted_after_discovery' },
          { name: '❄️ No Reply to Cold Outreach', value: 'no_reply_cold_email' },
          { name: '⏱️ Objection: Bad Timing / Too Busy', value: 'objection_timing' },
          { name: '💸 Objection: No Budget / Too Expensive', value: 'objection_budget' }
        )
    )
    .addStringOption(option =>
      option
        .setName('last_message')
        .setDescription('What was the last interaction or message sent?')
        .setRequired(false)
    ),

  /**
   * Execute slash command /reanimate
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const prospect = interaction.options.getString('prospect');
    const scenario = interaction.options.getString('scenario');
    const lastMessage = interaction.options.getString('last_message') || 'No previous text specified';

    logger.command(`User ${interaction.user.tag} invoked /reanimate [scenario: ${scenario}]`);

    const data = generateReanimationData(prospect, lastMessage, scenario);

    const embed = createBrandedEmbed({
      title: '🧟 FORENSIC AUTOPSY & REANIMATION DOSSIER',
      description: [
        `**Target Prospect**: \`${prospect}\``,
        `**Stall Scenario**: \`${scenario.replace(/_/g, ' ').toUpperCase()}\``,
        `**Last Interaction**: *"${lastMessage.length > 150 ? lastMessage.substring(0, 147) + '...' : lastMessage}"*\n`,
        '---',
        `### 🩺 Cause of Death:\n**${data.causeOfDeath}**`,
        `> ${data.diagnosis}`,
        `\n**Recovery Latency**: \`${data.probability}\``
      ].join('\n'),
      color: BRAND.COLOR_PRIMARY,
      fields: [
        {
          name: `${data.script1Title}`,
          value: `\`\`\`text\n${data.script1}\n\`\`\``,
          inline: false
        },
        {
          name: `${data.script2Title}`,
          value: `\`\`\`text\n${data.script2}\n\`\`\``,
          inline: false
        },
        {
          name: `${data.script3Title}`,
          value: `\`\`\`text\n${data.script3}\n\`\`\``,
          inline: false
        },
        {
          name: '👑 VIP Reanimation Lab',
          value: '*Have a stalled high-ticket enterprise deal ($20k+)? Apply for hands-on pipeline surgery inside **The Inner Circle** (`/apply`).*',
          inline: false
        }
      ]
    });

    await interaction.reply({ embeds: [embed] });
  },

  // Export helper for prefix commands (!reanimate / !autopsy)
  generateReanimationData
};
