const http = require('http');
const logger = require('../utils/logger');

/**
 * Built-in lightweight HTTP health server.
 * Enables 24/7 cloud hosting on platforms like Render, Koyeb, or Railway
 * by serving HTTP 200 keep-alive health pings to prevent idle sleeping.
 *
 * @param {number|string} [port]
 * @returns {http.Server}
 */
let activeServer = null;
let keepAliveInterval = null;

/**
 * Self-ping public URL every 8 minutes to prevent Render free-tier idle spin-down
 */
function startKeepAliveSelfPing() {
  const publicUrl = process.env.RENDER_EXTERNAL_URL || 'https://zodiac-fc56.onrender.com';
  const pingUrl = `${publicUrl.replace(/\/+$/, '')}/health`;

  // Render spins down after 15 minutes of inactivity; ping every 8 minutes
  const INTERVAL_MS = 8 * 60 * 1000;

  if (keepAliveInterval) clearInterval(keepAliveInterval);

  keepAliveInterval = setInterval(async () => {
    try {
      const res = await fetch(pingUrl, { method: 'GET', headers: { 'User-Agent': 'Zodiac-KeepAlive/1.0' } });
      if (res.ok) {
        logger.boot(`[KEEP-ALIVE] Stay-awake ping to ${pingUrl} confirmed (HTTP ${res.status}).`);
      }
    } catch (err) {
      logger.warn(`[KEEP-ALIVE] Ping to ${pingUrl} failed: ${err.message}`);
    }
  }, INTERVAL_MS);

  // Initial ping 60 seconds after boot
  setTimeout(async () => {
    try {
      await fetch(pingUrl, { method: 'GET', headers: { 'User-Agent': 'Zodiac-KeepAlive/1.0' } });
      logger.boot(`[KEEP-ALIVE] Initial stay-awake self-ping sent to ${pingUrl}.`);
    } catch {
      // Non-critical if boot ping fails
    }
  }, 60 * 1000);
}

/**
 * Built-in lightweight HTTP health server.
 * Enables 24/7 cloud hosting on platforms like Render, Koyeb, or Railway
 * by serving HTTP 200 keep-alive health pings to prevent idle sleeping.
 *
 * @param {number|string} [port]
 * @returns {http.Server}
 */
function startHealthServer(port = process.env.PORT || 3000) {
  if (activeServer) {
    return activeServer;
  }

  const numericPort = Number(port) || 3000;
  const HEALTHY_PATHS = new Set(['/', '/health', '/healthz', '/status', '/ping']);

  const server = http.createServer((req, res) => {
    // Strip query parameters and trailing slashes for resilient path matching
    const rawPath = (req.url || '/').split('?')[0].trim();
    const pathname = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath;

    if (HEALTHY_PATHS.has(pathname)) {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'close'
      });

      // Handle HEAD request without sending body
      if (req.method === 'HEAD') {
        return res.end();
      }

      return res.end(JSON.stringify({
        status: 'online',
        service: 'Zodiac',
        organization: 'Dead Lead Society',
        tagline: 'Where Dead Leads Get a Second Chance.',
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
      }, null, 2));
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  // Explicitly bind to 0.0.0.0 to guarantee external reachability in Docker / Cloud containers
  server.listen(numericPort, '0.0.0.0', () => {
    logger.boot(`Health-check keep-alive server listening on port ${numericPort} (0.0.0.0)`);
    // Start automated self-ping loop
    startKeepAliveSelfPing();
  });

  server.on('error', (err) => {
    // Port conflict fallback (non-critical in local development)
    if (err.code === 'EADDRINUSE') {
      logger.warn(`Port ${numericPort} is in use; health server could not bind. Cloud platforms will use dynamic PORT.`);
    } else {
      logger.error(`Health server error: ${err.message}`);
    }
  });

  activeServer = server;
  return server;
}

/**
 * Gracefully stop the HTTP health server if running
 *
 * @returns {Promise<void>}
 */
function stopHealthServer() {
  return new Promise((resolve) => {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
    if (activeServer) {
      activeServer.close(() => {
        logger.boot('Health-check keep-alive server stopped.');
        activeServer = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  startHealthServer,
  stopHealthServer
};
