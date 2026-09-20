const { ChannelType } = require('discord.js');
const logger = require('../utils/logger');
const { CHANNEL_TYPE_MAP, CHANNEL_TYPE_NAME, channelMatches } = require('../utils/helpers');
const permissionManager = require('./permissionManager');

/**
 * Service to manage Discord categories and channels idempotently.
 * Supports text, voice, forum, and category channels with zero duplicates.
 */
class ChannelManager {
  /**
   * Find an existing category by name (case-insensitive or normalized)
   *
   * @param {import('discord.js').Guild} guild
   * @param {string} name
   * @returns {import('discord.js').CategoryChannel|null}
   */
  findCategoryByName(guild, name) {
    if (!guild || !name) return null;
    const normalized = name.trim().toLowerCase();
    return guild.channels.cache.find(
      c => c.type === ChannelType.GuildCategory && (
        c.name.toLowerCase() === normalized ||
        channelMatches(c.name, name)
      )
    ) || null;
  }

  /**
   * Find an existing channel by name and type, optionally constrained to a parent category.
   *
   * @param {import('discord.js').Guild} guild
   * @param {string} name
   * @param {ChannelType} type
   * @param {string|null} [parentId=null]
   * @returns {import('discord.js').GuildChannel|null}
   */
  findChannelByNameAndType(guild, name, type, parentId = null) {
    if (!guild || !name) return null;

    // Discord formats text/forum channel names to lowercase with hyphens
    const isTextLike = type === ChannelType.GuildText || type === ChannelType.GuildForum;
    const normalizedTarget = isTextLike
      ? name.trim().toLowerCase().replace(/\s+/g, '-')
      : name.trim().toLowerCase();

    return guild.channels.cache.find(c => {
      if (c.type !== type) return false;
      if (parentId && c.parentId !== parentId) return false;

      const channelName = isTextLike
        ? c.name.toLowerCase().replace(/\s+/g, '-')
        : c.name.toLowerCase();

      return channelName === normalizedTarget || channelMatches(c.name, name);
    }) || null;
  }

  /**
   * Detect duplicate channels under a parent category or guild root
   *
   * @param {import('discord.js').Guild} guild
   * @param {string} name
   * @param {ChannelType} type
   * @param {string|null} [parentId=null]
   * @returns {import('discord.js').Collection<string, import('discord.js').GuildChannel>}
   */
  findDuplicateChannels(guild, name, type, parentId = null) {
    if (!guild || !name) return [];
    const isTextLike = type === ChannelType.GuildText || type === ChannelType.GuildForum;
    const normalizedTarget = isTextLike
      ? name.trim().toLowerCase().replace(/\s+/g, '-')
      : name.trim().toLowerCase();

    return guild.channels.cache.filter(c => {
      if (c.type !== type) return false;
      if (parentId && c.parentId !== parentId) return false;
      const channelName = isTextLike
        ? c.name.toLowerCase().replace(/\s+/g, '-')
        : c.name.toLowerCase();
      return channelName === normalizedTarget;
    });
  }

