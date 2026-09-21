const { createBrandedEmbed, BRAND, channelMatches } = require('../utils/helpers');
const logger = require('../utils/logger');
const timeoutEnforcementService = require('./timeoutEnforcementService');

class WelcomeGuideService {
  /**
   * Build the complete Zodiac Operating Arsenal embed
   *
   * @param {import('discord.js').Guild} guild
   * @returns {import('discord.js').EmbedBuilder}
   */
  createZodiacArsenalEmbed(guild) {
    const marketResearch = guild?.channels.cache.find(c => channelMatches(c.name, 'market-research'));
    const coldEmail = guild?.channels.cache.find(c => channelMatches(c.name, 'cold-email'));
    const deadLeads = guild?.channels.cache.find(c => channelMatches(c.name, 'dead-leads'));
    const leadAutopsy = guild?.channels.cache.find(c => channelMatches(c.name, 'lead-autopsy'));
    const templates = guild?.channels.cache.find(c => channelMatches(c.name, 'templates'));

    const marketRef = marketResearch ? `<#${marketResearch.id}>` : '`#market-research`';
    const coldEmailRef = coldEmail ? `<#${coldEmail.id}>` : '`#cold-email`';
    const deadLeadsRef = deadLeads ? `<#${deadLeads.id}>` : '`#dead-leads`';
    const leadAutopsyRef = leadAutopsy ? `<#${leadAutopsy.id}>` : '`#lead-autopsy`';
    const templatesRef = templates ? `<#${templates.id}>` : '`#templates`';

    return createBrandedEmbed({
      title: '⚡ HOW TO DEPLOY ZODIAC: YOUR AUTONOMOUS OPERATING ARSENAL',
      description: [
        '***Zodiac is not a chat bot. It is an autonomous acquisition and pipeline reanimation engine.***\n',
        'Here is your exact roadmap for navigating the society and putting Zodiac to work for your business:\n',
        '### 🗺️ PART 1: WHERE IS WHAT IN THE SOCIETY',
        `• **Market & Signal Recon**: ${marketRef} ➔ Macro trends, daily industry catalysts & buying signals.`,
        `• **Outreach Laboratories**: ${coldEmailRef} ➔ Battle-tested email sequences, LinkedIn DMs & cold calling scripts.`,
        `• **The Graveyard & Forensic Autopsy**: ${deadLeadsRef} & ${leadAutopsyRef} ➔ Post ghosted accounts for community diagnosis.`,
        `• **Resource Vault**: ${templatesRef} ➔ Access curated B2B SOPs, scrapers, and outreach tools.\n`,
        '---',
        '### 🛠️ PART 2: HOW TO PUT ZODIAC TO WORK (COMMANDS)',
        'Deploy these commands in any channel at any time:'
      ].join('\n'),
      color: BRAND.COLOR_PRIMARY,
      fields: [
        {
          name: '🧟 1. Revive Ghosted Prospects (`/reanimate` or `!reanimate`)',
          value: 'Have a prospect who went silent after a demo or proposal? Run `/reanimate` to get an instant forensic autopsy and 3 psychological second-chance scripts (including the 9-word reset).',
          inline: false
        },
        {
          name: '🩸 2. Roast & Polish Cold Outreach (`/roast` or `!roast`)',
          value: 'Paste your cold email or subject line into `/roast`. Zodiac will mercilessly audit your deliverability spam risk, C-suite readability score, and deliver an institutional high-status rewrite.',
          inline: false
        },
        {
          name: '🎯 3. Find Live Buying Signals (`/trigger` or `!trigger [industry]`)',
          value: 'Need reasons to reach out today? Run `/trigger` for SaaS, FinTech, E-Commerce, Agencies, or Logistics to get 5 active intent triggers and cold hooks.',
          inline: false
        },
        {
          name: '🛡️ 4. Sales Objection Sparring (`/duel` or `!duel`)',
          value: 'Train your closing skills against a cynical Fortune 500 executive. Face real-world objections and reveal master closer frame-reversal scripts.',
          inline: false
        },
        {
          name: '💰 5. Calculate Dormant Pipeline Cash (`/calculator` or `!math`)',
          value: 'Quantify how much revenue is sitting dead in your pipeline and calculate the exact outbound send quotas & inboxes needed to hit your monthly goals.',
          inline: false
        },
        {
          name: '🔍 6. Audit Domain Deliverability (`/dns [domain]` or `!dns`)',
          value: 'Check if your sending domain has valid SPF, DMARC, and MX records before launching campaigns to ensure you land in the primary inbox.',
          inline: false
        },
        {
          name: '📑 7. Contract & Kill-Fee Protection (`/clause` or `!clause`)',
          value: 'Generate ready-to-paste legal clauses to protect your agency against client ghosting, scope creep, and payment delinquency.',
          inline: false
        },
        {
          name: '🧠 8. On-Demand Tactical Mentorship (`@Zodiac [question]`)',
          value: 'Mention `@Zodiac` anywhere to ask tactical questions regarding cold outreach, deliverability, ICP selection, or objection handling.',
          inline: false
        },
        {
          name: '👑 9. Unlock The Inner Circle (`/apply` or `!apply`)',
          value: 'For active operators seeking live account teardowns, bespoke scraping workflows, and direct sprints with the Founder, submit your evaluation dossier via `/apply`.',
          inline: false
        }
      ]
    });
  }

