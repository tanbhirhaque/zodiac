const { PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');
const { resolvePermissionBit } = require('../utils/helpers');

/**
 * Service to manage Discord roles idempotently.
 * Ensures zero duplicates, handles errors gracefully, and protects existing bot roles.
 */
class RoleManager {
  /**
   * Find a guild role by name (case-insensitive)
   *
   * @param {import('discord.js').Guild} guild
   * @param {string} name
   * @returns {import('discord.js').Role|null}
   */
  findRoleByName(guild, name) {
    if (!guild || !name) return null;
    const normalized = name.trim().toLowerCase();
    return guild.roles.cache.find(r => r.name.toLowerCase() === normalized) || null;
  }

  /**
   * Find all roles with a specific name to detect duplicates in guild
   *
   * @param {import('discord.js').Guild} guild
   * @param {string} name
   * @returns {import('discord.js').Collection<string, import('discord.js').Role>}
   */
  findDuplicateRolesByName(guild, name) {
    if (!guild || !name) return [];
    const normalized = name.trim().toLowerCase();
    return guild.roles.cache.filter(r => r.name.toLowerCase() === normalized);
  }

  /**
   * Ensure a role exists according to role specification.
   * If exists, returns the role. If missing, creates it.
   *
   * @param {import('discord.js').Guild} guild
   * @param {object} roleConfig
   * @param {string} roleConfig.name
   * @param {string} [roleConfig.color]
   * @param {boolean} [roleConfig.hoist]
   * @param {boolean} [roleConfig.mentionable]
   * @param {string[]} [roleConfig.permissions]
   * @param {object} [options]
   * @param {boolean} [options.dryRun=false]
   * @returns {Promise<{ role: import('discord.js').Role|null, created: boolean, error?: string }>}
   */
  async getOrCreateRole(guild, roleConfig, { dryRun = false } = {}) {
    const existingRole = this.findRoleByName(guild, roleConfig.name);

    if (existingRole) {
      logger.role(`Found existing role: ${existingRole.name} (ID: ${existingRole.id})`);
      return { role: existingRole, created: false };
    }

    if (dryRun) {
      logger.role(`[DRY-RUN] Would create role: ${roleConfig.name}`);
      return { role: null, created: true, dryRun: true };
    }

    // Resolve permissions from config
    const permissions = [];
    if (Array.isArray(roleConfig.permissions)) {
      for (const permName of roleConfig.permissions) {
        const bit = resolvePermissionBit(permName);
        if (bit) permissions.push(bit);
      }
    }

    try {
      const createdRole = await guild.roles.create({
        name: roleConfig.name,
        color: roleConfig.color || undefined,
        hoist: Boolean(roleConfig.hoist),
        mentionable: Boolean(roleConfig.mentionable),
        permissions: permissions.length > 0 ? permissions : undefined,
        reason: 'Dead Lead Society Idempotent Server Setup'
      });

      logger.role(`Created role: ${createdRole.name} (ID: ${createdRole.id})`);
      return { role: createdRole, created: true };
    } catch (error) {
      let message = error.message;
      if (error.code === 50013) {
        message = 'Missing Permissions: Bot requires "Manage Roles" permission and its role must be positioned higher than the role being managed.';
      }
      logger.error(`Failed to create role "${roleConfig.name}": ${message}`);
      return { role: null, created: false, error: message };
    }
  }

  /**
   * Audit all configured roles against current guild roles
   *
   * @param {import('discord.js').Guild} guild
   * @param {Array<object>} configuredRoles
   * @returns {{ existing: string[], missing: string[], duplicates: string[] }}
   */
  auditRoles(guild, configuredRoles = []) {
    const existing = [];
    const missing = [];
    const duplicates = [];

    for (const config of configuredRoles) {
      const matches = this.findDuplicateRolesByName(guild, config.name);
      if (matches.size === 0) {
        missing.push(config.name);
      } else if (matches.size === 1) {
        existing.push(config.name);
      } else {
        existing.push(config.name);
        duplicates.push(`${config.name} (${matches.size} instances)`);
      }
    }

    return { existing, missing, duplicates };
  }
}

module.exports = new RoleManager();
