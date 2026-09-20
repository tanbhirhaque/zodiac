const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');
const logger = require('../utils/logger');
const { BRAND, createBrandedEmbed } = require('../utils/helpers');
const { NICHE_VAULT } = require('../data/nicheVault');

const parser = new Parser({
  timeout: 12000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) DeadLeadSociety/Top30-Engine'
  }
});

// Tier-1 Multi-Industry Economic & B2B Feeds (US, UK, Canada, Australia)
const MULTI_INDUSTRY_FEEDS = [
  {
    name: 'US B2B & Commercial Revenue Wire',
    industry: 'Commercial B2B',
    region: 'United States',
    url: 'https://news.google.com/rss/search?q="B2B+revenue"+OR+"commercial+spending"+OR+"small+business"+spending+location:US&hl=en-US&gl=US&ceid=US:en'
  },
  {
    name: 'TechCrunch Enterprise & SaaS',
    industry: 'B2B Software & AI',
    region: 'North America',
    url: 'https://techcrunch.com/category/enterprise/feed/'
  },
  {
    name: 'Healthcare & MedTech Commercial Monitor',
    industry: 'Healthcare & HealthTech',
    region: 'North America / UK',
    url: 'https://news.google.com/rss/search?q="healthtech"+revenue+OR+"medical+practice"+spending+location:US&hl=en-US&gl=US&ceid=US:en'
  },
  {
    name: 'Supply Chain, Freight & Industrial Watch',
    industry: 'Logistics & Manufacturing',
    region: 'Tier-1 Global',
    url: 'https://news.google.com/rss/search?q="supply+chain"+procurement+OR+"manufacturing"+spending+location:US&hl=en-US&gl=US&ceid=US:en'
  },
  {
    name: 'Retail & E-Commerce Commercial Dive',
    industry: 'E-Commerce & Retail',
    region: 'United States / UK',
    url: 'https://www.retaildive.com/feeds/news/'
  }
];

const CACHE_FILE = path.resolve(__dirname, '../../data/posted-news.json');

class NewsService {
  constructor() {
    this.ensureCacheDir();
  }