  /**
   * Ensure a category exists. If exists, returns it; otherwise creates it.
   *
   * @param {import('discord.js').Guild} guild
   * @param {object} categoryConfig
   * @param {string} categoryConfig.name
   * @param {number} [categoryConfig.position]
   * @param {Array<object>} [permissionOverwrites=[]]
   * @param {object} [options]
   * @param {boolean} [options.dryRun=false]
   * @returns {Promise<{ category: import('discord.js').CategoryChannel|null, created: boolean, error?: string }>}
   */
  async getOrCreateCategory(guild, categoryConfig, permissionOverwrites = [], { dryRun = false } = {}) {
    const existing = this.findCategoryByName(guild, categoryConfig.name);

    if (existing) {
      logger.channel(`Found existing category: "${existing.name}" (ID: ${existing.id})`);
      if (!dryRun) {
        if (existing.name !== categoryConfig.name) {
          try {
            await existing.setName(categoryConfig.name, 'Dead Lead Society Server Setup: Sync formatting');
            logger.channel(`Renamed category "${existing.name}" -> "${categoryConfig.name}"`);
          } catch (nameErr) {
            logger.warn(`Could not rename category "${existing.name}": ${nameErr.message}`);
          }
        }
        if (permissionOverwrites && permissionOverwrites.length > 0) {
          await permissionManager.updateChannelOverwritesSafely(existing, permissionOverwrites);
        }
      }
      return { category: existing, created: false };
    }

    if (dryRun) {
      logger.channel(`[DRY-RUN] Would create category: "${categoryConfig.name}"`);
      return { category: null, created: true, dryRun: true };
    }

    try {
      const created = await guild.channels.create({
        name: categoryConfig.name,
        type: ChannelType.GuildCategory,
        position: categoryConfig.position,
        permissionOverwrites: permissionOverwrites.length > 0 ? permissionOverwrites : undefined,
        reason: 'Dead Lead Society Idempotent Server Setup'
      });

      logger.channel(`Created category: "${created.name}" (ID: ${created.id})`);
      return { category: created, created: true };
    } catch (error) {
      let message = error.message;
      if (error.code === 50013) {
        message = 'Missing Permissions: Bot requires "Manage Channels" permission to create categories.';
      }
      logger.error(`Failed to create category "${categoryConfig.name}": ${message}`);
      return { category: null, created: false, error: message };
    }
  }

  /**
   * Ensure a channel exists under a category. If exists, returns it; otherwise creates it.
   *
   * @param {import('discord.js').Guild} guild
   * @param {object} channelConfig
   * @param {string} channelConfig.name
   * @param {string} [channelConfig.type='text'] 'text', 'voice', 'forum'
   * @param {string} [channelConfig.topic]
   * @param {number} [channelConfig.position]
   * @param {string|null} [categoryId=null] Parent Category ID
   * @param {Array<object>} [permissionOverwrites=[]]
   * @param {object} [options]
   * @param {boolean} [options.dryRun=false]
   * @returns {Promise<{ channel: import('discord.js').GuildChannel|null, created: boolean, error?: string }>}
   */
  async getOrCreateChannel(guild, channelConfig, categoryId = null, permissionOverwrites = [], { dryRun = false } = {}) {
    let channelType = CHANNEL_TYPE_MAP[channelConfig.type ? channelConfig.type.toLowerCase() : 'text'] || ChannelType.GuildText;
    let typeLabel = CHANNEL_TYPE_NAME[channelType] || 'Channel';

    // Check under the target category (also check GuildText fallback if seeking GuildForum)
    let existing = this.findChannelByNameAndType(guild, channelConfig.name, channelType, categoryId);
    if (!existing && channelType === ChannelType.GuildForum) {
      existing = this.findChannelByNameAndType(guild, channelConfig.name, ChannelType.GuildText, categoryId);
    }

    if (existing) {
      logger.channel(`Found existing ${typeLabel.toLowerCase()} channel: #${existing.name} (ID: ${existing.id})`);
      if (!dryRun) {
        if (existing.name !== channelConfig.name) {
          try {
            await existing.setName(channelConfig.name, 'Dead Lead Society Server Setup: Sync emoji formatting');
            logger.channel(`Renamed channel #${existing.name} -> #${channelConfig.name}`);
          } catch (nameErr) {
            logger.warn(`Could not rename channel #${existing.name}: ${nameErr.message}`);
          }
        }
        if (permissionOverwrites && permissionOverwrites.length > 0) {
          await permissionManager.updateChannelOverwritesSafely(existing, permissionOverwrites);
        }
        // Sync topic if channel supports it and topic differs
        if (channelConfig.topic && existing.topic !== channelConfig.topic && typeof existing.setTopic === 'function') {
          try {
            await existing.setTopic(channelConfig.topic);
            logger.channel(`Updated topic for #${existing.name}`);
          } catch (topicErr) {
            logger.warn(`Could not update topic for #${existing.name}: ${topicErr.message}`);
          }
        }
      }
      return { channel: existing, created: false };
    }

    if (dryRun) {
      logger.channel(`[DRY-RUN] Would create ${typeLabel.toLowerCase()} channel: ${channelConfig.name}`);
      return { channel: null, created: true, dryRun: true };
    }

    try {
      const createOptions = {
        name: channelConfig.name,
        type: channelType,
        parent: categoryId || undefined,
        position: channelConfig.position,
        reason: 'Dead Lead Society Idempotent Server Setup'
      };

      // Topic only applies to Text, Forum, and News channels in Discord
      if (channelConfig.topic && (channelType === ChannelType.GuildText || channelType === ChannelType.GuildForum)) {
        createOptions.topic = channelConfig.topic;
      }

      // Configure Forum tags if channel is a Forum
      if (channelType === ChannelType.GuildForum && Array.isArray(channelConfig.tags)) {
        createOptions.availableTags = channelConfig.tags.map(t => ({
          name: typeof t === 'string' ? t.slice(0, 20) : t.name.slice(0, 20),
          moderated: false
        }));
      }

      if (permissionOverwrites.length > 0) {
        createOptions.permissionOverwrites = permissionOverwrites;
      }

      let created;
      try {
        created = await guild.channels.create(createOptions);
      } catch (createErr) {
        // Fallback: If creating a Forum fails (e.g. Community not enabled), fallback to Text channel
        if (channelType === ChannelType.GuildForum) {
          logger.warn(`Failed to create Forum #${channelConfig.name} (${createErr.message}). Falling back to Text channel.`);
          createOptions.type = ChannelType.GuildText;
          delete createOptions.availableTags;
          created = await guild.channels.create(createOptions);
          typeLabel = 'Text (Forum Fallback)';
        } else {
          throw createErr;
        }
      }

      logger.channel(`Created ${typeLabel.toLowerCase()} channel: #${created.name} (ID: ${created.id})`);
      return { channel: created, created: true };
    } catch (error) {
      let message = error.message;
      if (error.code === 50013) {
        message = 'Missing Permissions: Bot requires "Manage Channels" permission to create channels.';
      }
      logger.error(`Failed to create channel "${channelConfig.name}": ${message}`);
      return { channel: null, created: false, error: message };
    }
  }

