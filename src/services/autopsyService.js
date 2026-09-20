const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const { createBrandedEmbed, BRAND, channelMatches } = require('../utils/helpers');
const logger = require('../utils/logger');

const AUTOPSY_CASE_STUDIES = [
  {
    id: 'case_security_review',
    title: '🪦 CASE #01: The $36,000 Contract Stalled in Security Review',
    target: 'VP of Engineering at $40M ARR FinTech',
    stakes: '$3,000/mo Annual Retainer ($36,000 Total Value)',
    crimeScene: [
      '• 2 successful demo calls with Director of Product.',
      '• Proposal approved verbally; contract sent to Procurement & Infosec.',
      '• Infosec sends a 75-question compliance spreadsheet.',
      '• SDR sends 4 consecutive "checking in to see if any updates on security" emails over 28 days.',
      '• Prospect has completely ghosted.'
    ].join('\n'),
    question: 'Why did this deal freeze, and what single tactical move revives the buying committee?',
    causeOfDeath: 'Compliance Inertia & Delegated Procurement Abandonment',
    diagnosis: 'By asking the prospect for "updates", the SDR forced the buyer to do administrative chores for free. When prospects face compliance friction with no internal deadline, inertia wins.',
    winningScript: [
      '**The Compliance Relief Strike**:\n',
      '```text',
      'Hi [FirstName],',
      '',
      'Saw the security spreadsheet from your team. To take the burden off your desk, our Lead Solutions Engineer pre-filled 62 of the 75 questions based on our SOC2 Type II report.',
      '',
      'There are only 3 specific network questions that need your IT sign-off.',
      '',
      'I will send the pre-filled sheet over in 1 hour so your team can approve without doing the manual legwork. Fair enough?',
      '```',
      '\n*Outcome: 78% of enterprise deals stalled in procurement unfreeze when the vendor does the administrative paperwork for them.*'
    ].join('\n')
  },
  {
    id: 'case_40_open_zero_reply',
    title: '🪦 CASE #02: 45% Open Rate, 0.0% Reply Rate on 1,200 Cold Emails',
    target: 'Chief Marketing Officers at Mid-Market E-commerce Brands',
    stakes: 'Client Outbound Campaign ($15k/mo Service Pipeline)',
    crimeScene: [
      '• 1,200 cold emails sent across 3 domains.',
      '• Subject Line: "question about your paid acquisition strategy"',
      '• 45% Open Rate (540 opens) $\\rightarrow$ Excellent inbox placement.',
      '• Body copy: 4 paragraphs explaining proprietary AI algorithm, 3 case studies, and a link to a 15-minute Calendly.',
      '• Total Replies: 0.'
    ].join('\n'),
    question: 'Why did high deliverability result in zero replies, and what 3 lines fix this?',
    causeOfDeath: 'Self-Absorbed Cognitive Overload & High-Friction CTA',
    diagnosis: 'Opens mean the subject line worked. Zero replies mean the body text triggered immediate friction. Long paragraphs and Calendly links signal to executives: "This stranger wants 15 minutes of my life to pitch me software."',
    winningScript: [
      '**The 3-Line Institutional Shift**:\n',
      '```text',
      'Subject: meta ad fatigue on [TopSKU]',
      '',
      'Hi [FirstName],',
      '',
      'Noticed your recent product drop for [TopSKU] scaled up on Meta this week.',
      '',
      'We engineered a retention reanimation workflow that captures unpurchased cart intent without giving margin-killing discounts.',
      '',
      'Open to seeing the 90-second workflow breakdown?',
      '```',
      '\n*Outcome: Reply rates jumped from 0.0% to 6.8% by removing Calendly and asking a frictionless binary permission question.*'
    ].join('\n')
  },
  {
    id: 'case_post_discovery_ghost',
    title: '🪦 CASE #03: "We Love This, Send The Proposal" $\\rightarrow$ Ghosted 3 Weeks',
    target: 'Founder & CEO at B2B Agency ($2M ARR)',
    stakes: '$8,500 One-Time Setup + $2,500/mo Management',
    crimeScene: [
      '• Discovery call was energetic, prospect said: "This is exactly what we need right now, send the proposal!"',
      '• Founder spent 4 hours building a 22-page custom slide deck proposal.',
      '• Emailed proposal as a PDF attachment.',
      '• Followed up 3 times: "Did you get a chance to review the deck?"',
      '• 21 days of dead silence.'
    ].join('\n'),
    question: 'What fundamental sales mistake caused this ghosting, and how do we resurrect the conversation?',
    causeOfDeath: 'Premature Proposal Discharge & Unanchored Next Steps',
    diagnosis: 'Never send a proposal over email without setting a firm calendar review call first. Once the prospect has your PDF and price in isolation, they flip to the final slide, see the dollar amount, and ghost because you aren\'t there to contextualize ROI.',
    winningScript: [
      '**The Dean Jackson 9-Word Psychological Reset**:\n',
      '```text',
      'Subject: [FirstName]?',
      '',
      'Hi [FirstName],',
      '',
      'Have you given up on scaling outbound client acquisition this quarter?',
      '```',
      '\n*Why this works: It triggers profound loss aversion. Human psychology hates admitting defeat. 64% of ghosted B2B prospects reply within 4 hours.*'
    ].join('\n')
  }
];