  /**
   * Send new member welcome orientation
   *
   * @param {import('discord.js').GuildMember} member
   */
  async handleNewMember(member) {
    if (!member || member.user.bot) return;

    logger.setup(`[ORIENTATION] New member joined: ${member.user.tag} in "${member.guild.name}"`);

    try {
      // Register with timeout enforcement & send personal guidance DM
      await timeoutEnforcementService.registerNewMember(member);

      const welcomeChan = member.guild.channels.cache.find(c => channelMatches(c.name, 'welcome'));
      const introChan = member.guild.channels.cache.find(c => channelMatches(c.name, 'introductions'));
      const rulesChan = member.guild.channels.cache.find(c => channelMatches(c.name, 'rules'));

      const welcomeRef = welcomeChan ? `<#${welcomeChan.id}>` : '`#welcome`';
      const introRef = introChan ? `<#${introChan.id}>` : '`#introductions`';
      const rulesRef = rulesChan ? `<#${rulesChan.id}>` : '`#rules`';

      const guideEmbed = createBrandedEmbed({
        title: `🪦 Welcome to Dead Lead Society, ${member.displayName}!`,
        description: [
          'You have entered **Dead Lead Society** (*Where Dead Leads Get a Second Chance*).\n',
          'I am **Zodiac**, your autonomous intelligence and pipeline reanimation engine.\n',
          '### 🚪 3-STEP ACTIVATION PROTOCOL:',
          `1. **Review Rules**: Read the operational protocols in ${rulesRef}.`,
          `2. **Activate Credentials**: Post your background in ${introRef} within **24 hours** (Name, Offer, Target Niche). Zodiac will automatically grant you the **\`Society Member\`** credential!`,
          '3. **Deploy Zodiac**: Test `/reanimate`, `/roast`, `/trigger`, or `/duel` to start monetizing dormant pipeline.\n',
          `*Inspect the complete society anatomy and full arsenal in ${welcomeRef}.*`
        ].join('\n'),
        color: BRAND.COLOR_PRIMARY,
        fields: [
          {
            name: '🗺️ Where Is What in the Society',
            value: [
              '• **Recon & News**: `#market-research` (macro signals & trends)',
              '• **Outreach**: `#cold-email`, `#linkedin-outreach` (battle-tested copy)',
              '• **The Graveyard**: `#dead-leads` & `#lead-autopsy` (diagnose ghosted deals)',
              '• **Vault**: `#templates` (SOPs, scrapers & legal contracts)'
            ].join('\n'),
            inline: false
          },
          {
            name: '⚡ How to Put Zodiac to Work Immediately',
            value: [
              '• `/reanimate` ➔ Revive ghosted prospects with second-chance copy',
              '• `/roast` ➔ Ruthlessly audit your cold email or pitch copy',
              '• `/trigger` ➔ Instant buying triggers & hooks by industry',
              '• `/duel` ➔ Spar against cynical enterprise objections',
              '• `/dns` ➔ Verify your outbound email domain health',
              '• `@Zodiac [question]` ➔ Instant tactical acquisition mentorship'
            ].join('\n'),
            inline: false
          }
        ]
      });

      // 1. Send personalized welcome ping into #welcome or #introductions
      const targetChannel = welcomeChan || introChan;
      if (targetChannel && targetChannel.isTextBased()) {
        await targetChannel.send({
          content: `👋 Welcome to the Society, <@${member.id}>! Here is your orientation roadmap:`,
          embeds: [guideEmbed]
        }).catch(() => {});
      }

      // 2. Also attempt private DM orientation
      await member.send({ embeds: [guideEmbed] }).catch(() => {
        // User has DMs closed, handled silently
      });
    } catch (err) {
      logger.error(`Error in handleNewMember: ${err.message}`);
    }
  }
}

module.exports = new WelcomeGuideService();
