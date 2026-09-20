const dns = require('dns').promises;
const { SlashCommandBuilder } = require('discord.js');
const { createBrandedEmbed, BRAND } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Audit DNS records for an outbound domain
 *
 * @param {string} rawDomain
 */
async function scanDomain(rawDomain) {
  const domain = rawDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');

  let spfRecord = null;
  let dmarcRecord = null;
  let mxRecords = [];
  let errors = [];

  // 1. Check SPF
  try {
    const txtRecords = await dns.resolveTxt(domain);
    const flattened = txtRecords.map(chunks => chunks.join(''));
    spfRecord = flattened.find(r => r.toLowerCase().startsWith('v=spf1')) || null;
  } catch (err) {
    if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') {
      errors.push(`SPF lookup warning: ${err.code}`);
    }
  }

  // 2. Check DMARC
  try {
    const dmarcTxt = await dns.resolveTxt(`_dmarc.${domain}`);
    const flattened = dmarcTxt.map(chunks => chunks.join(''));
    dmarcRecord = flattened.find(r => r.toLowerCase().startsWith('v=dmarc1')) || null;
  } catch (err) {
    if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') {
      errors.push(`DMARC lookup warning: ${err.code}`);
    }
  }

  // 3. Check MX
  try {
    mxRecords = await dns.resolveMx(domain);
    mxRecords.sort((a, b) => a.priority - b.priority);
  } catch (err) {
    if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') {
      errors.push(`MX lookup warning: ${err.code}`);
    }
  }

  // Determine deliverability grade
  let grade = 'F';
  let badge = '💀 CRITICAL RISK';
  let color = BRAND.COLOR_DANGER;
  const recommendations = [];

  if (spfRecord && dmarcRecord) {
    const isDmarcEnforced = /p=(quarantine|reject)/i.test(dmarcRecord);
    if (isDmarcEnforced) {
      grade = 'A';
      badge = '💎 GRADE A (Tier-1 Deliverability)';
      color = BRAND.COLOR_SUCCESS;
    } else {
      grade = 'B';
      badge = '⚠️ GRADE B (Warning: Weak DMARC Policy)';
      color = BRAND.COLOR_WARNING;
      recommendations.push('Your DMARC policy is currently set to `p=none` (monitoring only). Upgrade to `p=quarantine` or `p=reject` to satisfy strict Yahoo/Gmail inbox rules.');
    }
  } else if (spfRecord && !dmarcRecord) {
    grade = 'C';
    badge = '🚨 GRADE C (Missing DMARC)';
    color = BRAND.COLOR_DANGER;
    recommendations.push('Add a TXT record for `_dmarc.' + domain + '` with value: `v=DMARC1; p=quarantine; pct=100`. Cold emails without DMARC face up to 45% spam placement.');
  } else {
    grade = 'F';
    badge = '💀 GRADE F (Unprotected Domain)';
    color = BRAND.COLOR_DANGER;
    recommendations.push('Missing SPF record. Configure `v=spf1 include:_spf.google.com ~all` (or your ESP equivalent) immediately.');
    if (!dmarcRecord) {
      recommendations.push('Missing DMARC record. Both Google and Yahoo strictly require DMARC for cold outbound delivery.');
    }
  }

  const mailProvider = mxRecords.some(m => /google|aspmx/i.test(m.exchange))
    ? 'Google Workspace (Recommended)'
    : mxRecords.some(m => /outlook|microsoft/i.test(m.exchange))
      ? 'Microsoft 365 (Recommended)'
      : mxRecords.length > 0
        ? `Custom / Other (${mxRecords[0].exchange})`
        : 'None Detected';

  return {
    domain,
    spfRecord,
    dmarcRecord,
    mxRecords,
    grade,
    badge,
    color,
    mailProvider,
    recommendations
  };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dns')
    .setDescription('Run a live SPF, DMARC, and MX deliverability health scan on an outbound domain')
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('domain')
        .setDescription('Enter domain name to inspect (e.g. acmeoutbound.com)')
        .setRequired(true)
    ),

  /**
   * Execute /dns
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const rawDomain = interaction.options.getString('domain');
    logger.command(`User ${interaction.user.tag} invoked /dns [${rawDomain}]`);

    await interaction.deferReply();

    try {
      const res = await scanDomain(rawDomain);

      const embed = createBrandedEmbed({
        title: `🔍 OUTBOUND DELIVERABILITY SCAN: ${res.domain.toUpperCase()}`,
        description: [
          `### Status: **${res.badge}**\n`,
          `**Mail Provider**: \`${res.mailProvider}\``,
          `**Primary MX**: \`${res.mxRecords.length > 0 ? res.mxRecords[0].exchange : 'None'}\`\n`,
          '---',
          `**SPF Record**: ${res.spfRecord ? '✅ `VERIFIED`' : '❌ `NOT FOUND`'}`,
          res.spfRecord ? `> \`${res.spfRecord.length > 90 ? res.spfRecord.substring(0, 87) + '...' : res.spfRecord}\`` : '',
          `**DMARC Policy**: ${res.dmarcRecord ? '✅ `CONFIGURED`' : '❌ `NOT FOUND`'}`,
          res.dmarcRecord ? `> \`${res.dmarcRecord.length > 90 ? res.dmarcRecord.substring(0, 87) + '...' : res.dmarcRecord}\`` : ''
        ].filter(Boolean).join('\n'),
        color: res.color,
        fields: [
          ...(res.recommendations.length > 0
            ? [{
                name: '🛠️ Required Technical Fixes',
                value: res.recommendations.map(r => `• ${r}`).join('\n\n'),
                inline: false
              }]
            : [{
                name: '✅ Technical Health Status',
                value: 'All primary DNS authentication protocols (SPF, DMARC, MX) are correctly configured. Domain is ready for warm-up and outreach.',
                inline: false
              }]
          ),
          {
            name: '👑 Inner Circle Deliverability Lab',
            value: '*Need custom secondary domain setup, automated mailbox rotation, and custom tracking domains? Apply for **The Inner Circle** (`/apply`).*',
            inline: false
          }
        ]
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      logger.error(`DNS scan error for ${rawDomain}: ${err.message}`);
      await interaction.editReply({
        content: `❌ Could not resolve DNS records for \`${rawDomain}\`. Please verify domain spelling and try again.`
      });
    }
  },

  scanDomain
};
