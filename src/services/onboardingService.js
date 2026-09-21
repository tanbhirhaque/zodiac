const logger = require('../utils/logger');
const { createBrandedEmbed, BRAND, channelMatches } = require('../utils/helpers');

class OnboardingService {
  /**
   * Handle incoming message in the guild
   *
   * @param {import('discord.js').Message} message
   */
  async handleMessage(message) {
    if (!message || message.author?.bot || !message.guild) {
      return;
    }

    if (!channelMatches(message.channel.name, 'introductions') && !channelMatches(message.channel.name, 'intros-and-networking')) {
      return;
    }

    // Resolve guild member (fetch if uncached)
    let member = message.member;
    if (!member) {
      member = await message.guild.members.fetch(message.author.id).catch(() => null);
    }
    if (!member) {
      logger.warn(`[ONBOARDING] Could not resolve member for author ${message.author.tag}`);
      return;
    }

    // Guard against 1-character spam if message content is populated
    if (message.content && message.content.trim().length < 5) {
      logger.warn(`[ONBOARDING] Ignored short intro (< 5 characters) from ${message.author.tag}`);
      return;
    }

    // Check if member already has Society Member, Inner Circle, Founder, Admin, or Moderator
    const hasExistingRole = member.roles.cache.some(
      r => r.name.toLowerCase() === 'society member' ||
           r.name.toLowerCase() === 'community member' ||
           r.name.toLowerCase() === 'inner circle' ||
           r.name.toLowerCase() === 'founder' ||
           r.name.toLowerCase() === 'admin' ||
           r.name.toLowerCase() === 'moderator'
    );

    if (hasExistingRole) {
      return;
    }

    const societyRole = message.guild.roles.cache.find(
      r => r.name.toLowerCase() === 'society member' || r.name.toLowerCase() === 'community member'
    );

    if (!societyRole) {
      logger.warn(`[ONBOARDING] "Society Member" role not found in guild "${message.guild.name}".`);
      return;
    }

    try {
      // Assign the Society Member role
      await member.roles.add(societyRole, 'Completed mandatory introduction in #introductions');
      logger.setup(`[ONBOARDING] Assigned "${societyRole.name}" role to ${message.author.tag} in "${message.guild.name}"`);

      // Find key channels for the welcome unlock embed
      const marketResearch = message.guild.channels.cache.find(c => channelMatches(c.name, 'market-research'));
      const icpFramework = message.guild.channels.cache.find(c => channelMatches(c.name, 'icp-framework'));
      const graveyard = message.guild.channels.cache.find(c => channelMatches(c.name, 'dead-leads'));
      const welcomeChan = message.guild.channels.cache.find(c => channelMatches(c.name, 'welcome'));
      const founderRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'founder');

      const unlockEmbed = createBrandedEmbed({
        title: `🏛️ Society Credentials Activated: Welcome, ${member.displayName}!`,
        description: [
          `Welcome to **Dead Lead Society** (*Where Dead Leads Get a Second Chance*).\n`,
          `Your introduction has been verified. You now hold full access as an official **Society Member** across all **14 core institutional departments**:\n`,
          `🔓 **Recommended Starting Points**:`,
          `• **Market Intelligence**: ${marketResearch ? `<#${marketResearch.id}>` : '`#market-research`'} (macro sizing, industry trends & daily news triggers)`,
          `• **ICP & Buyer Lab**: ${icpFramework ? `<#${icpFramework.id}>` : '`#icp-framework`'} (defining high-probability targets & buying committees)`,
          `• **The Graveyard & Autopsy**: ${graveyard ? `<#${graveyard.id}>` : '`#dead-leads`'} (diagnosing ghosted accounts and failed pipeline)`,
          `• **Multi-Channel Outreach**: Full access to Cold Email, LinkedIn, Cold Calling & Messaging labs.\n`,
          `👑 **The Inner Circle (VIP Operator Syndicate)**:`,
          `For agency founders and operators running active campaigns who require **direct live execution, custom pipeline construction, and hands-on deal reanimation**:`,
          `• **Live Prospect & Account Teardowns** (live teardowns of your target enterprise accounts)`,
          `• **Bespoke Lead Building** (custom verified C-suite contact extraction & algorithmic scoring)`,
          `• **Live Outreach Experiments** (live A/B testing of your copy & deliverability audits)`,
          `• **Signature Reanimation Sprints** (direct ghost-recovery campaigns & second-chance offers)`,
          `• **Private War Rooms & Founder Office Hours** (direct closed-door audio strategy sessions)\n`,
          `*Explore full VIP privileges in ${welcomeChan ? `<#${welcomeChan.id}>` : '`#welcome`'} or reach out to the ${founderRole ? `<@&${founderRole.id}>` : '@Founder'} for private admission.*`
        ].join('\n'),
        color: BRAND.COLOR_SUCCESS,
        fields: [
          {
            name: '⚡ How to Put Zodiac to Work Immediately',
            value: [
              '• `/reanimate` ➔ Revive ghosted prospects with second-chance copy',
              '• `/roast` ➔ Ruthlessly audit your cold email or pitch copy',
              '• `/trigger` ➔ Instant buying triggers & hooks by industry',
              '• `/duel` ➔ Spar against cynical enterprise objections',
              '• `/calculator` ➔ Quantify lost revenue in your dormant pipeline',
              '• `/dns` ➔ Verify your outbound email domain health',
              '• `@Zodiac [question]` ➔ Instant tactical acquisition mentorship'
            ].join('\n'),
            inline: false
          }
        ]
      });

      // Send reply and react
      await message.reply({ embeds: [unlockEmbed] });
      try {
        await message.react('💀');
        await message.react('🔥');
      } catch {
        // Non-critical if reactions fail
      }
    } catch (error) {
      logger.error(`[ONBOARDING] Failed to onboard ${message.author.tag}: ${error.message}`);
    }
  }
}

module.exports = new OnboardingService();
