const { ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

/**
 * Brand colors and design tokens for Dead Lead Society
 */
const BRAND = {
  NAME: 'ZODIAC',
  SOCIETY: 'Dead Lead Society',
  TAGLINE: 'Where Dead Leads Get a Second Chance.',
  COLOR_PRIMARY: 0xE67E22,   // Revival Amber
  COLOR_SUCCESS: 0x2ECC71,   // Green
  COLOR_WARNING: 0xF1C40F,   // Yellow
  COLOR_DANGER: 0xE74C3C,    // Red
  COLOR_INFO: 0x3498DB       // Blue
};

/**
 * Map string channel types to Discord.js ChannelType enum
 */
const CHANNEL_TYPE_MAP = {
  text: ChannelType.GuildText,
  voice: ChannelType.GuildVoice,
  forum: ChannelType.GuildForum,
  category: ChannelType.GuildCategory
};

/**
 * Map Discord.js ChannelType enum to human-readable strings
 */
const CHANNEL_TYPE_NAME = {
  [ChannelType.GuildText]: 'Text',
  [ChannelType.GuildVoice]: 'Voice',
  [ChannelType.GuildForum]: 'Forum',
  [ChannelType.GuildCategory]: 'Category'
};

/**
 * Check if an interaction member has administrative permissions.
 * Setup and audit commands must only be usable by authorized admins.
 *
 * @param {import('discord.js').GuildMember} member
 * @returns {boolean}
 */
function hasAdminPermissions(member) {
  if (!member || !member.permissions) return false;
  return (
    member.permissions.has(PermissionFlagsBits.Administrator) ||
    member.permissions.has(PermissionFlagsBits.ManageGuild)
  );
}

/**
 * Check which critical bot permissions might be missing in a guild.
 *
 * @param {import('discord.js').Guild} guild
 * @returns {{ hasAll: boolean, missing: string[] }}
 */
function checkBotPermissions(guild) {
  const me = guild.members.me;
  if (!me) {
    return { hasAll: false, missing: ['Bot member not found in guild cache'] };
  }

  const required = [
    { flag: PermissionFlagsBits.ManageChannels, name: 'Manage Channels' },
    { flag: PermissionFlagsBits.ManageRoles, name: 'Manage Roles' },
    { flag: PermissionFlagsBits.ViewChannel, name: 'View Channels' },
    { flag: PermissionFlagsBits.SendMessages, name: 'Send Messages' },
    { flag: PermissionFlagsBits.EmbedLinks, name: 'Embed Links' },
    { flag: PermissionFlagsBits.ReadMessageHistory, name: 'Read Message History' }
  ];

  const missing = [];
  for (const { flag, name } of required) {
    if (!me.permissions.has(flag)) {
      missing.push(name);
    }
  }

  return {
    hasAll: missing.length === 0,
    missing
  };
}

/**
 * Create a standard branded Dead Lead Society embed
 *
 * @param {object} options
 * @param {string} [options.title]
 * @param {string} [options.description]
 * @param {number} [options.color]
 * @param {Array<{name: string, value: string, inline?: boolean}>} [options.fields]
 * @returns {EmbedBuilder}
 */
function createBrandedEmbed({ title, description, color = BRAND.COLOR_PRIMARY, fields = [] }) {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTimestamp()
    .setFooter({
      text: `${BRAND.NAME} • ${BRAND.SOCIETY} | ${BRAND.TAGLINE}`
    });

  if (title) embed.setTitle(title.length > 256 ? title.substring(0, 253) + '...' : title);
  if (description) embed.setDescription(description.length > 4096 ? description.substring(0, 4090) + '...' : description);
  if (fields.length > 0) {
    const safeFields = fields.map(f => ({
      name: f.name ? (f.name.length > 256 ? f.name.substring(0, 253) + '...' : f.name) : '\u200B',
      value: f.value ? (f.value.length > 1024 ? f.value.substring(0, 1020) + '...' : f.value) : '\u200B',
      inline: Boolean(f.inline)
    }));
    embed.addFields(safeFields);
  }

  return embed;
}

/**
 * Resolve a permission name string to a Discord PermissionFlagsBit
 *
 * @param {string} permName
 * @returns {bigint|null}
 */
function resolvePermissionBit(permName) {
  if (PermissionFlagsBits[permName] !== undefined) {
    return PermissionFlagsBits[permName];
  }
  return null;
}

/**
 * Normalize channel or category name for fuzzy/clean matching (removes emojis, symbols, spaces)
 *
 * @param {string} name
 * @returns {string}
 */
function normalizeChannelName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s\-_]/gu, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Check if a channel name matches a target identifier (handles emoji prefixes like 👋・welcome)
 *
 * @param {string} channelName
 * @param {string} targetName
 * @returns {boolean}
 */
function channelMatches(channelName, targetName) {
  if (!channelName || !targetName) return false;
  const nChan = normalizeChannelName(channelName);
  const nTarget = normalizeChannelName(targetName);
  return (
    nChan === nTarget ||
    nChan.endsWith(nTarget) ||
    nChan.endsWith(`-${nTarget}`) ||
    nTarget.endsWith(nChan) ||
    nTarget.endsWith(`-${nChan}`)
  );
}

module.exports = {
  BRAND,
  CHANNEL_TYPE_MAP,
  CHANNEL_TYPE_NAME,
  hasAdminPermissions,
  checkBotPermissions,
  createBrandedEmbed,
  resolvePermissionBit,
  normalizeChannelName,
  channelMatches
};
