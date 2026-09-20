const { createBrandedEmbed, BRAND } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Knowledge Base for Tactical AI Mentor
 */
const TACTICAL_DOMAINS = [
  {
    keywords: ['deliverability', 'spam', 'spf', 'dkim', 'dmarc', 'bounce', 'domain', 'inbox'],
    title: '✉️ Deliverability & Inbox Placement Mechanics',
    advice: [
      '• **Domain Hygiene**: Never send cold outbound from your primary corporate domain. Purchase 3-5 secondary domains (.com, .io, .co) and configure Google Workspace / Office 365.',
      '• **DNS Protocol**: Ensure strict SPF, DKIM, and DMARC policies (`v=DMARC1; p=quarantine; pct=100`).',
      '• **Volume Caps**: Cap daily volume at 30-40 cold emails per inbox per day. Never exceed 50.',
      '• **Text-Only Rule**: Zero HTML tracking pixels, zero images, zero custom fonts, zero link shorteners on step 1. Plain text out-delivers fancy formatting 4:1.'
    ].join('\n'),
    rule: 'If you land in spam, your copy is irrelevant. Deliverability is the foundation of pipeline.'
  },
  {
    keywords: ['ghost', 'ghosted', 'no reply', 'stalled', 'silent', 'disappeared', 'unresponsive'],
    title: '🧟 The Psychology of Reanimation',
    advice: [
      '• **The Mistake**: Sending "just bumping this" or "checking in". This conveys desperate lower status and guarantees deletion.',
      '• **The Dean Jackson Protocol**: Send a 9-word question: *"{FirstName}, have you given up on solving [SpecificProblem] this quarter?"*',
      '• **The Negative-Reverse**: Inform the prospect you are officially closing their file. Loss aversion will pull 35%+ of serious prospects back into dialogue.',
      '• **The Third-Party Asset**: Share a relevant competitor breakdown or teardown without asking for a call.'
    ].join('\n'),
    rule: 'Never chase. When a prospect steps back, take half a step further back.'
  },
  {
    keywords: ['budget', 'expensive', 'price', 'cost', 'money', 'afford'],
    title: '💸 Objection Forensics: "No Budget"',
    advice: [
      '• **Root Cause**: B2B enterprises always have budget for high-priority problems. "No budget" is code for "your perceived ROI does not justify the internal political risk".',
      '• **The Staged Pilot Pivot**: *"{FirstName}, if we structured this as a 30-day milestone pilot tied directly to [Metric], would that fit your discretionary threshold?"*',
      '• **The Reallocation Probe**: *"{FirstName}, did budget get shifted to a higher fire, or is the commercial return simply unproven?"*',
      '• **Isolate the Variable**: Determine whether price is a symptom or the actual disease.'
    ].join('\n'),
    rule: 'Price is only an issue in the absence of overwhelming mathematical conviction.'
  },
  {
    keywords: ['icp', 'niche', 'target', 'audience', 'prospect', 'list'],
    title: '🎯 ICP Engineering & Targeting',
    advice: [
      '• **Micro-Segmentation**: Never target "B2B SaaS" or "Healthcare". Target "B2B FinTech with 20-50 employees that raised Series A in the last 6 months using HubSpot".',
      '• **Buying Committee vs End User**: Pitching the user gets you ignored. Pitching the economic buyer with operational metrics gets you invited to the boardroom.',
      '• **Signal-First Outbound**: Only contact prospects experiencing active trigger events (funding, leadership shifts, job postings, tech migration).'
    ].join('\n'),
    rule: 'A mediocre pitch to a starving buyer beats a Pulitzer-prize email sent to the wrong person.'
  },
  {
    keywords: ['cold call', 'calling', 'phone', 'opener', 'script'],
    title: '📞 Cold Calling & Pattern Interrupts',
    advice: [
      '• **The 5-Second Opener**: Avoid "How are you doing today?". Use: *"Hi [FirstName], this is [YourName] with [Company]. I know you weren\'t expecting my call—got 30 seconds for me to tell you why I reached out, and you can tell me to get lost if it\'s irrelevant?"*',
      '• **Tone**: Monotone, calm, non-salesy. The goal is to sound like an auditor or management consultant, not an aggressive broker.',
      '• **Single Objective**: The only goal of a cold call is securing agreement to review a diagnostic asset or book a scheduled calendar conversation.'
    ].join('\n'),
    rule: 'Tone conveys status. The slower and calmer you speak, the higher your perceived executive authority.'
  }
];

class MentorService {
  /**
   * Handle tactical query when bot is mentioned or queried
   *
   * @param {import('discord.js').Message} message
   */
  async handleMention(message) {
    if (message.author.bot) return;

    const rawText = message.content.replace(/<@!?\d+>/g, '').trim();
    if (!rawText || rawText.length < 3) {
      return message.reply({
        content: '👁️ **Zodiac Operational AI**: State your B2B sales, cold outreach, or reanimation challenge. Or deploy `/reanimate`, `/roast`, `/trigger`, or `/apply`.'
      });
    }

    logger.command(`[MENTOR] ${message.author.tag} asked Zodiac: "${rawText.substring(0, 60)}..."`);

    const lowerQuery = rawText.toLowerCase();

    // Match against tactical knowledge domain
    const matchedDomain = TACTICAL_DOMAINS.find(domain =>
      domain.keywords.some(kw => lowerQuery.includes(kw))
    );

    let embed;
    if (matchedDomain) {
      embed = createBrandedEmbed({
        title: `🧠 ZODIAC TACTICAL STRATEGY: ${matchedDomain.title.toUpperCase()}`,
        description: [
          `**Member Query**: *"${rawText.length > 180 ? rawText.substring(0, 177) + '...' : rawText}"*\n`,
          '### ⚡ Operational Protocol:',
          matchedDomain.advice,
          '',
          `> 💡 **Core Law**: *${matchedDomain.rule}*`
        ].join('\n'),
        color: BRAND.COLOR_PRIMARY,
        fields: [
          {
            name: '👑 Advanced Enterprise Execution',
            value: '*For custom outbound infrastructure, direct teardowns, and live deal strategy, submit credentials for **The Inner Circle** (`/apply`).*',
            inline: false
          }
        ]
      });
    } else {
      embed = createBrandedEmbed({
        title: '🧠 ZODIAC TACTICAL PERSPECTIVE',
        description: [
          `**Inquiry**: *"${rawText.length > 180 ? rawText.substring(0, 177) + '...' : rawText}"*\n`,
          '### 🎯 The First-Principles Acquisition Framework:',
          '1. **Signal beats Volume**: 100 hyper-targeted prospects experiencing acute commercial pain yield 10x more closed revenue than 5,000 scraped emails.',
          '2. **Friction Kills Conversion**: Never ask a busy decision maker to click a Calendly link on touch #1. Ask for permission to share a 2-minute proof asset.',
          '3. **The Dead Lead Advantage**: A stalled prospect who already engaged with your offer holds 5x more latent value than a cold stranger.',
          '',
          '### 🛠️ Tactical Commands to Deploy:',
          '• `/reanimate` $\\rightarrow$ Run an autopsy on a ghosted deal & get 3 revive scripts.',
          '• `/roast` $\\rightarrow$ Audit your cold email copy for spam traps & C-suite friction.',
          '• `/trigger` $\\rightarrow$ Generate real-time buying signals & outbound hooks for your niche.',
          '• `/apply` $\\rightarrow$ Request admission to the VIP Inner Circle syndicate.'
        ].join('\n'),
        color: BRAND.COLOR_INFO
      });
    }

    await message.reply({ embeds: [embed] });
  }
}

module.exports = new MentorService();
