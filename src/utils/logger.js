/**
 * Structured Logger for Dead Lead Society Bot
 *
 * Provides tagged, clean logging with timestamps and tag prefixes:
 * [BOOT], [COMMAND], [SETUP], [ROLE], [CHANNEL], [PERMISSION], [AUDIT], [ERROR]
 *
 * Security: Sanitizes messages to prevent token leaks.
 */

function sanitize(message) {
  if (typeof message !== 'string') {
    try {
      message = JSON.stringify(message);
    } catch {
      message = String(message);
    }
  }

  // Redact potential bot token patterns (Discord bot tokens are usually 3 base64 segments separated by dots)
  return message.replace(/[\w-]{24}\.[\w-]{6}\.[\w-]{27,}/g, '[REDACTED_TOKEN]');
}

function formatLog(tag, message, ...args) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const sanitizedMsg = sanitize(message);
  const formattedArgs = args.map(arg => {
    if (arg instanceof Error) {
      return arg.stack ? sanitize(arg.stack) : sanitize(arg.message);
    }
    return sanitize(arg);
  });

  return {
    line: `[${timestamp}] [${tag}] ${sanitizedMsg}`,
    extraArgs: formattedArgs
  };
}

const logger = {
  boot(message, ...args) {
    const { line, extraArgs } = formatLog('BOOT', message, ...args);
    console.log(line, ...extraArgs);
  },

  command(message, ...args) {
    const { line, extraArgs } = formatLog('COMMAND', message, ...args);
    console.log(line, ...extraArgs);
  },

  setup(message, ...args) {
    const { line, extraArgs } = formatLog('SETUP', message, ...args);
    console.log(line, ...extraArgs);
  },

  role(message, ...args) {
    const { line, extraArgs } = formatLog('ROLE', message, ...args);
    console.log(line, ...extraArgs);
  },

  channel(message, ...args) {
    const { line, extraArgs } = formatLog('CHANNEL', message, ...args);
    console.log(line, ...extraArgs);
  },

  permission(message, ...args) {
    const { line, extraArgs } = formatLog('PERMISSION', message, ...args);
    console.log(line, ...extraArgs);
  },

  audit(message, ...args) {
    const { line, extraArgs } = formatLog('AUDIT', message, ...args);
    console.log(line, ...extraArgs);
  },

  news(message, ...args) {
    const { line, extraArgs } = formatLog('NEWS', message, ...args);
    console.log(line, ...extraArgs);
  },

  scheduler(message, ...args) {
    const { line, extraArgs } = formatLog('SCHEDULER', message, ...args);
    console.log(line, ...extraArgs);
  },

  info(message, ...args) {
    const { line, extraArgs } = formatLog('INFO', message, ...args);
    console.log(line, ...extraArgs);
  },

  warn(message, ...args) {
    const { line, extraArgs } = formatLog('WARN', message, ...args);
    console.warn(line, ...extraArgs);
  },

  error(message, ...args) {
    const { line, extraArgs } = formatLog('ERROR', message, ...args);
    console.error(line, ...extraArgs);
  }
};

module.exports = logger;
