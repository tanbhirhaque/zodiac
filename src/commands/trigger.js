const { SlashCommandBuilder } = require('discord.js');
const { createBrandedEmbed, BRAND } = require('../utils/helpers');
const logger = require('../utils/logger');

const INDUSTRY_TRIGGERS = {
  saas: {
    name: 'B2B SaaS & Enterprise Software',
    triggers: [
      {
        signal: '👔 New VP of Sales / CRO Appointed (< 90 Days)',
        why: 'New revenue leaders have a 90-day mandate to audit tech stacks and vendors. They are eager to make immediate impact.',
        hook: '"Saw you recently stepped into the CRO role at [Company]. Typically new leadership is auditing outbound pipeline efficiency in month 1..."'
      },
      {
        signal: '🚀 SDR / Sales Hiring Spree (3+ Open Job Listings)',
        why: 'Hiring SDRs means aggressive outbound quotas. If they don\'t give reps verified lead data, CAC skyrockets.',
        hook: '"Noticed you are expanding your SDR bench by 4 reps this month. Curious how you are handling territory account-mapping to ensure they ramp in 30 days?"'
      },
      {
        signal: '💰 Series A/B Capital Influx (Last 6 Months)',
        why: 'Investors demand predictable pipeline. Organic inbound is too slow; leadership must stand up outbound fast.',
        hook: '"Congrats on the Series A round led by [VC]. With the new ARR milestones set for this fiscal year, how are you de-risking outbound pipeline?"'
      },
      {
        signal: '🔄 CRM or Marketing Automation Migration',
        why: 'Switching systems breaks lead scoring and tracking, leading to stalled pipeline and orphaned opportunities.',
        hook: '"Spotted [Company] recently moved to [HubSpot/Salesforce]. Most teams lose 15-20% of latent lead data during migrations..."'
      },
      {
        signal: '📉 Ghosted Pipeline from Stalled Pilots',
        why: 'Enterprise SaaS deals often stall at procurement review or security audits.',
        hook: '"Quick question: do you have a protocol for enterprise prospects that stalled at the security review stage last quarter?"'
      }
    ]
  },
  fintech: {
    name: 'Financial Technology & Payments',
    triggers: [
      {
        signal: '⚖️ New Regulatory Compliance Deadlines (SOC2 / AML / KYC)',
        why: 'Non-compliance threatens operational license. Budget is non-negotiable and urgently approved.',
        hook: '"With the new compliance standards hitting [Sector] next quarter, are you managing audits internally or using outside partners?"'
      },
      {
        signal: '💳 Expansion into Cross-Border Payments / Multi-Currency',
        why: 'Entering international territories requires net-new commercial banking and compliance partnerships.',
        hook: '"Saw your launch in [Region]. Curious how your partnership team is navigating localized banking rails..."'
      },
      {
        signal: '🛡️ Fraud / Chargeback Rate Spikes in Industry',
        why: 'Merchant loss prevention heads are under intense scrutiny to plug margin leaks.',
        hook: '"Spotted your recent volume growth. Most merchant heads I speak with see chargeback noise scale concurrently..."'
      },
      {
        signal: '💼 New Head of Partnerships / Alliances Hired',
        why: 'Fintech scales via distribution channels. A new partnerships head needs fast co-selling wins.',
        hook: '"Noticed you took the helm of Alliances at [Company]. Curious if you are actively vetting institutional integration partners this quarter?"'
      },
      {
        signal: '🏦 Legacy Bank Integration Announcement',
        why: 'Validates product maturity and opens enterprise banking procurement corridors.',
        hook: '"Saw your integration with [Tier-1 Bank]. That should significantly shorten enterprise trust cycles for your commercial team..."'
      }
    ]
  },
  ecommerce: {
    name: 'E-Commerce & DTC Brands ($5M-$50M)',
    triggers: [
      {
        signal: '📱 Ad Spend Diversification from Meta to TikTok / Google',
        why: 'Rising CPMs are squeezing margins; brands are desperate for zero-acquisition-cost retention and wholesale revenue.',
        hook: '"Noticed your Meta ad library scaling rapidly this month. Curious if you are using automated email reanimation to offset rising blended CAC?"'
      },
      {
        signal: '📦 New 3PL / Fulfillment Warehouse Opening',
        why: 'Signifies severe inventory expansion and acute need for higher SKU velocity.',
        hook: '"Saw the news on your new Midwest distribution center. With expanded inventory capacity, how are you driving retail wholesale re-orders?"'
      },
      {
        signal: '🛒 Wholesale / B2B Retail Expansion',
        why: 'Direct-to-consumer brands entering physical retail require completely different B2B sales cycles.',
        hook: '"Noticed your rollout into Target/Nordstrom. Are you running outbound to regional retail buyers or relying solely on brokers?"'
      },
      {
        signal: '🔄 Email Klaviyo / CRM Flow Stagnation',
        why: 'Ghosted cart abandoners and inactive customer segments hold 30%+ of potential GMV.',
        hook: '"Ran a quick scan on your site flows. You have strong top-of-funnel traffic, but customer winback looks un-optimized..."'
      },
      {
        signal: '🛍️ Seasonal Q4 / Prime Day Inventory Pre-Planning',
        why: 'Brands must secure supply and pipeline months ahead of peak retail seasons.',
        hook: '"As you prep your Q4 logistics and bulk inventory, are you exploring risk-reversal wholesale accounts?"'
      }
    ]
  },
  agency: {
    name: 'Marketing, Creative & Tech Agencies',
    triggers: [
      {
        signal: '📉 Stalled Inbound & Feast-or-Famine Lead Flow',
        why: 'Agencies dependent on word-of-mouth panic when referrals slow down for 60 consecutive days.',
        hook: '"Most agency founders I speak with are tired of unpredictable referral dips. Are you currently building an owned outbound channel?"'
      },
      {
        signal: '👥 Hiring Senior Account Executives / Directors',
        why: 'Agency payroll just increased by $10k+/mo. They urgently need high-ticket retainer clients.',
        hook: '"Saw you are bringing on a new Client Director. How are you ensuring their pipeline is loaded with $10k/mo qualified opportunities?"'
      },
      {
        signal: '🏆 Recent Industry Award or Portfolio Feature',
        why: 'High public confidence; founder is receptive to scaling up and capitalizing on social proof.',
        hook: '"Loved your recent case study on [Client]. That work deserves to be pitched directly to CMOs in [Niche]..."'
      },
      {
        signal: '🔄 Transition from Project Work to Monthly Retainers',
        why: 'Project-based agency models suffer high churn and need recurring client contracts.',
        hook: '"Are you still taking on 1-off builds, or has your agency fully pivoted into dedicated retainer partnerships?"'
      },
      {
        signal: '🪦 Stalled Proposals from Previous Quarter',
        why: 'Agencies leave hundreds of thousands in ghosted proposals on the table every year.',
        hook: '"Quick question: what happened to the 20+ prospective clients who reviewed your proposal last quarter and went cold?"'
      }
    ]
  },
  logistics: {
    name: 'Logistics, Freight & Supply Chain',
    triggers: [
      {
        signal: '⛽ Fuel Surcharge & Freight Rate Volatility',
        why: 'Shippers are actively renegotiating carrier contracts to preserve thin operating margins.',
        hook: '"With freight index volatility this month, shippers in [Region] are re-evaluating secondary carrier redundancy..."'
      },
      {
        signal: '🏭 Manufacturing Plant Relocation / Expansion',
        why: 'New factory or distribution center creates thousands of new lane requirements overnight.',
        hook: '"Noticed [Company] breaking ground on the new facility in Texas. Have you already locked in primary outbound carrier contracts?"'
      },
      {
        signal: '📦 Port Congestion & Cold-Chain Disruptions',
        why: 'Shippers facing delayed containers will pay premiums for guaranteed spot capacity.',
        hook: '"Are you seeing route delays on your refrigerated freight out of [Port]? We specialize in expedited re-routing..."'
      },
      {
        signal: '📋 Annual Freight RFP Season (Q3/Q4)',
        why: 'Procurement directors are contractually obligated to review bids and invite new vendors.',
        hook: '"As your team prepares your annual freight RFP, are you accepting 2 additional vetted carrier bids for benchmark testing?"'
      },
      {
        signal: '🚚 Fleet Electrification or ESG Milestones',
        why: 'Enterprise shippers have sustainability mandates from board directors.',
        hook: '"Saw your pledge regarding Tier-1 carrier emissions. Curious how that impacts your vendor selection this quarter?"'
      }
    ]
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trigger')
    .setDescription('Generate 5 real-time buying signals and outbound hooks for any B2B niche')
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('industry')
        .setDescription('Select target industry')
        .setRequired(true)
        .addChoices(
          { name: '💻 B2B SaaS & Tech', value: 'saas' },
          { name: '💳 Fintech & Payments', value: 'fintech' },
          { name: '🛒 E-Commerce & DTC', value: 'ecommerce' },
          { name: '🎨 Marketing & Tech Agencies', value: 'agency' },
          { name: '🚚 Logistics & Supply Chain', value: 'logistics' }
        )
    ),

  /**
   * Execute slash command /trigger
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const industryKey = interaction.options.getString('industry') || 'saas';
    const industryData = INDUSTRY_TRIGGERS[industryKey] || INDUSTRY_TRIGGERS.saas;

    logger.command(`User ${interaction.user.tag} invoked /trigger [industry: ${industryKey}]`);

    const fields = industryData.triggers.map((t, idx) => ({
      name: `${idx + 1}. ${t.signal}`,
      value: `**Why It Converts**: ${t.why}\n**Cold Hook**: \`${t.hook}\``,
      inline: false
    }));

    fields.push({
      name: '👑 Inner Circle Signal Hunting',
      value: '*Want bespoke account scraping and custom signal alerts tailored to your exact offer? Apply for **The Inner Circle** (`/apply`).*',
      inline: false
    });

    const embed = createBrandedEmbed({
      title: `🎯 BUYER INTENT & TRIGGER INTELLIGENCE: ${industryData.name.toUpperCase()}`,
      description: [
        'Cold outreach without intent triggers is spam. Outbound paired with a timely trigger is high-status consultancy.',
        '',
        'Use these **5 verified buying signals** to identify accounts with high immediate purchase probability:'
      ].join('\n'),
      color: BRAND.COLOR_SUCCESS,
      fields
    });

    await interaction.reply({ embeds: [embed] });
  },

  // Export helper for prefix commands (!trigger)
  INDUSTRY_TRIGGERS
};
