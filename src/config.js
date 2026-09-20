const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
  token: process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.trim() : '',
  clientId: process.env.CLIENT_ID ? process.env.CLIENT_ID.trim() : '',
  guildId: process.env.GUILD_ID ? process.env.GUILD_ID.trim() : '',
  timezone: process.env.TIMEZONE ? process.env.TIMEZONE.trim() : 'Asia/Dhaka',
  port: process.env.PORT ? process.env.PORT.trim() : '3000',
  structureConfigPath: path.resolve(__dirname, '../config/server-structure.json')
};

/**
 * Loads and validates the declarative server structure JSON
 *
 * @returns {object}
 */
function loadServerStructure() {
  if (!fs.existsSync(config.structureConfigPath)) {
    throw new Error(`Server structure configuration file not found at: ${config.structureConfigPath}`);
  }

  try {
    const rawData = fs.readFileSync(config.structureConfigPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    throw new Error(`Failed to parse server structure configuration: ${error.message}`);
  }
}

/**
 * Validates that required environment variables are set and not placeholder values.
 *
 * @param {object} options
 * @param {boolean} [options.requireGuildId=false] Whether GUILD_ID is strictly required
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateConfig({ requireGuildId = false } = {}) {
  const errors = [];

  const isPlaceholder = (val) =>
    !val ||
    val.includes('your_discord') ||
    val.includes('your_target') ||
    val.includes('here');

  if (isPlaceholder(config.token)) {
    errors.push('DISCORD_TOKEN is missing or set to placeholder in .env');
  }

  if (isPlaceholder(config.clientId)) {
    errors.push('CLIENT_ID is missing or set to placeholder in .env');
  }

  if (requireGuildId && isPlaceholder(config.guildId)) {
    errors.push('GUILD_ID is missing or set to placeholder in .env');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  config,
  loadServerStructure,
  validateConfig
};
