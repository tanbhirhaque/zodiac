const logger = require('../utils/logger');
const { createBrandedEmbed, BRAND } = require('../utils/helpers');

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

    const channelName = message.channel.name?.toLowerCase().replace(/\s+/g, '-');
    if (channelName !== 'intros-and-networking') {
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

    // Check if member already has Community Member or Admin/Moderator
    const hasCommunityRole = member.roles.cache.some(
      r => r.name.toLowerCase() === 'community member' ||
           r.name.toLowerCase() === 'lead specialist' ||
           r.name.toLowerCase() === 'admin' ||
           r.name.toLowerCase() === 'moderator'
    );

    if (hasCommunityRole) {
      return;
    }

    const communityRole = message.guild.roles.cache.find(
      r => r.name.toLowerCase() === 'community member'
    );

    if (!communityRole) {
      logger.warn(`[ONBOARDING] "Community Member" role not found in guild "${message.guild.name}".`);
      return;
    }

    try {
      // Assign the Community Member role
      await member.roles.add(communityRole, 'Completed mandatory 24-hour introduction');
      logger.setup(`[ONBOARDING] Assigned "Community Member" role to ${message.author.tag} in "${message.guild.name}"`);

      // Find key channels for the welcome unlock embed
      const dealRoom = message.guild.channels.cache.find(c => c.name.toLowerCase().includes('deal-room'));
      const top30 = message.guild.channels.cache.find(c => c.name.toLowerCase().includes('daily-top-30'));
      const decisionRoom = message.guild.channels.cache.find(c => c.name.toLowerCase().includes('seller-decision-room'));

      const unlockEmbed = createBrandedEmbed({
        title: `🎉 Society Access Unlocked: Welcome, ${member.displayName}!`,
        description: [
          `Welcome to **Dead Lead Society** (*Where Dead Leads Get a Second Chance*).`,
          `Your introduction has been verified and full community privileges are now active!\n`,
          `🔓 **Unlocked Channels & Resources**:`,
          `• **Daily Market Intelligence**: ${top30 ? `<#${top30.id}>` : '`#daily-top-30`'} & ${decisionRoom ? `<#${decisionRoom.id}>` : '`#seller-decision-room`'}`,
          `• **Revival Deal Room**: ${dealRoom ? `<#${dealRoom.id}>` : '`#deal-room`'} (monetize stalled leads & partner on deals)`,
          `• **Society Discussion**: Full access to general chat, media sharing, voice messages & strategy lounges.\n`,
          `⚠️ **Important Reminder**: Maintain active participation within **7 days** to preserve your society standing.`
        ].join('\n'),
        color: BRAND.COLOR_SUCCESS
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
