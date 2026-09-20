const { SlashCommandBuilder } = require('discord.js');
const { createBrandedEmbed, BRAND } = require('../utils/helpers');
const logger = require('../utils/logger');

const NICHE_DATABASE = {
  cold_email: {
    serviceName: 'B2B Cold Outbound & Lead Generation',
    idealRetainer: '$3,500 - $8,000 / month + Performance Fee',
    topNiches: [
      {
        niche: '1. Commercial Roofing & Restoration ($5M-$30M)',
        buyer: 'Owner / VP of Business Development',
        burningPain: 'Commercial jobs are worth $50k-$200k each, but owners rely on word-of-mouth or storm chasers.',
        hook: '"Noticed your recent commercial restoration projects in [Region]. We engineered an outbound workflow targeting facility managers with properties over 40,000 sq ft..."'
      },
      {
        niche: '2. B2B SaaS Series A/B ($2M-$15M ARR)',
        buyer: 'Chief Revenue Officer / VP of Sales',
        burningPain: 'Investors demand predictable quarterly pipeline; SDR hiring is slow and expensive ($8k/mo fully loaded).',
        hook: '"Saw you are scaling your commercial sales team. Rather than ramping 2 new SDRs over 90 days, we feed your existing reps with 15 verified meetings/month..."'
      },
      {
        niche: '3. Freight Brokerages & 3PL Logistics',
        buyer: 'Director of Business Development',
        burningPain: 'Shippers constantly re-bid lanes; freight brokers need net-new shipper accounts with high recurring pallet volume.',
        hook: '"With freight index shifts this month, mid-market manufacturers in [Region] are vetting secondary carriers. Open to seeing the account list?"'
      }
    ]
  },
  video_editing: {
    serviceName: 'Short-Form & B2B Video Content Engines',
    idealRetainer: '$2,500 - $6,000 / month',
    topNiches: [
      {
        niche: '1. High-Ticket B2B Consultants & Agency Founders ($1M+)',
        buyer: 'Founder / Managing Partner',
        burningPain: 'They have elite domain knowledge but zero time to edit 30 short-form clips and LinkedIn video teardowns every month.',
        hook: '"Love your LinkedIn insights on enterprise sales. We turn 1 monthly 45-minute recording from you into 30 high-status clips formatted for C-Suite distribution..."'
      },
      {
        niche: '2. Personal Injury & High-Value Law Firms',
        buyer: 'Managing Attorney',
        burningPain: 'Case values are $20k-$250k. Local billboard ads have declining ROI; social proof videos build massive client trust.',
        hook: '"Noticed your recent verdict feature. We produce documentary-style client case breakdown videos that dominate local search..."'
      },
      {
        niche: '3. Real Estate Private Equity & Syndicators',
        buyer: 'General Partner / Investor Relations',
        burningPain: 'They need to attract high-net-worth accredited investors ($50k-$500k checks) for upcoming property acquisitions.',
        hook: '"Loved your teardown on the multifamily acquisition in [City]. We package deal metrics into high-end investor video updates that accelerate capital raises..."'
      }
    ]
  },
  web_cro: {
    serviceName: 'High-Conversion Web Design & CRO',
    idealRetainer: '$5,000 - $18,000 / project + $2k/mo Retainer',
    topNiches: [
      {
        niche: '1. Seed/Series A B2B Software Companies',
        buyer: 'Head of Growth / Marketing Director',
        burningPain: 'They raised $4M but their website looks like a student developer built it in 2021, killing enterprise buyer trust.',
        hook: '"Ran a quick review of your landing page. Your product architecture is tier-1, but the above-the-fold value prop creates friction for enterprise CTOs..."'
      },
      {
        niche: '2. High-Ticket Dental Implants & Plastic Surgery Clinics',
        buyer: 'Clinic Owner / Managing Surgeon',
        burningPain: 'Procedures cost $10k-$35k. A 1% increase in mobile landing page conversion generates $80k+ in extra surgical revenue.',
        hook: '"Noticed your Google search ads for full-arch implants. Your landing page takes 4.2 seconds to load on mobile—we cut that to 0.9s to stop leaking leads..."'
      },
      {
        niche: '3. Luxury Custom Home Builders & Architects',
        buyer: 'Principal Builder',
        burningPain: 'Contracts are $1M-$5M. They need portfolio websites that scream architectural prestige and ultra-luxury status.',
        hook: '"Your recent residential build in [Area] is breathtaking. Your current web showcase does not reflect the craftsmanship of a $3M contract..."'
      }
    ]
  },
  ai_automations: {
    serviceName: 'AI Workflows, CRM & RevOps Automations',
    idealRetainer: '$4,000 - $12,000 / project + $2,500/mo Retainer',
    topNiches: [
      {
        niche: '1. Insurance Agencies & Brokerages (Independent)',
        buyer: 'Agency Principal / COO',
        burningPain: 'Agents spend 60% of their workday manually re-typing policy data and chasing renewals rather than selling policies.',
        hook: '"Most independent agencies lose 15-20 hours a week per agent on manual policy intake. We deploy automated parsing that extracts policy data into your CRM instantly..."'
      },
      {
        niche: '2. Real Estate Property Management (500+ Units)',
        buyer: 'Director of Operations',
        burningPain: 'Maintenance requests, tenant onboarding, and contractor dispatching drown staff in repetitive phone calls.',
        hook: '"Saw your portfolio expanded to 700+ units. We build AI tenant triage systems that automatically classify work orders and dispatch approved contractors..."'
      },
      {
        niche: '3. High-Volume E-Commerce Support & Returns',
        buyer: 'VP of Customer Experience',
        burningPain: 'Holiday volume spikes overwhelm support agents with "Where is my order?" tickets, spiking chargebacks.',
        hook: '"Curious if you are using autonomous AI agents to resolve 65% of tier-1 tracking and exchange inquiries without human intervention?"'
      }
    ]
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('niche')
    .setDescription('Match your core service to the most lucrative, high-ticket B2B niches')
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('service')
        .setDescription('Select your core service or agency offering')
        .setRequired(true)
        .addChoices(
          { name: '✉️ B2B Cold Outbound & Lead Gen', value: 'cold_email' },
          { name: '🎥 Video Editing & Content Engines', value: 'video_editing' },
          { name: '🌐 Web Design & High-Converting CRO', value: 'web_cro' },
          { name: '🤖 AI Automations & RevOps Workflows', value: 'ai_automations' }
        )
    ),

  /**
   * Execute /niche
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const serviceKey = interaction.options.getString('service') || 'cold_email';
    const data = NICHE_DATABASE[serviceKey] || NICHE_DATABASE.cold_email;

    logger.command(`User ${interaction.user.tag} invoked /niche [service: ${serviceKey}]`);

    const fields = data.topNiches.map(n => ({
      name: `🎯 ${n.niche}`,
      value: `**Decision Maker**: \`${n.buyer}\`\n**Burning Pain**: ${n.burningPain}\n**Tested Hook**: \`${n.hook}\``,
      inline: false
    }));

    fields.push({
      name: '👑 Inner Circle Account Fit Lab',
      value: '*Need bespoke TAM sizing, custom scraping, and buying committee maps for these exact niches? Apply for **The Inner Circle** (`/apply`).*',
      inline: false
    });

    const embed = createBrandedEmbed({
      title: `🗂️ HIGH-TICKET NICHE MATRIX: ${data.serviceName.toUpperCase()}`,
      description: [
        `**Service Offering**: \`${data.serviceName}\``,
        `**Benchmark Retainer**: \`${data.idealRetainer}\`\n`,
        'Here are the **top 3 verified B2B niches** with high profit margins and acute willingness to pay:'
      ].join('\n'),
      color: BRAND.COLOR_PRIMARY,
      fields
    });

    await interaction.reply({ embeds: [embed] });
  },

  NICHE_DATABASE
};
