const { SlashCommandBuilder } = require('discord.js');
const { createBrandedEmbed, BRAND } = require('../utils/helpers');
const logger = require('../utils/logger');

const CLAUSE_DATABASE = {
  ghosting_kill_fee: {
    title: '🛑 Unresponsive Client Kill-Fee & Administrative Closure',
    purpose: 'Prevents clients from pausing projects indefinitely, delaying approvals, or disappearing for weeks without payment.',
    advantage: 'Forces the client to treat your project as a priority. If they go silent for 14 days, you keep all retainers and charge a re-activation fee.',
    clause: `SECTION 4.2: UNRESPONSIVE CLIENT CLAUSE & ADMINISTRATIVE DORMANT CLOSURE
If Client fails to provide necessary approvals, assets, feedback, or credentials for a period exceeding ten (10) consecutive business days following written request by Agency, Agency reserves the right to deem the project administratively complete.

In such event:
(a) All paid retainers and setup fees shall be deemed fully earned and non-refundable;
(b) Any remaining unpaid contract balance shall become immediately due and payable; and
(c) Re-commencing services following dormant closure will require a formal Re-Activation Fee equal to 25% of the original contract value, subject to Agency team scheduling and bandwidth.`
  },
  scope_creep: {
    title: '🛡️ Scope Creep Boundary & Hourly Overage Billing',
    purpose: 'Stops "quick favor" requests, endless revision loops, and unpaid work outside the signed SOW.',
    advantage: 'Eliminates awkward confrontations by establishing an automatic contractual billing rate for un-scoped requests.',
    clause: `SECTION 5.1: SCOPE BOUNDARIES, EXCLUSIONS & OVERAGE CHARGES
Services provided by Agency shall strictly encompass the deliverables explicitly outlined in Exhibit A ("Statement of Work"). Any request by Client for additional deliverables, integrations, unexpected revisions beyond two (2) rounds, or adjacent strategic services shall be deemed "Out-of-Scope".

Out-of-Scope services will be billed at Agency's standard hourly surge rate of $175.00 USD per hour, billable in 30-minute increments. Agency shall not be obligated to commence any Out-of-Scope task without prior written authorization (email sufficient) from Client.`
  },
  payment_delinquency: {
    title: '⚡ Payment Delinquency, Late Penalties & Instant Work Stoppage',
    purpose: 'Prevents cashflow strangulation when clients delay invoices while expecting uninterrupted service.',
    advantage: 'Legally authorizes Agency to pause all campaigns, inboxes, and ad spend the moment an invoice hits 5 days overdue.',
    clause: `SECTION 6.3: PAYMENT TERMS, DELINQUENCY & AUTOMATIC SERVICE SUSPENSION
All invoices are due Net-5 days from date of issuance unless otherwise agreed in writing. If Client fails to remit payment within seven (7) calendar days of the due date, Agency reserves the right to immediately suspend all active outbound campaigns, domain warm-ups, and lead deliveries without liability.

Delinquent balances shall accrue a monthly late fee of 1.5% (or the maximum statutory rate permitted by applicable law), compounding daily until fully settled. Client shall reimburse Agency for all reasonable collection and legal costs incurred in recovering delinquent balances.`
  },
  performance_bonus: {
    title: '🎯 Objective KPI Definition & Performance Fee Guarantees',
    purpose: 'Prevents clients from redefining what a "qualified lead" or "closed deal" is after results are delivered.',
    advantage: 'Sets an objective, mathematical criteria for bonus payouts that cannot be subjectively contested.',
    clause: `SECTION 7.2: QUALIFIED MILESTONE CRITERIA & PERFORMANCE DISBURSEMENT
Performance bonuses or milestone fees shall be disbursed within five (5) business days of milestone attainment. A "Qualified Lead" is strictly defined as an enterprise prospect meeting all pre-approved ICP parameters outlined in Schedule B who attends a confirmed discovery conversation.

Subjective dissatisfaction regarding deal close rates, pricing negotiations, or internal sales team execution by Client shall not constitute grounds for withholding or offsetting earned performance disbursements.`
  },
  ip_retention: {
    title: '🔒 Intellectual Property Retention Until Final Payment',
    purpose: 'Protects custom scrapers, lead databases, video assets, and copy frameworks from theft.',
    advantage: 'Client does not legally own any asset until the final invoice clears. If they chargeback or default, they lose legal right to use your work.',
    clause: `SECTION 8.4: RESERVATION OF PROPRIETARY INTELLECTUAL PROPERTY & TRANSFER
Agency retains 100% full, exclusive, and unencumbered ownership of all custom workflows, outbound frameworks, copy templates, and technical scraping infrastructure developed during the engagement.

Upon full, final, and non-refundable payment of all contractual fees, Agency grants Client a non-exclusive, perpetual, royalty-free license to utilize the finished deliverables solely for their internal business operations. In the event of default or non-payment, any continued use of Agency assets shall constitute willful copyright infringement.`
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clause')
    .setDescription('Generate iron-clad legal and retainer protection clauses for client proposals')
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('clause_type')
        .setDescription('Select type of contract protection needed')
        .setRequired(true)
        .addChoices(
          { name: '🛑 Ghosting & Project Kill-Fee Clause', value: 'ghosting_kill_fee' },
          { name: '🛡️ Scope Creep & Hourly Overage Billing', value: 'scope_creep' },
          { name: '⚡ Payment Delinquency & Work Stoppage', value: 'payment_delinquency' },
          { name: '🎯 Objective Performance Bonus & KPI Criteria', value: 'performance_bonus' },
          { name: '🔒 IP Ownership Retention Until Full Payment', value: 'ip_retention' }
        )
    ),

  /**
   * Execute /clause
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const clauseKey = interaction.options.getString('clause_type') || 'ghosting_kill_fee';
    const data = CLAUSE_DATABASE[clauseKey] || CLAUSE_DATABASE.ghosting_kill_fee;

    logger.command(`User ${interaction.user.tag} invoked /clause [${clauseKey}]`);

    const embed = createBrandedEmbed({
      title: `📑 CONTRACT CLAUSE: ${data.title.toUpperCase()}`,
      description: [
        `### 🎯 Tactical Purpose:\n${data.purpose}\n`,
        `### ⚖️ Psychological Leverage:\n> *${data.advantage}*\n`,
        '---',
        '### 📄 Ready-To-Paste Contract Language:',
        `\`\`\`text\n${data.clause}\n\`\`\``
      ].join('\n'),
      color: BRAND.COLOR_PRIMARY,
      fields: [
        {
          name: '👑 Inner Circle Legal & SOP Vault',
          value: '*Want complete 7-figure master service agreements, retainer contracts, and contractor NDAs? Apply for **The Inner Circle** (`/apply`).*',
          inline: false
        }
      ]
    });

    await interaction.reply({ embeds: [embed] });
  },

  CLAUSE_DATABASE
};