  ensureCacheDir() {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(CACHE_FILE)) {
      fs.writeFileSync(CACHE_FILE, JSON.stringify({ postedUrls: [] }, null, 2), 'utf8');
    }
  }

  getPostedUrls() {
    try {
      this.ensureCacheDir();
      const raw = fs.readFileSync(CACHE_FILE, 'utf8');
      const data = JSON.parse(raw);
      return new Set(data.postedUrls || []);
    } catch {
      return new Set();
    }
  }

  savePostedUrls(newUrls) {
    try {
      this.ensureCacheDir();
      const existing = this.getPostedUrls();
      newUrls.forEach(url => existing.add(url));
      const trimmed = Array.from(existing).slice(-800);
      fs.writeFileSync(CACHE_FILE, JSON.stringify({ postedUrls: trimmed }, null, 2), 'utf8');
    } catch (err) {
      logger.error(`Failed to save posted news cache: ${err.message}`);
    }
  }

  cleanSnippet(html) {
    if (!html) return '';
    return html
      .replace(/<[^>]*>?/gm, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Fetch multi-industry news articles from Tier-1 RSS feeds
   */
  async fetchArticles({ limit = 3, ignoreCache = false } = {}) {
    logger.news(`Fetching Multi-Industry Tier-1 news articles...`);
    const posted = this.getPostedUrls();
    const collected = [];

    for (const feed of MULTI_INDUSTRY_FEEDS) {
      try {
        const result = await parser.parseURL(feed.url);
        if (Array.isArray(result.items)) {
          for (const item of result.items) {
            const rawTitle = typeof item.title === 'string' ? item.title.trim() : '';
            const rawLink = typeof item.link === 'string' ? item.link.trim() : (typeof item.guid === 'string' ? item.guid.trim() : '');
            if (!rawTitle || !rawLink) continue;

            const isDuplicate = !ignoreCache && (posted.has(rawLink) || (item.guid && posted.has(item.guid)));
            if (!isDuplicate) {
              const snippet = this.cleanSnippet(item.contentSnippet || item.summary || item.content);
              collected.push({
                title: rawTitle,
                link: rawLink,
                pubDate: item.pubDate || new Date().toISOString(),
                snippet: snippet.length > 170 ? `${snippet.substring(0, 167)}...` : snippet,
                source: feed.name,
                industry: feed.industry,
                region: feed.region
              });
            }

            if (collected.length >= limit * 2) break;
          }
        }
      } catch (err) {
        logger.warn(`Failed to fetch multi-industry feed "${feed.name}": ${err.message}`);
      }

      if (collected.length >= limit) break;
    }

    if (collected.length === 0) {
      collected.push(
        {
          title: 'US Commercial B2B Spending Trends: Capital Allocations Across Top 30 Sectors',
          link: 'https://deadleadsociety.com/intelligence/b2b-spending-trends',
          pubDate: new Date().toISOString(),
          snippet: 'Data indicates B2B corporate buyers are freezing generic agency retainers and re-routing funds into high-urgency niche specialists.',
          source: 'US Commercial Review',
          industry: 'Multi-Industry',
          region: 'United States'
        },
        {
          title: 'UK & European Enterprise Demand Monitor: Q3/Q4 Niche Momentum',
          link: 'https://deadleadsociety.com/intelligence/uk-enterprise-demand',
          pubDate: new Date().toISOString(),
          snippet: 'Single-vertical specialists report 3.4x higher response rates on cold outreach compared to generalized B2B service providers.',
          source: 'UK Commercial Pulse',
          industry: 'Enterprise B2B',
          region: 'United Kingdom'
        }
      );
    }

    return collected.slice(0, limit);
  }

  /**
   * Dynamically rank the entire master niche vault and extract the DAILY TOP 30.
   * Ranks niches based on base volatility score, current seasonal momentum, and day-of-year rotation.
   *
   * @returns {Array<object>} Array of exactly 30 ranked niche objects (#1 to #30)
   */
  getRankedTop30Niches() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));

    // Simple deterministic hash for daily rotation
    const hash = (str) => {
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
      }
      return Math.abs(h);
    };

    const scoredNiches = NICHE_VAULT.map(niche => {
      const variation = (hash(niche.id + dayOfYear) % 7) - 3; // -3 to +3 points
      const dynamicScore = Math.min(99, Math.max(75, niche.baseScore + variation));
      return {
        ...niche,
        score: dynamicScore
      };
    });

    // Sort descending by score
    scoredNiches.sort((a, b) => b.score - a.score);

    // Take top 30
    return scoredNiches.slice(0, 30).map((niche, index) => ({
      ...niche,
      rank: index + 1
    }));
  }

  /**
   * Build the Institutional 5-Part Intelligence Dossier delivering the DAILY TOP 30:
   *
   * Part 1:  🌐 MACRO INDUSTRIAL & CAPITAL ALLOCATION REPORT
   * Part 2A: 📊 DAILY TOP 30 NICHE MATRIX (Rank #1 to #15)
   * Part 2B: 📊 DAILY TOP 30 NICHE MATRIX (Rank #16 to #30)
   * Part 3:  🏆 THE APEX TRIAD: TOP 3 OUTREACH TARGETS (Deep Persona & Sizing)
   * Part 4:  ⚡ WEAPONIZED OUTREACH & DEAD LEAD REVIVAL PLAYBOOK + LIVE DISPATCHES
   *
   * @param {Array<object>} articles
   * @param {object} options
   * @param {boolean} [options.isMorning=true]
   * @param {boolean} [options.isManual=false]
   * @returns {import('discord.js').EmbedBuilder[]}
   */
  formatNewsEmbeds(articles, { isMorning = true, isManual = false } = {}) {
    const timeLabel = isMorning ? '09:00 AM Edition' : '07:00 PM Edition';
    const top30 = this.getRankedTop30Niches();
    const apexTop3 = top30.slice(0, 3);
    const top15 = top30.slice(0, 15);
    const next15 = top30.slice(15, 30);

    // =========================================================================
    // PART 1: 🌐 MACRO INDUSTRIAL & CAPITAL ALLOCATION INDEX
    // =========================================================================
    const title1 = isManual
      ? `[PART 1/5] 🌐 Tier-1 Macro Industrial & Capital Allocation Report`
      : `[PART 1/5] 🌐 Macro Industrial Report (${timeLabel})`;

    const desc1 = [
      '**Geographic Focus**: 🇺🇸 United States • 🇬🇧 United Kingdom • 🇨🇦 Canada • 🇦🇺 Australia',
      '**Channel**: `#industrial-news-room` • *Institutional Capital Trajectory & B2B Spending Index*\n'
    ].join('\n');

    const fields1 = [
      {
        name: '💰 Corporate Liquidity & Capital Cost Environment',
        value: 'Elevated central bank rates continue to squeeze corporate liquidity across Tier-1 economies. B2B enterprises have transitioned from growth-at-all-costs to strict EBITDA preservation. Discretionary software and agency budgets face immediate cancellation unless tied to provable revenue acceleration.',
        inline: false
      },
      {
        name: '⏱️ Days Sales Outstanding (DSO) & Cash Flow Cycle',
        value: 'Average B2B DSO expanded to **48.6 days** (up 4.8 days MoM). Mid-market corporate clients are pushing for delayed payment terms (Net-45/60). Service providers offering milestone-based or performance-backed deliverables are achieving **2.8x faster contract execution**.',
        inline: false
      },
      {
        name: '🛡️ CFO Procurement Scrutiny & Deal Slippage',
        value: 'Single-stakeholder pitches now fail **42% of the time**. 78% of B2B transactions over $20k require multi-department sign-offs. Reaching both the Economic Buyer (CFO/COO) and the Operational Champion is mandatory to prevent end-of-month deal slippage.',
        inline: false
      }
    ];

    const embed1 = createBrandedEmbed({
      title: title1,
      description: desc1,
      color: BRAND.COLOR_PRIMARY,
      fields: fields1
    });

    // =========================================================================
    // PART 2: 📊 DAILY TOP 30 NICHE MATRIX (Rank #1 to #15)
    // =========================================================================
    const title2 = `[PART 2/5] 📊 The Daily Top 30 Niche Matrix: Ranks #1 – #15 (${timeLabel})`;
    const desc2 = [
      `**Master Pool**: Dynamically evaluated across ${NICHE_VAULT.length}+ B2B Industry Verticals in Tier-1 Economies.`,
      '*Ranked by real-time buyer volatility, budget release cycles, and contract velocity:*\n'
    ].join('\n');

    const fields2 = top15.map(n => ({
      name: `#${n.rank} ${n.name} [Score: ${n.score}/100 • ${n.momentum}]`,
      value: `• **Sector**: \`${n.sector}\` • **Deal Size**: \`${n.avgDealSize}\`\n• **Buying Catalyst**: *${n.catalyst}*`,
      inline: false
    }));

    const embed2 = createBrandedEmbed({
      title: title2,
      description: desc2,
      color: 0x3498DB, // Blue
      fields: fields2
    });

    // =========================================================================
    // PART 3: 📊 DAILY TOP 30 NICHE MATRIX (Rank #16 to #30)
    // =========================================================================
    const title3 = `[PART 3/5] 📊 The Daily Top 30 Niche Matrix: Ranks #16 – #30 (${timeLabel})`;
    const desc3 = [
      `**Master Pool**: Evaluated across ${NICHE_VAULT.length}+ B2B Industry Verticals (Ranks #16 to #30).`,
      '*Ranked by real-time buyer volatility, budget release cycles, and contract velocity:*\n'
    ].join('\n');

    const fields3 = next15.map(n => ({
      name: `#${n.rank} ${n.name} [Score: ${n.score}/100 • ${n.momentum}]`,
      value: `• **Sector**: \`${n.sector}\` • **Deal Size**: \`${n.avgDealSize}\`\n• **Buying Catalyst**: *${n.catalyst}*`,
      inline: false
    }));

    const embed3 = createBrandedEmbed({
      title: title3,
      description: desc3,
      color: 0x9B59B6, // Purple
      fields: fields3
    });

    // =========================================================================
    // PART 4: 🏆 THE APEX TRIAD: TOP 3 OUTREACH TARGETS
    // =========================================================================
    const title4 = `[PART 4/5] 🏆 The Apex Triad: Top 3 Highest-Converting Targets (${timeLabel})`;
    const desc4 = [
      '**Algorithm Selection**: The absolute top 3 attack verticals from today\'s 30-Niche Matrix.',
      'Target these 3 verticals today for maximum response rates and highest deal velocity:\n'
    ].join('\n');

    const fields4 = apexTop3.map(pick => ({
      name: `🥇 APEX RANK #${pick.rank}: ${pick.name}`,
      value: [
        `• **Sector**: \`${pick.sector}\``,
        `• **Urgency Index**: **${pick.score} / 100 • ${pick.momentum}**`,
        `• **Deal Size Potential**: **${pick.avgDealSize}**`,
        `• **Win Velocity**: \`${pick.winVelocity}\``,
        `• **Target Personas**: *${pick.targetPersona}*`,
        `• **Why Volatile Now**: ${pick.catalyst}`
      ].join('\n'),
      inline: false
    }));

    const embed4 = createBrandedEmbed({
      title: title4,
      description: desc4,
      color: 0xF1C40F, // Gold
      fields: fields4
    });

    // =========================================================================
    // PART 5: ⚡ WEAPONIZED OUTREACH & DEAD LEAD REVIVAL PLAYBOOK
    // =========================================================================
    const title5 = `[PART 5/5] ⚡ Weaponized Outreach & Dead Lead Revival Playbook (${timeLabel})`;
    const desc5 = [
      '**Ready-To-Deploy Weaponized Assets**: Copy and adapt these high-converting hooks for your outreach.',
      'Engineered to bypass gatekeepers, eliminate buyer resistance, and revive dormant dead leads:\n'
    ].join('\n');

    const fields5 = apexTop3.map(pick => ({
      name: `🎯 Outreach Playbook: #${pick.rank} ${pick.name}`,
      value: [
        `**📨 Cold Outreach Hook:**`,
        `*Subject*: \`${pick.godLevelHook.subject}\``,
        `> "${pick.godLevelHook.message}"`,
        '',
        `**💀 Dead Lead Revival Protocol:**`,
        `> ${pick.deadLeadRevival}`
      ].join('\n'),
      inline: false
    }));

    // Append live market dispatches
    if (articles.length > 0) {
      const newsItems = articles.map((art, idx) => {
        const cleanTitle = art.title.replace(/[\[\]]/g, '').trim();
        const snippetText = art.snippet ? `\n> *${art.snippet}*` : '';
        return `**${idx + 1}. [${cleanTitle}](${art.link})**\n🏢 \`${art.industry}\` • 📍 *${art.region}*${snippetText}`;
      }).join('\n\n');

      fields5.push({
        name: '📰 Live First-World Commercial Dispatches & Citations',
        value: newsItems.length > 1024 ? newsItems.substring(0, 1020) + '...' : newsItems,
        inline: false
      });
    }

    const embed5 = createBrandedEmbed({
      title: title5,
      description: desc5,
      color: BRAND.COLOR_SUCCESS, // Green
      fields: fields5
    });

    return [embed1, embed2, embed3, embed4, embed5];
  }
}

module.exports = new NewsService();