class AutopsyService {
  /**
   * Post the daily interactive autopsy case study into #lead-autopsy or #dead-leads
   *
   * @param {import('discord.js').Guild} guild
   */
  async postDailyAutopsy(guild) {
    if (!guild) return;

    try {
      // Find suitable channel
      const targetChannel = guild.channels.cache.find(c =>
        channelMatches(c.name, 'lead-autopsy') ||
        channelMatches(c.name, 'dead-leads') ||
        channelMatches(c.name, 'deal-autopsy')
      );

      if (!targetChannel) {
        logger.warn('[AUTOPSY] Could not find #lead-autopsy or #dead-leads channel in guild.');
        return;
      }

      // Pick random or day-of-year indexed case study
      const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % AUTOPSY_CASE_STUDIES.length;
      const caseStudy = AUTOPSY_CASE_STUDIES[dayIndex];

      const embed = createBrandedEmbed({
        title: `💀 AUTOPSY OF THE DAY: ${caseStudy.title.toUpperCase()}`,
        description: [
          `**Target Prospect**: \`${caseStudy.target}\``,
          `**Commercial Stakes**: \`${caseStudy.stakes}\`\n`,
          '### 🩸 The Crime Scene (What Happened):',
          `${caseStudy.crimeScene}\n`,
          '---',
          `### 🧠 Community Challenge:`,
          `> *${caseStudy.question}*`,
          '\n*Diagnose what went wrong in the thread below, or click the button to inspect Zodiac\'s clinical autopsy and winning reanimation script.*'
        ].join('\n'),
        color: BRAND.COLOR_DANGER
      });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`btn_reveal_autopsy_${caseStudy.id}`)
          .setLabel("🔍 Reveal Zodiac's Autopsy & Script")
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🩺')
      );

      // Post into forum thread or text channel
      if (targetChannel.type === ChannelType.GuildForum) {
        await targetChannel.threads.create({
          name: `💀 Autopsy: ${caseStudy.target} ($${caseStudy.stakes})`,
          message: {
            embeds: [embed],
            components: [row]
          }
        });
      } else if (targetChannel.isTextBased()) {
        await targetChannel.send({
          embeds: [embed],
          components: [row]
        });
      }

      logger.channel(`[AUTOPSY] Successfully posted Daily Autopsy [${caseStudy.id}] in #${targetChannel.name}`);
    } catch (err) {
      logger.error(`[AUTOPSY] Error posting Daily Autopsy: ${err.message}`, err);
    }
  }

  /**
   * Handle interactive button click to reveal autopsy and script
   *
   * @param {import('discord.js').ButtonInteraction} interaction
   */
  async handleButtonClick(interaction) {
    if (!interaction.customId.startsWith('btn_reveal_autopsy_')) return;

    const caseId = interaction.customId.replace('btn_reveal_autopsy_', '');
    const caseStudy = AUTOPSY_CASE_STUDIES.find(c => c.id === caseId) || AUTOPSY_CASE_STUDIES[0];

    const solutionEmbed = createBrandedEmbed({
      title: `🩺 FORENSIC AUTOPSY FINDINGS: ${caseStudy.title}`,
      description: [
        `### 🔬 Cause of Death:\n**${caseStudy.causeOfDeath}**\n`,
        `**Forensic Diagnosis**:\n> ${caseStudy.diagnosis}\n`,
        '---',
        '### ⚡ The Winning Reanimation Script:',
        caseStudy.winningScript,
        '',
        '---',
        '👑 **The Inner Circle Advantage**:',
        '*Want live enterprise teardowns on your active stalled deals? Apply for **The Inner Circle** (`/apply`).*'
      ].join('\n'),
      color: BRAND.COLOR_SUCCESS
    });

    await interaction.reply({
      embeds: [solutionEmbed],
      ephemeral: true
    });
  }
}

module.exports = new AutopsyService();
