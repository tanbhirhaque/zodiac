const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createBrandedEmbed, BRAND } = require('../utils/helpers');
const logger = require('../utils/logger');

const OBJECTIONS = [
  {
    id: 'obj_already_have_agency',
    title: '🥊 "We already work with an agency and we\'re completely happy."',
    persona: 'VP of Marketing ($25M ARR Brand)',
    framePrinciple: 'Agree, Disarm, and Probe for Secondary Redundancy.',
    explanation: 'Never attack their existing vendor—doing so attacks their judgment. Acknowledge their loyalty, then introduce the concept of risk diversification without firing their current team.',
    rebuttal: [
      '"Totally respect that, [FirstName]. Most enterprise teams we partner with already have an agency handling their core retainers.',
      '',
      'We never ask clients to fire their primary agency. We act strictly as a specialized tactical strike team for [SpecificSpecialty e.g. Dead Lead Revival / Outbound Deliverability].',
      '',
      'Would you be opposed to keeping us in your back pocket as a benchmark redundant partner in case they hit bandwidth caps?"'
    ].join('\n')
  },
  {
    id: 'obj_send_deck_pricing',
    title: '🥊 "Send over your deck and pricing and I\'ll take a look if interested."',
    persona: 'CEO ($10M B2B Enterprise)',
    framePrinciple: 'Polite Refusal & Diagnostic Boundary Setting.',
    explanation: 'Sending pricing over email without discovery turns you into a commodity. Regain frame control by clarifying that pricing without diagnosis is malpractice.',
    rebuttal: [
      '"Happy to send over information, [FirstName]. But sending numbers without diagnosing your specific technical pipeline would be irresponsible guesswork.',
      '',
      'Our engagements range from $3k to $15k/mo depending entirely on whether you need lead infrastructure, deliverability recovery, or full outbound execution.',
      '',
      'Are you open to a 5-minute technical diagnostic first so I only send what is mathematically relevant to your business?"'
    ].join('\n')
  },
  {
    id: 'obj_no_budget_q4',
    title: '🥊 "We have zero budget for new initiatives this quarter."',
    persona: 'Chief Revenue Officer (Mid-Market SaaS)',
    framePrinciple: 'Isolate Budget vs Conviction & Reallocate Expense.',
    explanation: 'Enterprises always have budget for revenue expansion or stopping painful bleed. Probe whether the issue is cash or lack of conviction.',
    rebuttal: [
      '"Understood, [FirstName]. Just to clarify: is this a corporate freeze on all outside spend, or is it that you haven\'t seen a compelling enough ROI to justify moving money around?',
      '',
      'If it\'s a total freeze, I\'ll gladly circle back in Q1.',
      '',
      'If it\'s conviction, what if we structured this as a self-funding pilot where compensation is tied directly to qualified pipeline delivered?"'
    ].join('\n')
  },
  {
    id: 'obj_tried_outbound_failed',
    title: '🥊 "We tried cold email / outbound before. It doesn\'t work in our niche."',
    persona: 'Founder & Managing Partner (B2B Consulting)',
    framePrinciple: 'Differentiate Signal-Based Outbound from Spray-and-Pray.',
    explanation: 'They bought into an amateur "spray and pray" campaign that burned their domains. Validate their pain and contrast with signal-based acquisition.',
    rebuttal: [
      '"I completely agree with your cynicism, [FirstName]. 95% of outbound in 2026 is automated garbage sent from burned domains with zero intent signals.',
      '',
      'If you tried sending 5,000 generic emails to scraped lists, it definitely failed—and it should have.',
      '',
      'We don\'t do mass outreach. We only trigger outbound when a target account exhibits 2+ active buying signals (e.g. leadership hire + tech stack migration).',
      '',
      'Open to seeing what a verified signal trigger looks like in your space?"'
    ].join('\n')
  },
  {
    id: 'obj_what_makes_you_different',
    title: '🥊 "What makes you different from the other 40 people in my inbox?"',
    persona: 'Chief Operating Officer (Logistics Platform)',
    framePrinciple: 'Radical Honesty & Contrarian Specialization.',
    explanation: 'Do not recite a laundry list of generic agency features. Acknowledge the saturation and articulate your exact, narrow thesis.',
    rebuttal: [
      '"Honestly? Most agencies in your inbox want to charge you a $5,000 retainer to send more generic cold traffic to a broken funnel.',
      '',
      'We don\'t do generic acquisition. We specialize exclusively in Dead Lead Reanimation—resurrecting the 100+ prospects who already reviewed your proposal over the last 12 months and disappeared.',
      '',
      'You already paid to acquire those leads. We simply monetize the latent cash sitting dormant in your pipeline.',
      '',
      'Does that make sense, or would you rather keep chasing strangers?"'
    ].join('\n')
  }
];