  /**
   * Audit all configured categories and channels against current guild channels
   *
   * @param {import('discord.js').Guild} guild
   * @param {Array<object>} configuredCategories
   * @returns {{
   *   existingCategories: string[],
   *   missingCategories: string[],
   *   existingChannels: string[],
   *   missingChannels: string[],
   *   duplicates: string[]
   * }}
   */
  auditChannels(guild, configuredCategories = []) {
    const existingCategories = [];
    const missingCategories = [];
    const existingChannels = [];
    const missingChannels = [];
    const duplicates = [];

    for (const catConfig of configuredCategories) {
      const category = this.findCategoryByName(guild, catConfig.name);
      if (category) {
        existingCategories.push(catConfig.name);
      } else {
        missingCategories.push(catConfig.name);
      }

      const parentId = category ? category.id : null;

      if (Array.isArray(catConfig.channels)) {
        for (const chanConfig of catConfig.channels) {
          const channelType = CHANNEL_TYPE_MAP[chanConfig.type ? chanConfig.type.toLowerCase() : 'text'] || ChannelType.GuildText;
          const dups = this.findDuplicateChannels(guild, chanConfig.name, channelType, parentId);

          if (dups.size === 0) {
            missingChannels.push(`${chanConfig.name} (${catConfig.name})`);
          } else if (dups.size === 1) {
            existingChannels.push(chanConfig.name);
          } else {
            existingChannels.push(chanConfig.name);
            duplicates.push(`${chanConfig.name} under "${catConfig.name}" (${dups.size} instances)`);
          }
        }
      }
    }

    return {
      existingCategories,
      missingCategories,
      existingChannels,
      missingChannels,
      duplicates
    };
  }
}

module.exports = new ChannelManager();
