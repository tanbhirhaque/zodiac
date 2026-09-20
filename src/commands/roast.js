const { SlashCommandBuilder } = require('discord.js');
const { createBrandedEmbed, BRAND } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Ruthless Cold Email Teardown Engine
 */
function analyzeCopy(copy, targetRole = 'C-Suite / Founder') {
  const spamTriggers = [
    'guarantee', 'guaranteed', 'risk-free', '100%', 'free', 'revolutionary',
    'cutting-edge', 'best in class', 'quick 15-minute call', 'hop on a call',
    'scale your business', 'double your revenue', 'explode', 'synergy',
    'exclusive opportunity', 'game-changing', 'congratulations', 'click here'
  ];

  const lowerCopy = copy.toLowerCase();
  const detectedSpam = spamTriggers.filter(word => lowerCopy.includes(word));

  // Count self-referential words ("I", "we", "our", "my")
  const selfWords = (lowerCopy.match(/\b(i|we|our|my|us)\b/g) || []).length;
  const wordCount = copy.trim().split(/\s+/).length;
  const selfRatio = wordCount > 0 ? (selfWords / wordCount) * 100 : 0;

  // Calculate scores
  let spamScore = Math.min(95, Math.max(12, detectedSpam.length * 24 + (lowerCopy.includes('http') ? 20 : 0)));
  let readabilityScore = Math.max(15, Math.min(92, 100 - (wordCount > 120 ? 40 : 0) - (selfRatio > 8 ? 35 : 0) - detectedSpam.length * 15));

  // Determine brutal verdict
  let verdict = '';
  if (readabilityScore < 40) {
    verdict = '💀 INSTANT TRASH CAN. A busy decision maker deletes this within 1.2 seconds.';
  } else if (readabilityScore < 70) {
    verdict = '⚠️ COMMODITIZED PULL. Smells like a junior SDR reading off an outdated 2019 playbook.';
  } else {
    verdict = '⚡ HIGH SIGNAL. Approaching institutional status with minor friction to polish.';
  }

  // Generate tactical rewrite
  const rewrite = `Subject: quick question regarding [CoreInitiative]\n\nHi [FirstName],\n\nNoticed [SpecificObservation/Trigger from LinkedIn or Website]. Most [${targetRole}s] I speak with are focused on [SpecificPain], but struggle with [Bottleneck].\n\nWe engineered a workflow that [SolvesPain] without [MajorFriction/Cost].\n\nOpen to seeing a 2-minute breakdown?`;

  return {
    wordCount,
    selfWords,
    detectedSpam,
    spamScore,
    readabilityScore,
    verdict,
    rewrite
  };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roast')
    .setDescription('Mercilessly roast and teardown your cold email or outreach copy')
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('copy')
        .setDescription('Paste your subject line, cold email, or LinkedIn pitch')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('target_role')
        .setDescription('Who is this sent to? (e.g. CEO, VP of Sales, Marketing Director)')
        .setRequired(false)
    ),

  /**
   * Execute slash command /roast
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const copy = interaction.options.getString('copy');
    const targetRole = interaction.options.getString('target_role') || 'C-Suite Executive';

    logger.command(`User ${interaction.user.tag} invoked /roast against ${targetRole}`);

    const analysis = analyzeCopy(copy, targetRole);

    const embed = createBrandedEmbed({
      title: '🩸 RUTHLESS OUTREACH TEARDOWN & ROAST',
      description: [
        `**Target Buyer**: \`${targetRole}\``,
        `**Length**: \`${analysis.wordCount} words\` | **Self-Absorption Ratio**: \`${analysis.selfWords} self-references\`\n`,
        `### Verdict:\n> **${analysis.verdict}**\n`,
        '---',
        `**Deliverability / Spam Filter Risk**: \`${analysis.spamScore}% Risk\` ${analysis.spamScore > 50 ? '🚨 HIGH' : '✅ MANAGEABLE'}`,
        `**C-Suite Readability Score**: \`${analysis.readabilityScore}/100\``,
        analysis.detectedSpam.length > 0
          ? `\n🚩 **Banned Buzzwords Detected**: ${analysis.detectedSpam.map(w => `\`${w}\``).join(', ')}`
          : '\n✅ **Clean Deliverability**: No obvious amateur spam-trigger phrases detected.'
      ].join('\n'),
      color: analysis.readabilityScore < 50 ? BRAND.COLOR_DANGER : BRAND.COLOR_WARNING,
      fields: [
        {
          name: '🔪 Why It Gets Ignored',
          value: [
            '• **High-Friction CTA**: Asking for "15 minutes" from a stranger before providing value.',
            '• **Me-Monster Syndrome**: Talking about what *you* do rather than the *prospect\'s* operational fire.',
            '• **Pattern Fatigue**: Looks and reads like 20 other pitches sitting unread in their spam folder.'
          ].join('\n'),
          inline: false
        },
        {
          name: '✨ The High-Status Institutional Rewrite',
          value: `\`\`\`text\n${analysis.rewrite}\n\`\`\``,
          inline: false
        },
        {
          name: '👑 Inner Circle Outreach Experiments',
          value: '*Want live A/B deliverability split-testing and bespoke sequencing? Join **The Inner Circle** (`/apply`).*',
          inline: false
        }
      ]
    });

    await interaction.reply({ embeds: [embed] });
  },

  // Export helper for prefix commands (!roast / !teardown)
  analyzeCopy
};