function getRandomObjection() {
  return OBJECTIONS[Math.floor(Math.random() * OBJECTIONS.length)];
}

function buildDuelEmbed(obj) {
  return createBrandedEmbed({
    title: '🛡️ LIVE OBJECTION DUEL: SIMULATION ARENA',
    description: [
      `**Challenger**: \`${obj.persona}\`\n`,
      `### 💬 The Hard Objection:`,
      `> **${obj.title}**\n`,
      '---',
      '### 🎯 Your Mission:',
      'How would you reply to hold executive status, maintain frame control, and convert this skeptic into a booked meeting?',
      '\n*Type your rebuttal in chat, or click the button below to inspect the Master Closer breakdown.*'
    ].join('\n'),
    color: BRAND.COLOR_DANGER
  });
}

function buildDuelButtons(objId) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`btn_duel_reveal_${objId}`)
      .setLabel('💡 Reveal Master Closer Rebuttal')
      .setStyle(ButtonStyle.Success)
      .setEmoji('🧠'),
    new ButtonBuilder()
      .setCustomId('btn_duel_next')
      .setLabel('🥊 Next Random Objection')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('🔄')
  );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('duel')
    .setDescription('Enter the Objection Duel Gym to practice handling ruthless C-Suite objections')
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('objection_id')
        .setDescription('Select a specific objection scenario')
        .setRequired(false)
        .addChoices(
          { name: '🏢 "We already have an agency and are happy"', value: 'obj_already_have_agency' },
          { name: '📄 "Send over your deck & pricing"', value: 'obj_send_deck_pricing' },
          { name: '💸 "We have zero budget this quarter"', value: 'obj_no_budget_q4' },
          { name: '🚫 "Tried outbound before, it failed"', value: 'obj_tried_outbound_failed' },
          { name: '❓ "What makes you different from others?"', value: 'obj_what_makes_you_different' }
        )
    ),

  /**
   * Execute /duel
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const selectedId = interaction.options.getString('objection_id');
    const obj = selectedId ? OBJECTIONS.find(o => o.id === selectedId) || getRandomObjection() : getRandomObjection();

    logger.command(`User ${interaction.user.tag} invoked /duel [${obj.id}]`);

    const embed = buildDuelEmbed(obj);
    const row = buildDuelButtons(obj.id);

    await interaction.reply({ embeds: [embed], components: [row] });
  },

  /**
   * Handle Duel Button Clicks
   *
   * @param {import('discord.js').ButtonInteraction} interaction
   */
  async handleButtonClick(interaction) {
    if (interaction.customId.startsWith('btn_duel_reveal_')) {
      const objId = interaction.customId.replace('btn_duel_reveal_', '');
      const obj = OBJECTIONS.find(o => o.id === objId) || OBJECTIONS[0];

      const rebuttalEmbed = createBrandedEmbed({
        title: `🧠 MASTER CLOSER FRAME BREAKDOWN: ${obj.persona.toUpperCase()}`,
        description: [
          `**The Objection**: *"${obj.title}"*\n`,
          `### 📐 Frame Control Principle:`,
          `> **${obj.framePrinciple}**\n`,
          `**Psychological Leverage**:\n${obj.explanation}\n`,
          '---',
          `### ⚡ Word-For-Word Rebuttal Script:`,
          `\`\`\`text\n${obj.rebuttal}\n\`\`\``,
          '',
          '👑 **Inner Circle War Room**:',
          '*Want live objection simulations and roleplay sparring with the Founder? Apply for **The Inner Circle** (`/apply`).*'
        ].join('\n'),
        color: BRAND.COLOR_SUCCESS
      });

      await interaction.reply({ embeds: [rebuttalEmbed], ephemeral: true });
    } else if (interaction.customId === 'btn_duel_next') {
      const nextObj = getRandomObjection();
      const embed = buildDuelEmbed(nextObj);
      const row = buildDuelButtons(nextObj.id);

      await interaction.update({ embeds: [embed], components: [row] });
    }
  },

  OBJECTIONS,
  getRandomObjection,
  buildDuelEmbed,
  buildDuelButtons
};
