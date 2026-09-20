const logger = require('../utils/logger');
const { loadServerStructure } = require('../config');
const roleManager = require('./roleManager');
const channelManager = require('./channelManager');
const permissionManager = require('./permissionManager');
const { checkBotPermissions } = require('../utils/helpers');

/**
 * Orchestrator service for idempotent server synchronization.
 * Reads server-structure.json, validates permissions, and synchronizes
 * Discord roles, categories, and channels without creating duplicates.
 */
class ServerSetupService {
  /**
   * Run idempotent server setup or dry-run inspection
   *
   * @param {import('discord.js').Guild} guild
   * @param {object} [options]
   * @param {boolean} [options.dryRun=false]
   * @returns {Promise<{
   *   success: boolean,
   *   dryRun: boolean,
   *   summary: {
   *     rolesCreated: string[],
   *     rolesExisting: string[],
   *     categoriesCreated: string[],
   *     categoriesExisting: string[],
   *     channelsCreated: string[],
   *     channelsExisting: string[],
   *     errors: string[]
   *   }
   * }>}
   */
  async syncServer(guild, { dryRun = false } = {}) {
    logger.setup(`Starting server setup sync for guild: "${guild.name}" (ID: ${guild.id}) [dryRun: ${dryRun}]`);

    // Verify bot has essential permissions
    const botPerms = checkBotPermissions(guild);
    if (!botPerms.hasAll) {
      const errMsg = `Bot is missing critical permissions: ${botPerms.missing.join(', ')}`;
      logger.error(`[SETUP] ${errMsg}`);
      return {
        success: false,
        dryRun,
        summary: {
          rolesCreated: [],
          rolesExisting: [],
          categoriesCreated: [],
          categoriesExisting: [],
          channelsCreated: [],
          channelsExisting: [],
          errors: [errMsg]
        }
      };
    }

    let structure;
    try {
      structure = loadServerStructure();
    } catch (err) {
      logger.error(`[SETUP] Configuration loading error: ${err.message}`);
      return {
        success: false,
        dryRun,
        summary: {
          rolesCreated: [],
          rolesExisting: [],
          categoriesCreated: [],
          categoriesExisting: [],
          channelsCreated: [],
          channelsExisting: [],
          errors: [`Configuration error: ${err.message}`]
        }
      };
    }

    const summary = {
      rolesCreated: [],
      rolesExisting: [],
      categoriesCreated: [],
      categoriesExisting: [],
      channelsCreated: [],
      channelsExisting: [],
      errors: []
    };

    // Cache roles for resolving channel permission overwrites
    const roleCache = new Map();

    // 1. Synchronize Roles
    logger.setup(`Checking ${structure.roles?.length || 0} configured roles...`);
    if (Array.isArray(structure.roles)) {
      for (const roleData of structure.roles) {
        try {
          const result = await roleManager.getOrCreateRole(guild, roleData, { dryRun });
          if (result.role) {
            roleCache.set(roleData.name, result.role);
          }
          if (result.created) {
            summary.rolesCreated.push(roleData.name);
          } else {
            summary.rolesExisting.push(roleData.name);
          }
          if (result.error) {
            summary.errors.push(`Role [${roleData.name}]: ${result.error}`);
          }
        } catch (err) {
          const msg = `Role [${roleData.name}]: ${err.message}`;
          logger.error(msg);
          summary.errors.push(msg);
        }
      }
    }

    // 2. Synchronize Categories and Channels
    logger.setup(`Checking ${structure.categories?.length || 0} configured categories...`);
    if (Array.isArray(structure.categories)) {
      for (const categoryData of structure.categories) {
        try {
          // Build category permission overwrites
          const categoryOverwrites = permissionManager.buildOverwrites(
            guild,
            categoryData.permissions,
            roleCache
          );

          const catResult = await channelManager.getOrCreateCategory(
            guild,
            categoryData,
            categoryOverwrites,
            { dryRun }
          );

          if (catResult.created) {
            summary.categoriesCreated.push(categoryData.name);
          } else {
            summary.categoriesExisting.push(categoryData.name);
          }

          if (catResult.error) {
            summary.errors.push(`Category [${categoryData.name}]: ${catResult.error}`);
          }

          const categoryId = catResult.category ? catResult.category.id : null;

          // Process channels within this category
          if (Array.isArray(categoryData.channels)) {
            for (const channelData of categoryData.channels) {
              try {
                // Build channel-specific permission overwrites if present
                const channelOverwrites = channelData.permissions
                  ? permissionManager.buildOverwrites(guild, channelData.permissions, roleCache)
                  : [];

                const chanResult = await channelManager.getOrCreateChannel(
                  guild,
                  channelData,
                  categoryId,
                  channelOverwrites,
                  { dryRun }
                );

                if (chanResult.created) {
                  summary.channelsCreated.push(`${channelData.name} (${categoryData.name})`);
                } else {
                  summary.channelsExisting.push(channelData.name);
                }

                if (chanResult.error) {
                  summary.errors.push(`Channel [${channelData.name}]: ${chanResult.error}`);
                }
              } catch (chanErr) {
                const msg = `Channel [${channelData.name}]: ${chanErr.message}`;
                logger.error(msg);
                summary.errors.push(msg);
              }
            }
          }
        } catch (catErr) {
          const msg = `Category [${categoryData.name}]: ${catErr.message}`;
          logger.error(msg);
          summary.errors.push(msg);
        }
      }
    }

    const success = summary.errors.length === 0;
    logger.setup(`Server setup sync completed. Created: ${summary.rolesCreated.length} roles, ${summary.categoriesCreated.length} categories, ${summary.channelsCreated.length} channels. Existing: ${summary.rolesExisting.length} roles, ${summary.categoriesExisting.length} categories, ${summary.channelsExisting.length} channels. Errors: ${summary.errors.length}.`);

    return {
      success,
      dryRun,
      summary
    };
  }
}

module.exports = new ServerSetupService();
