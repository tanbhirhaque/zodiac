const { PermissionFlagsBits, OverwriteType } = require('discord.js');
const logger = require('../utils/logger');
const { resolvePermissionBit } = require('../utils/helpers');

/**
 * Service to resolve, validate, and build Discord permission overwrites
 * for channels and categories.
 */
class PermissionManager {
  /**
   * Build Discord permission overwrites array from JSON configuration.
   *
   * @param {import('discord.js').Guild} guild
   * @param {Record<string, { allow?: string[], deny?: string[] }>} permissionsConfig
   * @param {Map<string, import('discord.js').Role>} [roleCache] Optional pre-resolved role map (roleName -> Role)
   * @returns {Array<{ id: string, allow: bigint[], deny: bigint[], type: number }>}
   */
  buildOverwrites(guild, permissionsConfig, roleCache = new Map()) {
    if (!permissionsConfig || typeof permissionsConfig !== 'object') {
      return [];
    }

    const overwrites = [];

    for (const [targetName, perms] of Object.entries(permissionsConfig)) {
      let targetId = null;
      let targetType = OverwriteType.Role;

      if (targetName === '@everyone') {
        targetId = guild.roles.everyone.id;
      } else {
        // Look up by roleCache first, then guild role cache
        const role = roleCache.get(targetName) ||
          guild.roles.cache.find(r => r.name.toLowerCase() === targetName.toLowerCase());

        if (role) {
          targetId = role.id;
        } else {
          logger.permission(`Role "${targetName}" not found in guild while building overwrites. Skipping.`);
          continue;
        }
      }

      const allowBits = [];
      const denyBits = [];

      if (Array.isArray(perms.allow)) {
        for (const permName of perms.allow) {
          const bit = resolvePermissionBit(permName);
          if (bit) {
            // Guardrail: Never grant Administrator via channel permission overwrites
            if (bit === PermissionFlagsBits.Administrator) {
              logger.warn(`Skipping Administrator bit in channel overwrite for "${targetName}" - Administrator cannot be granted via overwrites.`);
              continue;
            }
            allowBits.push(bit);
          } else {
            logger.warn(`Unrecognized permission flag: "${permName}"`);
          }
        }
      }

      if (Array.isArray(perms.deny)) {
        for (const permName of perms.deny) {
          const bit = resolvePermissionBit(permName);
          if (bit) {
            denyBits.push(bit);
          } else {
            logger.warn(`Unrecognized permission flag: "${permName}"`);
          }
        }
      }

      if (targetId && (allowBits.length > 0 || denyBits.length > 0)) {
        overwrites.push({
          id: targetId,
          type: targetType,
          allow: allowBits,
          deny: denyBits
        });
      }
    }

    return overwrites;
  }

  /**
   * Safely updates permission overwrites on an existing channel without clobbering
   * unrelated existing overwrites.
   *
   * @param {import('discord.js').GuildChannel} channel
   * @param {Array<{ id: string, allow: bigint[], deny: bigint[], type: number }>} newOverwrites
   */
  async updateChannelOverwritesSafely(channel, newOverwrites) {
    if (!newOverwrites || newOverwrites.length === 0) return;

    for (const overwrite of newOverwrites) {
      try {
        await channel.permissionOverwrites.edit(overwrite.id, {
          ...overwrite.allow.reduce((acc, bit) => ({ ...acc, [bit]: true }), {}),
          ...overwrite.deny.reduce((acc, bit) => ({ ...acc, [bit]: false }), {})
        });
        logger.permission(`Updated overwrites for ID ${overwrite.id} on #${channel.name}`);
      } catch (err) {
        logger.error(`Failed to update permissions on #${channel.name}: ${err.message}`);
      }
    }
  }
}

module.exports = new PermissionManager();
