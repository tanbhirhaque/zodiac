/**
 * MASTER B2B INDUSTRY NICHE VAULT (85+ Curated Tier-1 Verticals)
 *
 * Covers US, UK, Canada, Australia, and Western European markets.
 * The intelligence engine dynamically ranks and curates the "DAILY TOP 30"
 * based on live market catalysts, seasonal windows, and buying urgency.
 */

const NICHE_VAULT = [
  // =========================================================================
  // 1. ENTERPRISE SOFTWARE, CLOUD & AI TECH
  // =========================================================================
  {
    id: 'ai-agents',
    name: 'Autonomous AI Workflow & Agentic SaaS',
    sector: '💻 Enterprise Software & AI',
    avgDealSize: '$20k - $80k ARR',
    baseScore: 98,
    momentum: '🔥 SURGE',
    catalyst: 'Enterprises cutting manual data ops to deploy autonomous AI agents with guaranteed payroll reduction.',
    targetPersona: 'Chief Technology Officer (CTO), VP of Product, Head of AI Automation',
    winVelocity: '14 - 21 Days',
    godLevelHook: {
      subject: 'automating customer ops workflows at {{companyName}}',
      message: '{{firstName}}, seeing that enterprise ops teams spend 35% of engineering capacity on manual middleware routing. Have you tested autonomous agent workflows to handle data syncs, or is your team writing internal glue code?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys end up deploying that AI workflow internally, or did that project get shelved for now?"'
  },
  {
    id: 'zero-trust',
    name: 'Zero-Trust Cybersecurity & Cloud Identity',
    sector: '💻 Enterprise Software & AI',
    avgDealSize: '$25k - $100k ARR',
    baseScore: 97,
    momentum: '🔥 SURGE',
    catalyst: 'Strict SEC and European DORA cybersecurity disclosure rules imposing direct personal liability on boards.',
    targetPersona: 'Chief Information Security Officer (CISO), VP of InfoSec, Director of IT Risk',
    winVelocity: '21 - 35 Days',
    godLevelHook: {
      subject: 'SEC disclosure compliance audit for {{companyName}}',
      message: '{{firstName}}, with new vendor disclosure mandates taking effect, regional institutions often have blind spots in third-party API identity pipelines. Are you 100% confident your vendor stack passes audit scrutiny?'
    },
    deadLeadRevival: '"{{firstName}}, checking in—did your team resolve those vendor identity audit requirements, or is that still open?"'
  },
  {
    id: 'hr-payroll',
    name: 'Cross-Border HRTech & Contractor Payroll',
    sector: '💻 Enterprise Software & AI',
    avgDealSize: '$12k - $45k ARR',
    baseScore: 89,
    momentum: '⚡ HEATING UP',
    catalyst: 'Government crackdowns on international contractor misclassification forcing mid-market platform migration.',
    targetPersona: 'VP of People, Chief Human Resources Officer (CHRO), Head of Global Payroll',
    winVelocity: '18 - 28 Days',
    godLevelHook: {
      subject: 'contractor misclassification risk for global hires',
      message: '{{firstName}}, noticed {{companyName}} has remote staff across multiple jurisdictions. Regulators have stepped up audit penalties on remote payroll classifications. Have you stress-tested your international contractor agreements recently?'
    },
    deadLeadRevival: '"{{firstName}}, have you guys finalized your global payroll setup, or did you put that on hold?"'
  },
  {
    id: 'fintech-payments',
    name: 'Embedded B2B Payments & Automated Ledgers',
    sector: '💻 Enterprise Software & AI',
    avgDealSize: '$18k - $60k ARR',
    baseScore: 86,
    momentum: '📊 STEADY',
    catalyst: 'Merchants consolidating payment gateways and ERP accounts receivable ledgers to eliminate transaction basis points.',
    targetPersona: 'Chief Financial Officer (CFO), VP of Finance, Controller',
    winVelocity: '30 - 45 Days',
    godLevelHook: {
      subject: 'reclaiming 40 bps on B2B receivable payments',
      message: '{{firstName}}, most mid-market platforms lose 30-50 basis points on outdated merchant settlement rails. Are you reviewing embedded ledger alternatives before end-of-year financial closing?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys decide to keep your current merchant processor, or are you still reviewing fees?"'
  },
  {
    id: 'martech-cdp',
    name: 'Customer Data Platforms (CDP) & Privacy Tech',
    sector: '💻 Enterprise Software & AI',
    avgDealSize: '$15k - $55k ARR',
    baseScore: 92,
    momentum: '🔥 SURGE',
    catalyst: 'Third-party tracking deprecation and privacy laws forcing enterprises to build centralized first-party data warehouses.',
    targetPersona: 'Chief Marketing Officer (CMO), VP of Data Analytics, Head of Growth',
    winVelocity: '21 - 30 Days',
    godLevelHook: {
      subject: 'first-party data attribution before Q4',
      message: '{{firstName}}, with browser privacy updates blinding ad attribution pixels, brands in your revenue tier are losing 20%+ in ad efficiency. Have you deployed a server-side CDP, or relying on standard pixels?'
    },
    deadLeadRevival: '"{{firstName}}, have you guys solved your customer data tracking issues, or did this get pushed back?"'
  },
  {
    id: 'devops-cloud-cost',
    name: 'Cloud FinOps & Kubernetes Cost Optimization',
    sector: '💻 Enterprise Software & AI',
    avgDealSize: '$20k - $70k ARR',
    baseScore: 93,
    momentum: '🔥 SURGE',
    catalyst: 'Venture-backed and enterprise tech cutting 25% AWS/Azure cloud spend to hit EBITDA profitability targets.',
    targetPersona: 'VP of Infrastructure, Head of DevOps, Cloud FinOps Director',
    winVelocity: '14 - 24 Days',
    godLevelHook: {
      subject: 'cutting idle cluster spend at {{companyName}}',
      message: '{{firstName}}, seeing that high-growth platforms typically carry 22-30% in unoptimized cloud clusters and over-provisioned pods. Are you running an automated FinOps audit this quarter?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys manage to trim down that cloud bill, or is it still a priority?"'
  },
  {
    id: 'b2b-revops',
    name: 'RevOps Automation & Sales Pipeline Intelligence',
    sector: '💻 Enterprise Software & AI',
    avgDealSize: '$10k - $40k ARR',
    baseScore: 91,
    momentum: '🔥 SURGE',
    catalyst: 'Sales pipeline leakages and SDR quota misses forcing VPs of Sales to invest in automated lead enrichment & tracking.',
    targetPersona: 'VP of Revenue Operations, Chief Revenue Officer (CRO), VP of Sales',
    winVelocity: '14 - 21 Days',
    godLevelHook: {
      subject: 'pipeline leakage in stalled CRM opportunities',
      message: '{{firstName}}, most sales teams lose 18% of qualified pipeline simply because closed-lost deals are never systematically re-engaged on day 60. Have you automated deal revival workflows across HubSpot/Salesforce?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys ever implement an automated lead revival protocol, or is that still manual?"'
  },
  {
    id: 'low-code-internal',
    name: 'Low-Code Internal Tooling & Portal Engineering',
    sector: '💻 Enterprise Software & AI',
    avgDealSize: '$12k - $38k Project',
    baseScore: 84,
    momentum: '📊 STEADY',
    catalyst: 'Engineering teams backlogged on customer-facing features; outsourcing internal back-office dashboard creation.',
    targetPersona: 'VP of Engineering, Head of Internal Tools, Operations Director',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'clearing the internal tools backlog for ops',
      message: '{{firstName}}, noticed engineering resources are usually locked into product sprint work, leaving internal ops tools lagging. Are you open to delegating custom Retool/internal portal development?'
    },
    deadLeadRevival: '"{{firstName}}, did your dev team finish building those admin dashboards, or are ops teams still waiting?"'
  },

  // =========================================================================
  // 2. HEALTHCARE, MEDICAL PRACTICES, DENTAL & LIFE SCIENCES
  // =========================================================================
  {
    id: 'dental-dso',
    name: 'Private Dental & Orthodontic Networks (DSOs)',
    sector: '🏥 Healthcare & Life Sciences',
    avgDealSize: '$12k - $35k / Network',
    baseScore: 98,
    momentum: '🔥 SURGE',
    catalyst: 'PE rollups acquiring practices with 1,200+ dormant patient charts; empty hygiene chairs directly compressing EBITDA multiples.',
    targetPersona: 'Chief Operating Officer (COO), VP of Clinical Operations, Director of Revenue Cycle',
    winVelocity: '14 - 21 Days',
    godLevelHook: {
      subject: 'dormant hygiene charts across {{companyName}} locations',
      message: '{{firstName}}, noticed you oversee clinical operations. Most multi-location DSOs leave $45k in cleanings sitting in unbooked patient charts who haven\'t returned in 9+ months. Are you testing an automated patient revival workflow?'
    },
    deadLeadRevival: '"Hey {{firstName}}, did you guys ever find a way to plug that Friday chair cancellation gap, or did you decide to leave that for Q1?"'
  },
  {
    id: 'telehealth-mental',
    name: 'Telehealth & Outpatient Mental Health Networks',
    sector: '🏥 Healthcare & Life Sciences',
    avgDealSize: '$10k - $30k / Contract',
    baseScore: 90,
    momentum: '⚡ HEATING UP',
    catalyst: 'State licensing compliance updates and insurance reimbursement delays forcing clinics to automate patient intake.',
    targetPersona: 'Practice Director, Clinical Operations Head, Managing Partner',
    winVelocity: '18 - 28 Days',
    godLevelHook: {
      subject: 'insurance credentialing bottlenecks for intake',
      message: '{{firstName}}, seeing that outpatient clinics lose 18% of prospective patient inquiries due to delayed insurance verification. Have you automated real-time payer verification before patient intake?'
    },
    deadLeadRevival: '"{{firstName}}, did your team streamline that patient intake verification, or is it still manual?"'
  },
  {
    id: 'senior-care',
    name: 'Senior Living & Assisted Care Franchises',
    sector: '🏥 Healthcare & Life Sciences',
    avgDealSize: '$15k - $50k / Facility Network',
    baseScore: 95,
    momentum: '🔥 SURGE',
    catalyst: 'Caregiver shortages and rising occupancy requirements in US/UK driving urgent need for inquiry conversion automation.',
    targetPersona: 'Executive Director, VP of Resident Experience, Chief Operating Officer',
    winVelocity: '21 - 35 Days',
    godLevelHook: {
      subject: 'family inquiry response times for facility tours',
      message: '{{firstName}}, senior living tour conversion drops 6x if family inquiries aren\'t contacted within 15 minutes. Does your facility team handle evening tour booking automatically or rely on voicemail?'
    },
    deadLeadRevival: '"{{firstName}}, checking in—were you able to lift occupancy numbers at [Facility], or did that project stall?"'
  },
  {
    id: 'medspa-cosmetic',
    name: 'High-Ticket MedSpas & Plastic Surgery Clinics',
    sector: '🏥 Healthcare & Life Sciences',
    avgDealSize: '$6k - $20k / mo Retainer',
    baseScore: 94,
    momentum: '🔥 SURGE',
    catalyst: 'High consultation no-show rates (30%+) and rising Google Ads costs forcing owners to deploy deposit-collection revival funnels.',
    targetPersona: 'Medical Director, Practice Owner, Lead Aesthetician / Practice Manager',
    winVelocity: '7 - 14 Days',
    godLevelHook: {
      subject: 'consultation no-shows at {{companyName}}',
      message: '{{firstName}}, seeing that premium aesthetic practices lose $25k/mo on phantom consult bookings who ghost before paying a deposit. Are you pre-qualifying and collecting consult holds automatically?'
    },
    deadLeadRevival: '"{{firstName}}, have you guys fixed that consult no-show problem, or did you decide to leave it as is?"'
  },
  {
    id: 'clinical-trials',
    name: 'Biotech Clinical Trial Patient Recruitment',
    sector: '🏥 Healthcare & Life Sciences',
    avgDealSize: '$30k - $120k / Trial Protocol',
    baseScore: 91,
    momentum: '⚡ HEATING UP',
    catalyst: 'Trial delays costing pharmaceutical sponsors $50,000/day; specialized patient enrollment specialists seeing surging demand.',
    targetPersona: 'Clinical Project Manager, VP of Clinical Operations, Director of Patient Recruitment',
    winVelocity: '21 - 40 Days',
    godLevelHook: {
      subject: 'accelerating cohort enrollment for Phase II/III',
      message: '{{firstName}}, patient pre-screening drop-off is the #1 cause of milestone slippage in active clinical cohorts. Are you using targeted patient pre-qualification pipelines to fill remaining trial slots?'
    },
    deadLeadRevival: '"{{firstName}}, did your team hit the enrollment milestone on that protocol, or are you still short on candidates?"'
  },
  {
    id: 'orthopedic-pt',
    name: 'Physical Therapy & Sports Medicine Clinics',
    sector: '🏥 Healthcare & Life Sciences',
    avgDealSize: '$7k - $22k / Practice Group',
    baseScore: 87,
    momentum: '⚡ HEATING UP',
    catalyst: 'High patient drop-out before completing prescribed 8-week therapy plans; clinics desperate to boost plan completion.',
    targetPersona: 'Clinical Director, Managing Physical Therapist, Regional Operations Head',
    winVelocity: '14 - 24 Days',
    godLevelHook: {
      subject: 'patient drop-off before week 4 of therapy',
      message: '{{firstName}}, over 40% of physical therapy patients churn after session 3 when pain subsides, forfeiting clinic revenue. Have you implemented automated patient retention check-ins to ensure full care plan completion?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys ever plug that patient drop-off leak, or is that still an issue?"'
  },

  // =========================================================================
  // 3. FINANCIAL SERVICES, BANKING, WEALTH & FINTECH
  // =========================================================================
  {
    id: 'wealth-ria',
    name: 'Independent RIA Wealth Managers ($100M+ AUM)',
    sector: '💼 Financial Services & Banking',
    avgDealSize: '$12k - $40k / Firm Advisory',
    baseScore: 88,
    momentum: '📊 STEADY',
    catalyst: 'Generational wealth transfer forcing traditional advisors to deploy digital client acquisition and estate planning funnels.',
    targetPersona: 'Managing Principal, Chief Investment Officer (CIO), Senior Wealth Advisor',
    winVelocity: '25 - 45 Days',
    godLevelHook: {
      subject: 'attracting next-gen HNW beneficiaries before transfer',
      message: '{{firstName}}, 70% of inheriting heirs fire their parents\' financial advisor within 12 months. Are you running proactive estate transition communications to anchor relationships with next-gen wealth?'
    },
    deadLeadRevival: '"{{firstName}}, did your firm resolve that digital onboarding strategy, or is that waiting for next year?"'
  },
  {
    id: 'commercial-insurance',
    name: 'Commercial Property & Casualty Brokerages',
    sector: '💼 Financial Services & Banking',
    avgDealSize: '$15k - $50k / Brokerage Contract',
    baseScore: 96,
    momentum: '🔥 SURGE',
    catalyst: 'Property and liability premium spikes (30%+) forcing commercial businesses to shop alternatives ahead of renewal cycles.',
    targetPersona: 'Managing Broker, Commercial Lines Director, Agency Principal',
    winVelocity: '18 - 30 Days',
    godLevelHook: {
      subject: 'targeting commercial accounts shopping renewal hikes',
      message: '{{firstName}}, middle-market CFOs are actively soliciting competing bids 60 days prior to policy renewal to escape 25%+ carrier rate hikes. Are you targeting accounts in your region before they auto-renew?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys win those commercial fleet/property accounts, or did the renewal window pass?"'
  },
  {
    id: 'b2b-debt-recovery',
    name: 'Commercial B2B Debt Recovery & Claims Resolution',
    sector: '💼 Financial Services & Banking',
    avgDealSize: '$10k - $45k / Engagement',
    baseScore: 92,
    momentum: '🔥 SURGE',
    catalyst: 'Days sales outstanding (DSO) climbing to 48.6 days; enterprise suppliers desperate to recover uncollected invoices.',
    targetPersona: 'VP of Credit & Collections, Chief Financial Officer, Head of AR',
    winVelocity: '10 - 20 Days',
    godLevelHook: {
      subject: 'recovering invoices past 90 days without litigation',
      message: '{{firstName}}, seeing enterprise suppliers experience higher overdue receivables this quarter. When accounts hit 90+ days, collection probability drops 40%. Have you deployed pre-litigation executive demand workflows?'
    },
    deadLeadRevival: '"{{firstName}}, did you collect on those outstanding corporate accounts, or did you have to write them off?"'
  },
  {
    id: 'equipment-financing',
    name: 'Commercial Equipment Leasing & Asset Financing',
    sector: '💼 Financial Services & Banking',
    avgDealSize: '$14k - $55k / Brokerage',
    baseScore: 90,
    momentum: '⚡ HEATING UP',
    catalyst: 'High commercial bank borrowing rates pushing businesses toward specialized non-bank equipment financing brokers.',
    targetPersona: 'VP of Commercial Lending, Equipment Leasing Broker, Managing Partner',
    winVelocity: '14 - 25 Days',
    godLevelHook: {
      subject: 'financing inquiries from manufacturers buying CNC/yellow iron',
      message: '{{firstName}}, commercial buyers are seeking non-bank equipment lease financing to preserve liquidity before end-of-year Section 179 tax deadlines. Are you getting direct inquiries from industrial buyers?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys close those equipment lease deals, or did the buyers delay purchasing?"'
  },

  // =========================================================================
  // 4. CORPORATE LEGAL, TAX, ACCOUNTING & ADVISORY
  // =========================================================================
  {
    id: 'corporate-tax',
    name: 'B2B Corporate Tax & R&D Credit Advisory',
    sector: '⚖️ Legal, Tax & Corporate Advisory',
    avgDealSize: '$15k - $65k / Engagement',
    baseScore: 97,
    momentum: '🔥 SURGE',
    catalyst: 'Fiscal year-end tax optimization and R&D payroll tax credit claiming windows opening for high-growth tech & manufacturing.',
    targetPersona: 'Managing Partner, Tax Practice Lead, Corporate Finance Director',
    winVelocity: '14 - 24 Days',
    godLevelHook: {
      subject: 'unclaimed R&D payroll tax credits for {{companyName}}',
      message: '{{firstName}}, most software and manufacturing firms leave $80k-$150k in federal research credits unclaimed because CPA firms overlook software engineering wages. Are you actively claiming your full R&D payroll offsets?'
    },
    deadLeadRevival: '"{{firstName}}, did your finance team claim those tax credits before fiscal year-end, or did you leave them on the table?"'
  },
  {
    id: 'commercial-litigation',
    name: 'Commercial Contract Litigation Boutiques',
    sector: '⚖️ Legal, Tax & Corporate Advisory',
    avgDealSize: '$20k - $75k+ Retainer',
    baseScore: 91,
    momentum: '⚡ HEATING UP',
    catalyst: 'Contract breach and partnership dissolution lawsuits climbing; boutique law partners seeking targeted corporate disputants.',
    targetPersona: 'Managing Partner, Commercial Litigation Partner, General Counsel Liaison',
    winVelocity: '21 - 40 Days',
    godLevelHook: {
      subject: 'corporate contract dispute intelligence in [Region]',
      message: '{{firstName}}, boutique litigation practices often rely on passive referrals, missing early-stage breach of contract disputes before other firms are retained. Have you tested direct intelligence-driven corporate partner outreach?'
    },
    deadLeadRevival: '"{{firstName}}, checking in—did your firm take on those commercial breach cases, or did the timing pass?"'
  },
  {
    id: 'business-brokerage',
    name: 'Lower-Middle Market M&A & Business Brokers ($2M-$25M)',
    sector: '⚖️ Legal, Tax & Corporate Advisory',
    avgDealSize: '$25k - $90k Success Fee / Retainer',
    baseScore: 94,
    momentum: '🔥 SURGE',
    catalyst: 'Retiring baby boomer business owners driving historic sell-side transaction volume; brokers desperate for exclusive listings.',
    targetPersona: 'Principal Broker, M&A Managing Director, Partner',
    winVelocity: '30 - 60 Days',
    godLevelHook: {
      subject: 'exclusive sell-side listings from retiring founders in [State]',
      message: '{{firstName}}, over 10,000 boomer-owned businesses with $1M+ SDE are approaching retirement this year without succession plans. Are you generating off-market conversations with founders, or relying solely on referral networks?'
    },
    deadLeadRevival: '"{{firstName}}, did you secure listings with those business owners, or did they decide not to sell?"'
  },

  // =========================================================================
  // 5. COMMERCIAL REAL ESTATE, CONSTRUCTION & INFRASTRUCTURE
  // =========================================================================
  {
    id: 'cre-reit',
    name: 'Commercial Property Asset Managers & REITs',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$25k - $90k Sourcing Project',
    baseScore: 96,
    momentum: '🔥 SURGE',
    catalyst: '$1.2T in commercial mortgages maturing; lenders enforcing 88%+ occupancy covenants before debt refinancing.',
    targetPersona: 'Managing Director of Commercial Assets, VP of Leasing, Asset Manager',
    winVelocity: '21 - 35 Days',
    godLevelHook: {
      subject: 'tenant acquisition for {{PropertyName or Market}}',
      message: '{{firstName}}, seeing that commercial industrial spaces in [Submarket] are averaging 65 days longer on market. When debt covenants require 88%+ occupancy, passive broker listings introduce timing risk. Are you running proactive outbound tenant acquisition?'
    },
    deadLeadRevival: '"{{firstName}}, checking in—have you locked in anchor tenants for [Property], or did this project get shelved for now?"'
  },
  {
    id: 'commercial-hvac-roofing',
    name: 'Commercial HVAC, Roofing & MEP Contractors',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$30k - $150k Service Contract',
    baseScore: 95,
    momentum: '🔥 SURGE',
    catalyst: 'Facility managers and property managers awarding annual preventative maintenance & emergency replacement contracts now.',
    targetPersona: 'VP of Commercial Operations, Business Development Director, Principal',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'commercial rooftop maintenance contracts with facility managers',
      message: '{{firstName}}, regional commercial property managers are locking in their annual HVAC and MEP preventative contracts before seasonal peak. Are you pitching directly to portfolio asset managers, or bidding public tenders?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys win those commercial property maintenance bids, or did the facilities team choose someone else?"'
  },
  {
    id: 'multifamily-pm',
    name: 'Multi-Family Apartment Operators (100+ Units)',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$12k - $45k / Portfolio',
    baseScore: 89,
    momentum: '⚡ HEATING UP',
    catalyst: 'Tenant turnover pressure and rental concessions forcing operators to deploy automated resident retention & debt recovery.',
    targetPersona: 'VP of Property Management, Regional Operations Director, Principal',
    winVelocity: '18 - 30 Days',
    godLevelHook: {
      subject: 'uncollected former-tenant balances across [Portfolio]',
      message: '{{firstName}}, multi-family operators typically write off 2-3% of gross rent roll in uncollected move-out balances. Are you running an automated recovery workflow on past tenant debt before sending to collections?'
    },
    deadLeadRevival: '"{{firstName}}, did your team recover those outstanding tenant balances, or did you write them off?"'
  },
  {
    id: 'commercial-solar',
    name: 'Commercial Solar & Clean Energy EPC Contractors',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$40k - $250k Commercial Installation',
    baseScore: 88,
    momentum: '📊 STEADY',
    catalyst: 'Commercial building owners seeking federal tax write-offs and rising utility bill mitigation before year-end.',
    targetPersona: 'VP of Commercial Sales, Managing Partner, Commercial Solar Developer',
    winVelocity: '30 - 60 Days',
    godLevelHook: {
      subject: 'commercial rooftop solar feasibility for warehouse owners',
      message: '{{firstName}}, warehouse and cold-storage owners are facing 25% utility spikes and seeking commercial solar retrofits to offset operational cost. Are you running direct feasibility outreach to industrial property owners?'
    },
    deadLeadRevival: '"{{firstName}}, did those warehouse owners proceed with the solar installation, or did the project stall?"'
  },

  // =========================================================================
  // 6. INDUSTRIAL MANUFACTURING, ROBOTICS & AUTOMATION
  // =========================================================================
  {
    id: 'cnc-machining',
    name: 'Precision CNC Machining & Defense Fabrication',
    sector: '🏭 Industrial & Manufacturing',
    avgDealSize: '$35k - $180k Sourcing Order',
    baseScore: 89,
    momentum: '📊 STEADY',
    catalyst: 'Aerospace, defense, and medical Tier-1 suppliers reshoring precision metal parts fabrication away from overseas vendors.',
    targetPersona: 'VP of Procurement, Supply Chain Director, Plant Operations Manager',
    winVelocity: '25 - 45 Days',
    godLevelHook: {
      subject: '5-axis machining capacity for Tier-1 defense orders',
      message: '{{firstName}}, prime aerospace and defense contractors are facing 16-week lead times on domestic 5-axis parts. Are you actively reaching supply chain managers with immediate ISO 9001 machining capacity?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys fill that machining spindle capacity, or do you still have open machine hours?"'
  },
  {
    id: 'industrial-automation',
    name: 'Industrial Robotics & Warehouse Automation Integrators',
    sector: '🏭 Industrial & Manufacturing',
    avgDealSize: '$50k - $300k Integration',
    baseScore: 93,
    momentum: '🔥 SURGE',
    catalyst: 'Manufacturing labor shortages forcing factories to automate packaging, palletizing, and repetitive assembly lines.',
    targetPersona: 'VP of Manufacturing, Plant Manager, Director of Automation',
    winVelocity: '30 - 60 Days',
    godLevelHook: {
      subject: 'automating end-of-line palletizing at [Plant]',
      message: '{{firstName}}, industrial plants with 2+ shifts lose an average of $120k/yr per line on manual end-of-line packaging bottlenecks. Are you evaluating turnkey robotic palletizing cells to de-risk labor availability?'
    },
    deadLeadRevival: '"{{firstName}}, did your plant proceed with that automation retrofit, or did budget get deferred to next fiscal year?"'
  },

  // =========================================================================
  // 7. LOGISTICS, 3PL, FREIGHT & SUPPLY CHAIN
  // =========================================================================
  {
    id: '3pl-fulfillment',
    name: 'Third-Party Logistics (3PL) & E-Commerce Fulfillment',
    sector: '🚚 Logistics & Supply Chain',
    avgDealSize: '$25k - $120k Annual Logistics Contract',
    baseScore: 97,
    momentum: '🔥 SURGE',
    catalyst: 'E-commerce brands locking in holiday buffer warehouse space over the next 60 days; sluggish providers being replaced.',
    targetPersona: 'VP of Supply Chain, Head of Logistics, Director of Fulfillment',
    winVelocity: '14 - 24 Days',
    godLevelHook: {
      subject: 'holiday buffer warehouse capacity in [Region]',
      message: '{{firstName}}, fast-growing D2C brands are locking in Q4 fulfillment capacity now to avoid carrier capacity surcharges. Are your 3PL fulfillment SLAs guaranteed for peak season, or are you reviewing secondary warehouse options?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys sign with a new fulfillment provider for peak season, or did you stick with your current 3PL?"'
  },
  {
    id: 'cold-chain-freight',
    name: 'Specialized Cold-Chain & Pharmaceutical Freight',
    sector: '🚚 Logistics & Supply Chain',
    avgDealSize: '$30k - $140k Carrier Contract',
    baseScore: 91,
    momentum: '⚡ HEATING UP',
    catalyst: 'Strict temperature tracking rules penalizing carrier delays for food and medicine distributors.',
    targetPersona: 'Logistics Procurement Manager, Director of Transportation, Supply Chain VP',
    winVelocity: '18 - 30 Days',
    godLevelHook: {
      subject: 'reefer temperature compliance for pharma shipments',
      message: '{{firstName}}, pharmaceutical and fresh distributors face heavy spoilage penalties when standard reefer carriers lack real-time telematics. Do your dedicated freight routes feature live temperature data logging?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys lock down dedicated reefer capacity, or are you still shopping carriers?"'
  },

  // =========================================================================
  // 8. HIGH-GROWTH E-COMMERCE, D2C & RETAIL BRANDS
  // =========================================================================
  {
    id: 'd2c-brands',
    name: 'Mid-Market D2C E-Commerce Brands ($5M - $50M GMV)',
    sector: '🛒 Commerce, D2C & Retail',
    avgDealSize: '$8k - $25k / mo + Performance Rev-Share',
    baseScore: 96,
    momentum: '🔥 SURGE',
    catalyst: 'Paid ad network CAC climbed 21.4% MoM; brands must unlock revenue trapped in dormant past customers before peak season.',
    targetPersona: 'Founder, Chief Marketing Officer (CMO), Head of Retention',
    winVelocity: '10 - 18 Days',
    godLevelHook: {
      subject: 'your unengaged customer list before Q4 ad rates jump',
      message: '{{firstName}}, with ad network CPMs climbing 20%+ ahead of peak season, brands in your revenue tier typically have 18-24% of annual GMV trapped in past buyers who haven\'t repurchased in 90+ days. Have you run a dedicated dead-lead reactivation campaign?'
    },
    deadLeadRevival: '"{{firstName}}, have you guys given up on unlocking revenue from your dormant customer base before Q4 starts?"'
  },
  {
    id: 'amazon-fba',
    name: 'Amazon FBA & Multi-Channel Brand Aggregators',
    sector: '🛒 Commerce, D2C & Retail',
    avgDealSize: '$10k - $40k / Engagement',
    baseScore: 88,
    momentum: '⚡ HEATING UP',
    catalyst: 'Prime season preparation requiring inventory financing and listing conversion rate optimization.',
    targetPersona: 'VP of Marketplace Sales, Head of Amazon Operations, Brand Manager',
    winVelocity: '12 - 20 Days',
    godLevelHook: {
      subject: 'listing conversion rate leakage on Amazon US',
      message: '{{firstName}}, top-selling ASINs lose up to 14% of conversions when secondary images lack high-converting video and comparison charts. Have you stress-tested your Amazon A+ content before holiday traffic spikes?'
    },
    deadLeadRevival: '"{{firstName}}, did you optimize those Amazon listings for peak season, or are you running with existing creatives?"'
  },

  // =========================================================================
  // 9. MARKETING, MEDIA, CREATIVE & PERFORMANCE AGENCIES
  // =========================================================================
  {
    id: 'performance-agencies',
    name: 'Performance Marketing & Paid Media Boutiques',
    sector: '📢 Marketing, Media & Agencies',
    avgDealSize: '$6k - $22k / mo Retainer',
    baseScore: 92,
    momentum: '🔥 SURGE',
    catalyst: 'Brand clients dropping static retainer agencies to demand performance-tied or rev-share compensation.',
    targetPersona: 'Agency Owner, Managing Director, Head of Client Acquisition',
    winVelocity: '10 - 18 Days',
    godLevelHook: {
      subject: 'retaining brand retainers that push for performance models',
      message: '{{firstName}}, e-commerce clients are canceling fixed monthly retainers in favor of revenue-share models. Are you structuring hybrid retainers to win larger accounts without taking on unhedged ad spend risk?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys close those brand retainers, or did the prospects choose a performance agency?"'
  },
  // =========================================================================
  // 10. INFRASTRUCTURE, TRADES & SPECIALTY SERVICES
  // =========================================================================
  {
    id: 'fire-protection',
    name: 'Commercial Fire Protection & Life Safety Contractors',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$20k - $80k Annual Inspection Contract',
    baseScore: 94,
    momentum: '🔥 SURGE',
    catalyst: 'Mandatory annual fire code inspections and sprinkler testing windows forcing property owners to retain certified safety inspectors.',
    targetPersona: 'Director of Life Safety, Facility Manager, Commercial Property Director',
    winVelocity: '14 - 24 Days',
    godLevelHook: {
      subject: 'annual fire sprinkler compliance inspection for [Building/Portfolio]',
      message: '{{firstName}}, municipal fire marshals are stepping up mandatory annual backflow and sprinkler inspection fines across [City]. Are your building compliance certificates current, or are you seeking competitive inspection bids?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys lock down that fire safety inspection contract, or is that still pending?"'
  },
  {
    id: 'architecture-engineering',
    name: 'Architecture & Civil Engineering Consultancies',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$25k - $120k Project Retainer',
    baseScore: 89,
    momentum: '⚡ HEATING UP',
    catalyst: 'Municipal infrastructure funding releases opening 60-day RFP submission deadlines for prime engineering consultants.',
    targetPersona: 'Managing Principal, VP of Infrastructure, Lead Architect',
    winVelocity: '30 - 50 Days',
    godLevelHook: {
      subject: 'prime consultant teaming for upcoming municipal RFPs',
      message: '{{firstName}}, seeing major municipal civil engineering RFPs opening in [Region]. Boutique firms that partner with specialized sub-consultants win 2.4x more public bids. Are you assembling proposal teams for Q3/Q4 tenders?'
    },
    deadLeadRevival: '"{{firstName}}, did your firm submit on that infrastructure RFP, or did you decide to pass?"'
  },
  {
    id: 'commercial-plumbing-mep',
    name: 'Industrial Plumbing & Mechanical Piping Contractors',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$30k - $140k Contract',
    baseScore: 91,
    momentum: '⚡ HEATING UP',
    catalyst: 'Industrial plants awarding preventative boiler and piping maintenance before winter temperature drops.',
    targetPersona: 'Plant Operations Manager, Facilities Director, Maintenance Chief',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'preventative mechanical piping maintenance before winter',
      message: '{{firstName}}, industrial boiler and high-pressure steam line failures cause an average of $80k in unplanned plant downtime during freeze events. Have you scheduled your annual mechanical piping pressure testing?'
    },
    deadLeadRevival: '"{{firstName}}, did your plant schedule that piping inspection, or did you defer it to next year?"'
  },

  // =========================================================================
  // 11. SPECIALIZED B2B SERVICES & CORPORATE SOLUTIONS
  // =========================================================================
  {
    id: 'executive-search',
    name: 'Executive Search & Technical Staffing Agencies',
    sector: '💼 Specialized B2B Services',
    avgDealSize: '$20k - $60k Placement Fee',
    baseScore: 90,
    momentum: '⚡ HEATING UP',
    catalyst: 'Tech and healthcare firms struggling to hire senior VP-level and AI technical leadership internally.',
    targetPersona: 'Chief Executive Officer (CEO), Chief People Officer, Board Search Committee Member',
    winVelocity: '21 - 35 Days',
    godLevelHook: {
      subject: 'shortlist of pre-vetted VP engineering candidates',
      message: '{{firstName}}, most executive tech searches drag past 90 days when relying on inbound job postings. We have passive candidates currently heading engineering at top SaaS firms open to confidential introductions. Are you actively recruiting?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys fill that senior VP role, or is the search still ongoing?"'
  },
  {
    id: 'corporate-events',
    name: 'Corporate Event & Executive Summit Producers',
    sector: '📢 Marketing, Media & Agencies',
    avgDealSize: '$15k - $75k Sponsorship Package',
    baseScore: 87,
    momentum: '📊 STEADY',
    catalyst: 'Enterprise B2B tech and financial sponsors finalizing Q4 and Q1 national summit sponsorship commitments.',
    targetPersona: 'VP of Corporate Marketing, Head of Field Marketing, Sponsorship Director',
    winVelocity: '21 - 40 Days',
    godLevelHook: {
      subject: 'exclusive C-level executive dinner sponsorship in [City]',
      message: '{{firstName}}, field marketing teams find executive roundtables generate 3x higher enterprise pipeline than generic tradeshow booths. Are you booking closed-door buyer dinners for your sales team this quarter?'
    },
    deadLeadRevival: '"{{firstName}}, did your team secure sponsorship for that summit, or did you allocate budget elsewhere?"'
  },
  {
    id: 'veterinary-dso',
    name: 'Veterinary Hospital & Specialty Animal Care Groups',
    sector: '🏥 Healthcare & Life Sciences',
    avgDealSize: '$10k - $30k / Hospital Group',
    baseScore: 93,
    momentum: '🔥 SURGE',
    catalyst: 'Corporate veterinary consolidators acquiring clinics with massive pet owner churn and unbooked annual wellness plans.',
    targetPersona: 'Hospital Director, Regional Operations Manager, Practice Owner',
    winVelocity: '14 - 21 Days',
    godLevelHook: {
      subject: 'lapsed pet patient wellness visits at {{companyName}}',
      message: '{{firstName}}, multi-doctor veterinary practices typically lose 25% of annual care revenue when pet owners skip annual vaccine and dental reminders. Have you automated two-way client reminders to reactivate lapsed pet parents?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys ever implement that pet owner reactivation workflow, or is the clinic still following up manually?"'
  },
  {
    id: 'wholesale-food-distribution',
    name: 'Wholesale Food & Beverage Supply Chains',
    sector: '🚚 Logistics & Supply Chain',
    avgDealSize: '$30k - $160k Supply Contract',
    baseScore: 92,
    momentum: '🔥 SURGE',
    catalyst: 'Restaurant groups and corporate hospitality renegotiating distributor contracts for margin protection ahead of holiday dining surge.',
    targetPersona: 'VP of Procurement, Supply Chain Director, Executive Chef Director',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 're-bidding broadline food supply contracts for Q4 margin',
      message: '{{firstName}}, multi-unit restaurant groups are re-auditing primary broadline distributor markups and finding 8-12% price discrepancies on staples. Are your supplier contracts locked, or are you accepting secondary distributor proposals?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys re-contract with your food distributor, or did you stick with your current vendor?"'
  },
  {
    id: 'franchise-development',
    name: 'Franchise Brand Networks & Multi-Unit Development',
    sector: '💼 Specialized B2B Services',
    avgDealSize: '$25k - $80k Franchise Fee & Advisory',
    baseScore: 89,
    momentum: '⚡ HEATING UP',
    catalyst: 'High-net-worth career transitioners seeking multi-unit franchise licenses to escape corporate executive roles.',
    targetPersona: 'VP of Franchise Development, Chief Development Officer (CDO), Franchisor Founder',
    winVelocity: '30 - 60 Days',
    godLevelHook: {
      subject: 'qualified multi-unit franchise buyers with $500k+ liquid',
      message: '{{firstName}}, franchise broker portals deliver low-intent tire kickers with sub-5% close rates. Are you generating direct off-market conversations with pre-qualified corporate executives looking to purchase multi-unit territories?'
    },
    deadLeadRevival: '"{{firstName}}, did you award those regional franchise territories, or are those development markets still open?"'
  },

  // =========================================================================
  // 12. ADVANCED ENTERPRISE SOFTWARE & AI INFRASTRUCTURE (CONTINUED)
  // =========================================================================
  {
    id: 'api-security',
    name: 'API Threat Protection & Automated Bot Defense',
    sector: '💻 Enterprise Software & AI',
    avgDealSize: '$25k - $90k ARR',
    baseScore: 94,
    momentum: '🔥 SURGE',
    catalyst: 'Shadow APIs and credential stuffing attacks causing massive cloud breaches, driving urgent enterprise CISO spending.',
    targetPersona: 'Chief Information Security Officer (CISO), VP of Product Security, Head of AppSec',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'unauthenticated shadow API endpoints at {{companyName}}',
      message: '{{firstName}}, seeing that enterprise fintech and SaaS apps have an average of 34% undocumented third-party API routes exposed to scraping. Have you run an automated perimeter discovery audit on your microservices this quarter?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys resolve that API vulnerability audit, or is that review still pending?"'
  },
  {
    id: 'data-governance',
    name: 'Enterprise Data Cataloging & AI Governance',
    sector: '💻 Enterprise Software & AI',
    avgDealSize: '$30k - $120k ARR',
    baseScore: 93,
    momentum: '🔥 SURGE',
    catalyst: 'Enterprise boards blocking internal LLM rollouts until strict PII masking, lineage tracking, and compliance guardrails are deployed.',
    targetPersona: 'Chief Data Officer (CDO), VP of Data Engineering, Head of Compliance',
    winVelocity: '21 - 35 Days',
    godLevelHook: {
      subject: 'PII leakage risk in internal LLM pipelines',
      message: '{{firstName}}, enterprise data teams often struggle with sensitive customer records leaking into internal model training vectors. Are you enforcing automated schema-level PII masking before deploying agent workflows?'
    },
    deadLeadRevival: '"{{firstName}}, have you guys finalized your enterprise data governance policy, or did that get delayed?"'
  },
  {
    id: 'industrial-iot',
    name: 'Industrial IoT & Predictive Maintenance Platforms',
    sector: '💻 Enterprise Software & AI',
    avgDealSize: '$25k - $85k ARR',
    baseScore: 91,
    momentum: '⚡ HEATING UP',
    catalyst: 'Factory plants losing up to $260k/hr in unplanned downtime seeking acoustic and vibration sensor analytics.',
    targetPersona: 'VP of Manufacturing Operations, Plant Director, Head of Asset Reliability',
    winVelocity: '21 - 42 Days',
    godLevelHook: {
      subject: 'eliminating unplanned plant line shutdowns at {{companyName}}',
      message: '{{firstName}}, manufacturing plants running legacy maintenance cycles typically incur 18+ hours of preventable line downtime annually. Have you piloted edge sensor predictive monitoring on your high-criticality CNC drives?'
    },
    deadLeadRevival: '"{{firstName}}, did your team move forward with the plant predictive maintenance pilot, or is that on hold?"'
  },
  {
    id: 'disaster-recovery',
    name: 'Enterprise DRaaS & Immutable Cloud Backup',
    sector: '💻 Enterprise Software & AI',
    avgDealSize: '$18k - $65k ARR',
    baseScore: 88,
    momentum: '📊 STEADY',
    catalyst: 'Ransomware actors actively wiping cloud snapshot backups, forcing enterprises into air-gapped immutable storage.',
    targetPersona: 'VP of Infrastructure, Director of IT Operations, Chief Technology Officer',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'immutable air-gapped recovery against ransomware',
      message: '{{firstName}}, modern ransomware strains now specifically target and delete AWS S3 and Azure backup snapshots before encrypting production databases. Are your recovery vaults truly air-gapped and write-once (WORM)?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys finalize your air-gapped backup migration, or did that project get shelved?"'
  },
  {
    id: 'it-service-management',
    name: 'Enterprise ITSM & AI Helpdesk Automation',
    sector: '💻 Enterprise Software & AI',
    avgDealSize: '$20k - $75k ARR',
    baseScore: 87,
    momentum: '⚡ HEATING UP',
    catalyst: 'Corporate IT teams drowning in Tier-1 password reset and access request tickets seeking instant generative ticket deflection.',
    targetPersona: 'VP of IT Support, Director of Service Delivery, Chief Information Officer',
    winVelocity: '14 - 21 Days',
    godLevelHook: {
      subject: 'deflecting 45% of internal Tier-1 IT tickets at {{companyName}}',
      message: '{{firstName}}, internal IT helpdesks spend an average of 14 minutes per repetitive employee access ticket. Have you deployed conversational AI resolution inside Slack/Teams, or are analysts handling tickets manually?'
    },
    deadLeadRevival: '"{{firstName}}, did your team implement that automated IT helpdesk deflection, or are you still reviewing options?"'
  },

  // =========================================================================
  // 13. HEALTHCARE, MEDTECH & CLINICAL SPECIALTIES (CONTINUED)
  // =========================================================================
  {
    id: 'ambulatory-surgery',
    name: 'Ambulatory Surgery Centers (ASCs) & Outpatient Surgical',
    sector: '🏥 Healthcare & Life Sciences',
    avgDealSize: '$30k - $150k Contract',
    baseScore: 96,
    momentum: '🔥 SURGE',
    catalyst: 'Commercial payers shifting orthopedic and spine procedures from hospitals to outpatient ASCs with 40% margin differentials.',
    targetPersona: 'ASC Medical Director, Surgical Practice Administrator, Chief Executive Officer',
    winVelocity: '21 - 35 Days',
    godLevelHook: {
      subject: 'optimizing OR block utilization at {{companyName}}',
      message: '{{firstName}}, outpatient surgical centers lose thousands per day when surgeon OR block time runs under 75% capacity. Are you dynamically filling open surgical blocks, or experiencing vacant morning slots?'
    },
    deadLeadRevival: '"{{firstName}}, did your surgical center resolve those OR scheduling gaps, or is that still open?"'
  },
  {
    id: 'molecular-diagnostics',
    name: 'Clinical Diagnostics & Molecular Pathology Labs',
    sector: '🏥 Healthcare & Life Sciences',
    avgDealSize: '$25k - $110k Contract',
    baseScore: 92,
    momentum: '⚡ HEATING UP',
    catalyst: 'Strict Medicare billing audit criteria on toxicology and molecular panels requiring automated prior-auth compliance.',
    targetPersona: 'Laboratory Director, VP of Diagnostic Operations, Chief Medical Officer',
    winVelocity: '21 - 42 Days',
    godLevelHook: {
      subject: 'reducing molecular test claim denial rates below 4%',
      message: '{{firstName}}, independent reference labs are seeing commercial claim rejections jump due to missing medical necessity documentation. Have you automated front-end accessioning scrubs to prevent retroactive billing audits?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys upgrade your lab billing and accessioning workflows, or is that still under review?"'
  },
  {
    id: 'medical-device-contract-mfg',
    name: 'Medical Device Contract Manufacturing (CDMO)',
    sector: '🏥 Healthcare & Life Sciences',
    avgDealSize: '$40k - $250k Production Run',
    baseScore: 95,
    momentum: '🔥 SURGE',
    catalyst: 'OEM medtech companies reshoring surgical tool and implant fabrication to North America to hedge supply chain risk.',
    targetPersona: 'VP of Sourcing, Director of Medical Device Engineering, Chief Operating Officer',
    winVelocity: '30 - 60 Days',
    godLevelHook: {
      subject: 'ISO 13485 surgical component machining capacity',
      message: '{{firstName}}, medical device OEMs are facing 16-week lead time bottlenecks with legacy injection and CNC suppliers. Are your precision implant supply lines fully secured for the next production cycle?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys award that medical device manufacturing contract, or is that sourcing cycle still open?"'
  },
  {
    id: 'pediatric-therapy-aba',
    name: 'Autism (ABA) & Pediatric Therapy Clinic Networks',
    sector: '🏥 Healthcare & Life Sciences',
    avgDealSize: '$20k - $70k Contract',
    baseScore: 90,
    momentum: '⚡ HEATING UP',
    catalyst: 'Private equity consolidating ABA clinic networks while struggling with high BCBA therapist turnover and insurance auth delays.',
    targetPersona: 'Clinical Director, VP of Operations, Practice Owner',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'reducing BCBA credentialing and authorization lag',
      message: '{{firstName}}, pediatric therapy providers lose an average of $8k per therapist per month during commercial credentialing delays. Are you automating insurance authorizations to get waitlisted children scheduled faster?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys shorten your patient authorization waitlist, or did that project pause?"'
  },
  {
    id: 'dme-supply',
    name: 'Durable Medical Equipment (DME) & Complex Rehab',
    sector: '🏥 Healthcare & Life Sciences',
    avgDealSize: '$15k - $60k Contract',
    baseScore: 86,
    momentum: '📊 STEADY',
    catalyst: 'CMS audit scrutiny demanding flawless Certificate of Medical Necessity (CMN) intake documentation.',
    targetPersona: 'DME General Manager, Director of Revenue Cycle, Compliance Officer',
    winVelocity: '18 - 30 Days',
    godLevelHook: {
      subject: 'preventing Medicare DME audit clawbacks on CPAP and mobility',
      message: '{{firstName}}, regional DME providers frequently experience Medicare recoupments due to incomplete physician orders. Have you implemented automated document verification before dispensing high-ticket equipment?'
    },
    deadLeadRevival: '"{{firstName}}, did your DME team resolve those intake audit issues, or is that workflow still manual?"'
  },
  {
    id: 'clinical-research-cro',
    name: 'Contract Research Organizations (CROs) & Trial Sites',
    sector: '🏥 Healthcare & Life Sciences',
    avgDealSize: '$35k - $180k Retainer',
    baseScore: 94,
    momentum: '🔥 SURGE',
    catalyst: 'Pharma sponsors terminating clinical trial sites that miss diverse patient enrollment targets within protocol windows.',
    targetPersona: 'Principal Investigator (PI), Director of Clinical Operations, Site Owner',
    winVelocity: '21 - 35 Days',
    godLevelHook: {
      subject: 'meeting Phase II/III patient enrollment milestones early',
      message: '{{firstName}}, over 80% of clinical trials experience costly delays due to slow participant recruitment. Are you generating direct-to-patient digital enrollment, or relying solely on internal investigator charts?'
    },
    deadLeadRevival: '"{{firstName}}, did your trial site reach full cohort enrollment, or are you still recruiting patients?"'
  },

  // =========================================================================
  // 14. FINANCIAL SERVICES, PRIVATE CREDIT & WEALTH (CONTINUED)
  // =========================================================================
  {
    id: 'private-credit-lending',
    name: 'Non-Bank Private Credit & Direct Lending Funds',
    sector: '💼 Financial Services & Banking',
    avgDealSize: '$50k - $250k Deal Fee',
    baseScore: 97,
    momentum: '🔥 SURGE',
    catalyst: 'Traditional commercial banks tightening underwriting standards, leaving mid-market corporate borrowers turning to direct private lenders.',
    targetPersona: 'Managing Director, Head of Private Debt, Chief Investment Officer',
    winVelocity: '21 - 45 Days',
    godLevelHook: {
      subject: 'qualified sponsor-backed credit deals ($5M - $25M EBITDA)',
      message: '{{firstName}}, regional commercial banks are walking away from senior secured refinancings. Are your credit origination teams seeing direct off-market deal flow from middle-market borrowers looking for non-bank senior debt?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys deploy that private credit tranche, or are you still looking for quality borrowers?"'
  },
  {
    id: 'family-office-advisory',
    name: 'Multi-Family Offices & Ultra-HNW Wealth Advisory',
    sector: '💼 Financial Services & Banking',
    avgDealSize: '$30k - $120k AUM Fee',
    baseScore: 93,
    momentum: '🔥 SURGE',
    catalyst: 'Great Wealth Transfer shifting $84 trillion into next-gen heirs demanding sophisticated alternative asset strategies.',
    targetPersona: 'Managing Partner, Chief Investment Officer (CIO), Senior Family Wealth Advisor',
    winVelocity: '30 - 60 Days',
    godLevelHook: {
      subject: 'intergenerational wealth retention for $25M+ families',
      message: '{{firstName}}, wealth firms lose up to 70% of transferred assets when wealth passes to the next generation. Have you established direct advisory relationships with client heirs, or is the relationship concentrated on the patriarch?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys finalize your next-gen wealth advisory framework, or is that still in discussion?"'
  },
  {
    id: 'captive-insurance',
    name: 'Captive Insurance Structuring & Risk Management',
    sector: '💼 Financial Services & Banking',
    avgDealSize: '$25k - $80k Advisory',
    baseScore: 89,
    momentum: '⚡ HEATING UP',
    catalyst: 'Commercial insurance hardening pushing mid-market companies with $1M+ premiums into single-parent captive formations.',
    targetPersona: 'Captive Manager, Risk Management Director, CFO',
    winVelocity: '30 - 60 Days',
    godLevelHook: {
      subject: 'recapturing commercial premium surplus via 831(b) captive',
      message: '{{firstName}}, middle-market businesses paying over $750k in commercial P&C are seeing 25%+ renewal spikes. Have you evaluated creating a captive structure to retain underwriting profits internally?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys move forward with that captive insurance feasibility study, or did that pause?"'
  },
  {
    id: 'erisa-pension-advisory',
    name: '401(k) / ERISA Corporate Pension & Fiduciary Advisors',
    sector: '💼 Financial Services & Banking',
    avgDealSize: '$15k - $50k Retainer',
    baseScore: 87,
    momentum: '📊 STEADY',
    catalyst: 'Class-action lawsuits over excessive 401(k) recordkeeping fees forcing corporate plan sponsors to benchmark vendor contracts.',
    targetPersona: 'VP of Human Resources, Plan Administrator, Chief Financial Officer',
    winVelocity: '21 - 42 Days',
    godLevelHook: {
      subject: 'ERISA fiduciary fee benchmarking for {{companyName}} 401(k)',
      message: '{{firstName}}, Department of Labor auditors and plaintiffs\' attorneys are actively targeting companies that haven\'t re-benchmarked recordkeeping fees in 3+ years. Are you 100% indemnified under your current advisor agreement?'
    },
    deadLeadRevival: '"{{firstName}}, did your committee complete the 401(k) fee benchmarking, or is that review still open?"'
  },
  {
    id: 'trade-finance-factoring',
    name: 'Accounts Receivable Factoring & Trade Credit',
    sector: '💼 Financial Services & Banking',
    avgDealSize: '$20k - $90k Annual Facility',
    baseScore: 91,
    momentum: '🔥 SURGE',
    catalyst: 'Extended 90-day retail payment terms straining working capital for importers, manufacturers, and distributors.',
    targetPersona: 'Chief Financial Officer (CFO), Controller, VP of Commercial Lending',
    winVelocity: '14 - 21 Days',
    godLevelHook: {
      subject: 'unlocking cash flow on Net-60/90 receivables',
      message: '{{firstName}}, consumer goods and industrial suppliers are seeing big-box retailers stretch invoice terms out past 75 days. Have you evaluated non-recourse AR factoring to bridge working capital without diluting equity?'
    },
    deadLeadRevival: '"{{firstName}}, did your company secure that accounts receivable credit line, or are invoice terms still tight?"'
  },
  {
    id: 'litigation-finance',
    name: 'Commercial Litigation Finance & Legal Funding',
    sector: '💼 Financial Services & Banking',
    avgDealSize: '$50k - $300k Deployment',
    baseScore: 95,
    momentum: '🔥 SURGE',
    catalyst: 'Corporate legal departments facing budget cuts seeking non-recourse capital to pursue multi-million commercial and patent claims.',
    targetPersona: 'Managing Partner, General Counsel, Head of Litigation Funding',
    winVelocity: '30 - 60 Days',
    godLevelHook: {
      subject: 'non-recourse funding for high-merit commercial claims ($3M+ damages)',
      message: '{{firstName}}, corporate legal teams are shelving meritorious breach-of-contract claims due to upfront hourly legal spend. Are you partnering with non-recourse litigation financiers to monetize affirmative claims off-balance sheet?'
    },
    deadLeadRevival: '"{{firstName}}, did your firm secure third-party funding for that litigation portfolio, or is that still open?"'
  },

  // =========================================================================
  // 15. LEGAL, COMPLIANCE & CORPORATE SERVICES (CONTINUED)
  // =========================================================================
  {
    id: 'patent-ip-boutique',
    name: 'Patent Prosecution & Intellectual Property Boutiques',
    sector: '⚖️ Legal, Tax & Corporate Advisory',
    avgDealSize: '$25k - $120k Retainer',
    baseScore: 92,
    momentum: '⚡ HEATING UP',
    catalyst: 'AI innovation explosion triggering rush for USPTO and international patent portfolio protection and defensibility audits.',
    targetPersona: 'Chief Legal Officer, VP of Intellectual Property, Head of R&D',
    winVelocity: '21 - 35 Days',
    godLevelHook: {
      subject: 'protecting proprietary model architectures and algorithms',
      message: '{{firstName}}, tech companies are finding their core proprietary algorithmic workflows unprotected against competitor reverse-engineering. Have you conducted an IP moat audit to file provisional patents before public disclosure?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys file those proprietary patent applications, or did you hold off for now?"'
  },
  {
    id: 'corporate-restructuring',
    name: 'Turnaround Management & Chapter 11 Reorganization',
    sector: '⚖️ Legal, Tax & Corporate Advisory',
    avgDealSize: '$35k - $150k Advisory',
    baseScore: 96,
    momentum: '🔥 SURGE',
    catalyst: 'Commercial debt maturities confronting over-leveraged middle-market companies with floating rate debt defaults.',
    targetPersona: 'Chief Restructuring Officer (CRO), Managing Director, Bankruptcy Partner',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'out-of-court covenant renegotiation and debtor liquidity',
      message: '{{firstName}}, middle-market companies facing looming debt maturities are triggering senior credit covenant breaches. Are you engaging out-of-court debt restructuring advisors before lenders enforce UCC foreclosure?'
    },
    deadLeadRevival: '"{{firstName}}, did that client resolve their debt covenant restructuring, or is the turnaround process ongoing?"'
  },
  {
    id: 'anti-money-laundering',
    name: 'AML / FinCEN Compliance & Sanctions Screening',
    sector: '⚖️ Legal, Tax & Corporate Advisory',
    avgDealSize: '$20k - $75k Audit',
    baseScore: 90,
    momentum: '⚡ HEATING UP',
    catalyst: 'Corporate Transparency Act (CTA) and FinCEN beneficial ownership reporting triggering heavy non-compliance penalties.',
    targetPersona: 'Chief Compliance Officer, Head of Financial Crime, General Counsel',
    winVelocity: '14 - 21 Days',
    godLevelHook: {
      subject: 'Corporate Transparency Act beneficial ownership audit',
      message: '{{firstName}}, thousands of operating entities risk daily civil penalties under new federal FinCEN beneficial ownership reporting rules. Have you audited your holding company structures to verify full regulatory compliance?'
    },
    deadLeadRevival: '"{{firstName}}, have you guys completed your corporate BOI filings, or did that get backlogged?"'
  },
  {
    id: 'environmental-remediation-legal',
    name: 'Environmental Regulatory & PFAS Legal Defense',
    sector: '⚖️ Legal, Tax & Corporate Advisory',
    avgDealSize: '$30k - $140k Case Fee',
    baseScore: 94,
    momentum: '🔥 SURGE',
    catalyst: 'EPA designating forever chemicals (PFAS/PFOA) as CERCLA hazardous substances, triggering massive industrial liability audits.',
    targetPersona: 'General Counsel, VP of Environmental Health & Safety (EHS), Plant Director',
    winVelocity: '21 - 42 Days',
    godLevelHook: {
      subject: 'CERCLA PFAS liability exposure for manufacturing sites',
      message: '{{firstName}}, new EPA superfund designations expose commercial property owners and manufacturers to strict retrospective cleanup liability. Have you audited your legacy effluent and discharge documentation?'
    },
    deadLeadRevival: '"{{firstName}}, did your team complete that environmental PFAS audit, or is that review still pending?"'
  },
  {
    id: 'transfer-pricing-consulting',
    name: 'International Transfer Pricing & Tax Structuring',
    sector: '⚖️ Legal, Tax & Corporate Advisory',
    avgDealSize: '$25k - $95k Study',
    baseScore: 88,
    momentum: '📊 STEADY',
    catalyst: 'OECD Pillar Two global minimum tax rules hitting multinational companies with cross-border affiliate transactions.',
    targetPersona: 'VP of Global Tax, Chief Financial Officer, Corporate Controller',
    winVelocity: '21 - 35 Days',
    godLevelHook: {
      subject: 'OECD Pillar Two transfer pricing documentation audit',
      message: '{{firstName}}, global tax authorities are stepping up transfer pricing audits on cross-border management and IP licensing fees. Are your intercompany agreements and economic benchmark studies audit-ready?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys finalize your intercompany transfer pricing study, or is that still in progress?"'
  },

  // =========================================================================
  // 16. COMMERCIAL CONSTRUCTION, FACILITIES & TRADES (CONTINUED)
  // =========================================================================
  {
    id: 'structural-steel-fabrication',
    name: 'Structural Steel Fabricators & Commercial Erectors',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$50k - $350k Contract',
    baseScore: 91,
    momentum: '🔥 SURGE',
    catalyst: 'Surging demand for industrial data centers, microchip fabs, and logistics hubs requiring heavy structural steel packages.',
    targetPersona: 'President, Chief Estimator, VP of Preconstruction, Commercial General Contractor',
    winVelocity: '21 - 45 Days',
    godLevelHook: {
      subject: 'bidding capacity for upcoming commercial steel packages',
      message: '{{firstName}}, commercial general contractors are struggling with 20+ week lead times from regional steel fabricators on industrial builds. Do you have estimating capacity to review open project drawings for Q4/Q1?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys bid on those structural steel packages, or was your shop floor booked out?"'
  },
  {
    id: 'commercial-glazing-facades',
    name: 'Commercial Glass & Architectural Facade Contractors',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$40k - $200k Project',
    baseScore: 89,
    momentum: '⚡ HEATING UP',
    catalyst: 'Commercial energy codes (ASHRAE 90.1) mandating high-performance curtain walls and thermal envelope retrofits.',
    targetPersona: 'Vice President, Senior Project Estimator, Facade Contractor Owner',
    winVelocity: '21 - 45 Days',
    godLevelHook: {
      subject: 'curtain wall & architectural glass bids on Class-A builds',
      message: '{{firstName}}, general contractors report major bid slippage on specialized glazing and curtain wall packages. Are you actively looking for prime commercial subcontract opportunities in your metropolitan territory?'
    },
    deadLeadRevival: '"{{firstName}}, did your team pick up those commercial glazing contracts, or did you pass on that round?"'
  },
  {
    id: 'commercial-paving-concrete',
    name: 'Commercial Concrete & Paving Contractors',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$30k - $160k Bid',
    baseScore: 87,
    momentum: '📊 STEADY',
    catalyst: 'Federal infrastructure grant spending and multi-acre logistics distribution center asphalt and concrete slabs.',
    targetPersona: 'President, Chief Estimator, VP of Civil Infrastructure',
    winVelocity: '14 - 30 Days',
    godLevelHook: {
      subject: 'heavy commercial paving and flatwork bid packages',
      message: '{{firstName}}, commercial developers need certified flatwork and asphalt contractors for industrial distribution yards. Are you taking on prime commercial paving contracts for the upcoming construction season?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys finalize your paving schedule for the quarter, or do you have crew availability?"'
  },
  {
    id: 'elevator-modernization',
    name: 'Commercial Elevator & Escalator Maintenance',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$25k - $90k Service Agreement',
    baseScore: 93,
    momentum: '🔥 SURGE',
    catalyst: 'Major OEM elevator monopolies charging exorbitant renewal fees, driving commercial building managers to independent contractors.',
    targetPersona: 'Commercial Property Director, VP of Facility Operations, Asset Manager',
    winVelocity: '21 - 35 Days',
    godLevelHook: {
      subject: 'reducing elevator OEM maintenance contracts by 30%',
      message: '{{firstName}}, Class-A commercial property managers are renegotiating proprietary elevator OEM contracts and finding independent certified maintenance delivers 30% lower cost with faster entrapment response. Have you audited your service agreement?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys renegotiate your elevator maintenance agreement, or did you renew with the OEM?"'
  },
  {
    id: 'asbestos-hazmat-abatement',
    name: 'Environmental Abatement & Commercial Demolition',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$35k - $180k Project',
    baseScore: 92,
    momentum: '⚡ HEATING UP',
    catalyst: 'Adaptive reuse of obsolete downtown office towers converting to residential requiring massive hazardous material removal.',
    targetPersona: 'VP of Environmental Services, Demolition Contractor Principal, Development Director',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'asbestos and lead abatement on commercial office conversions',
      message: '{{firstName}}, commercial redevelopment projects in your market are stalling during structural demo due to unexpected asbestos and lead pipe discoveries. Are your abatement crews available for immediate site surveys?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys bid that commercial abatement project, or did that job get postponed?"'
  },
  {
    id: 'commercial-waterproofing',
    name: 'Commercial Foundation Underpinning & Waterproofing',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$25k - $110k Contract',
    baseScore: 88,
    momentum: '📊 STEADY',
    catalyst: 'Extreme weather flooding and commercial foundation subsidence threatening institutional real estate asset values.',
    targetPersona: 'Commercial Asset Manager, Structural Engineer Consultant, General Contractor',
    winVelocity: '14 - 30 Days',
    godLevelHook: {
      subject: 'sub-grade waterproofing and foundation underpinning bids',
      message: '{{firstName}}, commercial property portfolios are reporting severe basement water intrusion and foundation settlement following storm events. Have you inspected subterranean membrane integrity across your core assets?'
    },
    deadLeadRevival: '"{{firstName}}, did your team address that foundation water intrusion, or is that repair still pending?"'
  },

  // =========================================================================
  // 17. ADVANCED MANUFACTURING, DEFENSE & AEROSPACE (CONTINUED)
  // =========================================================================
  {
    id: 'defense-contracting-sub',
    name: 'AS9100 / CMMC Certified Defense Subcontractors',
    sector: '🏭 Industrial & Manufacturing',
    avgDealSize: '$45k - $280k Contract',
    baseScore: 98,
    momentum: '🔥 SURGE',
    catalyst: 'Pentagon enforcing strict CMMC 2.0 cybersecurity requirements, disqualifying thousands of machine shops from defense supply chains.',
    targetPersona: 'VP of Government Operations, Quality Assurance Director, Defense Contractor Founder',
    winVelocity: '21 - 45 Days',
    godLevelHook: {
      subject: 'CMMC Level 2 compliance for Tier-1 defense subcontracting',
      message: '{{firstName}}, defense prime contractors are removing non-compliant precision machine shops from active missile and aerospace programs. Are your facility networks certified to bid DoD subcontracts this fiscal cycle?'
    },
    deadLeadRevival: '"{{firstName}}, did your shop achieve CMMC certification, or did you pause defense procurement bidding?"'
  },
  {
    id: 'additive-manufacturing-3d',
    name: 'Industrial 3D Metal Printing & Rapid Prototyping',
    sector: '🏭 Industrial & Manufacturing',
    avgDealSize: '$20k - $85k Run',
    baseScore: 91,
    momentum: '⚡ HEATING UP',
    catalyst: 'Aerospace and automotive engineers bypassing 6-month casting lead times using direct metal laser sintering (DMLS).',
    targetPersona: 'VP of Engineering, Director of R&D, Principal Mechanical Engineer',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'replacing 16-week titanium casting delays with 3D metal printing',
      message: '{{firstName}}, hardware engineering teams lose months waiting for foundry tooling molds. Have you evaluated direct metal additive manufacturing (Inconel/Titanium) to produce flight-ready production parts in 10 days?'
    },
    deadLeadRevival: '"{{firstName}}, did your engineering team test that metal 3D printing run, or are you sticking with traditional casting?"'
  },
  {
    id: 'cleanroom-engineering',
    name: 'ISO Modular Cleanroom Design & Construction',
    sector: '🏭 Industrial & Manufacturing',
    avgDealSize: '$50k - $300k Build',
    baseScore: 94,
    momentum: '🔥 SURGE',
    catalyst: 'Semiconductor CHIPS Act projects and biotech compounding pharmacies requiring certified ISO Class 5-8 clean environments.',
    targetPersona: 'VP of Facilities, Director of Cleanroom Operations, Chief Technology Officer',
    winVelocity: '30 - 60 Days',
    godLevelHook: {
      subject: 'ISO Class 5-7 cleanroom modular expansion capacity',
      message: '{{firstName}}, life science and microelectronics facilities are hitting hard space constraints for certified cleanroom environments. Are you evaluating modular prefabricated cleanrooms to accelerate time-to-production?'
    },
    deadLeadRevival: '"{{firstName}}, did your team proceed with the cleanroom buildout, or did that project timeline slip?"'
  },
  {
    id: 'injection-molding-tooling',
    name: 'Precision Plastic Injection Molding & Die Tooling',
    sector: '🏭 Industrial & Manufacturing',
    avgDealSize: '$35k - $175k Tooling',
    baseScore: 89,
    momentum: '⚡ HEATING UP',
    catalyst: 'Consumer hardware and medical OEMs transferring high-cavitation steel molds from overseas back to North American toolmakers.',
    targetPersona: 'VP of Sourcing, Tooling Engineering Manager, Plant Director',
    winVelocity: '21 - 42 Days',
    godLevelHook: {
      subject: 'domestic high-cavitation injection mold tooling capacity',
      message: '{{firstName}}, consumer hardware brands are facing unexpected shipping tariff spikes and quality defects on imported tooling. Do you have tooling capacity to quote domestic mold builds for upcoming product lines?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys award those injection mold tooling packages, or are you still reviewing vendor quotes?"'
  },
  {
    id: 'industrial-fluid-handling',
    name: 'Industrial Pump, Valve & Hydraulics Remanufacturing',
    sector: '🏭 Industrial & Manufacturing',
    avgDealSize: '$20k - $95k Contract',
    baseScore: 88,
    momentum: '📊 STEADY',
    catalyst: 'Chemical plants and paper mills avoiding 40-week OEM replacement lead times by rebuilding critical high-pressure valves and pumps.',
    targetPersona: 'Plant Maintenance Director, Reliability Engineer, Operations Manager',
    winVelocity: '14 - 21 Days',
    godLevelHook: {
      subject: 'emergency rebuild turnaround on industrial centrifugal pumps',
      message: '{{firstName}}, heavy processing facilities are waiting 30+ weeks for new OEM slurry and chemical pump deliveries. Are you partnering with certified rebuilding shops that guarantee 5-day rapid turnaround?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys get that critical slurry pump rebuilt, or did the plant replace the unit?"'
  },
  {
    id: 'aircraft-mro-services',
    name: 'FAA Part 145 Aircraft Maintenance & Overhaul (MRO)',
    sector: '🏭 Industrial & Manufacturing',
    avgDealSize: '$50k - $400k Service',
    baseScore: 95,
    momentum: '🔥 SURGE',
    catalyst: 'Global commercial aircraft delivery delays forcing passenger and cargo airlines to extend life of aging jet fleets.',
    targetPersona: 'VP of Flight Operations, Chief Inspector, MRO Station Manager',
    winVelocity: '21 - 45 Days',
    godLevelHook: {
      subject: 'C-Check and heavy maintenance hangar bay availability',
      message: '{{firstName}}, regional charter fleets and cargo carriers are struggling with severe MRO hangar bay backlogs across North America. Do you have available line maintenance slots to quote upcoming C-Check overhauls?'
    },
    deadLeadRevival: '"{{firstName}}, did your flight department secure that MRO maintenance slot, or are aircraft still grounded?"'
  },

  // =========================================================================
  // 18. COMMERCIAL REAL ESTATE & ASSET SPECIALTIES (CONTINUED)
  // =========================================================================
  {
    id: 'medical-office-syndication',
    name: 'Medical Office Building (MOB) Syndicators',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$40k - $200k Advisory',
    baseScore: 93,
    momentum: '🔥 SURGE',
    catalyst: 'Institutional capital fleeing obsolete commercial office space to acquire recession-resistant medical office assets with 95%+ occupancy.',
    targetPersona: 'Managing Principal, Head of Real Estate Acquisitions, Portfolio Manager',
    winVelocity: '21 - 45 Days',
    godLevelHook: {
      subject: 'off-market medical office building (MOB) acquisitions',
      message: '{{firstName}}, institutional buyers are aggressively pursuing healthcare real estate with long-term hospital credit tenancy. Are your acquisitions teams reviewing direct off-market MOB opportunities in prime submarkets?'
    },
    deadLeadRevival: '"{{firstName}}, did your fund close on those medical office properties, or are you still evaluating deal flow?"'
  },
  {
    id: 'cold-storage-development',
    name: 'Temperature-Controlled Cold Storage Facilities',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$60k - $350k Development',
    baseScore: 95,
    momentum: '🔥 SURGE',
    catalyst: 'Severe nationwide shortage of USDA-certified cold storage space driving industrial developers into high-margin refrigerated buildouts.',
    targetPersona: 'VP of Industrial Development, Chief Investment Officer, Cold Storage Operator Founder',
    winVelocity: '30 - 60 Days',
    godLevelHook: {
      subject: 'turnkey cold storage development and ammonia refrigeration EPC',
      message: '{{firstName}}, food distributors and pharma manufacturers are facing sub-3% cold storage vacancy rates across major transportation corridors. Are you currently developing or retrofitting refrigerated square footage?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys begin construction on that cold storage facility, or is that project in permitting?"'
  },
  {
    id: 'self-storage-operators',
    name: 'Institutional Self-Storage Operators & Developers',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$25k - $120k Retainer',
    baseScore: 89,
    momentum: '⚡ HEATING UP',
    catalyst: 'Regional self-storage operators rolling up mom-and-pop facilities and automating gate access to run unstaffed remote facilities.',
    targetPersona: 'Chief Executive Officer, Director of Self-Storage Operations, Asset Manager',
    winVelocity: '18 - 35 Days',
    godLevelHook: {
      subject: 'converting storage facilities to 100% automated contactless operations',
      message: '{{firstName}}, multi-facility self-storage operators are reducing on-site payroll by 60% by deploying automated kiosks and mobile smart locks. Have you piloted unstaffed operations across your secondary locations?'
    },
    deadLeadRevival: '"{{firstName}}, did your storage group deploy remote automation, or are you still staffing facilities manually?"'
  },
  {
    id: 'commercial-tax-appeal',
    name: 'Commercial Property Tax Grievance & Assessment Appeal',
    sector: '🏢 Real Estate & Construction',
    avgDealSize: '$15k - $70k Success Fee',
    baseScore: 90,
    momentum: '⚡ HEATING UP',
    catalyst: 'Declining commercial office valuations creating massive opportunities for retroactive property tax reductions and cash refunds.',
    targetPersona: 'Director of Property Tax, Asset Management VP, Chief Financial Officer',
    winVelocity: '21 - 35 Days',
    godLevelHook: {
      subject: 'reclaiming commercial property tax overpayments on Class-B office',
      message: '{{firstName}}, commercial real estate owners are successfully appealing county property tax assessments based on post-pandemic capitalization rate spikes. Have you filed valuation reduction petitions for your commercial assets this tax year?'
    },
    deadLeadRevival: '"{{firstName}}, did your fund file those property tax appeals, or did you miss the county filing deadline?"'
  },

  // =========================================================================
  // 19. SPECIALIZED LOGISTICS, MARITIME & TRANSPORT (CONTINUED)
  // =========================================================================
  {
    id: 'drayage-intermodal-freight',
    name: 'Port Drayage & Intermodal Rail Freight Carriers',
    sector: '🚚 Logistics & Supply Chain',
    avgDealSize: '$30k - $140k Annual Route',
    baseScore: 91,
    momentum: '🔥 SURGE',
    catalyst: 'Port demurrage fees and terminal congestion pushing high-volume shippers to contract dedicated drayage carriers with clean truck fleets.',
    targetPersona: 'VP of Transportation, Logistics Director, Drayage Fleet Owner',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'eliminating ocean container demurrage at major port terminals',
      message: '{{firstName}}, retail and industrial importers are losing millions to port demurrage fees when ocean boxes sit past free time. Do you have dedicated chassis and driver capacity to pull containers from rail terminals within 24 hours?'
    },
    deadLeadRevival: '"{{firstName}}, did your shipping team resolve those port demurrage bottlenecks, or are containers still delayed?"'
  },
  {
    id: 'heavy-haul-oversized',
    name: 'Heavy Haul & Oversized Industrial Equipment Transport',
    sector: '🚚 Logistics & Supply Chain',
    avgDealSize: '$25k - $110k Project',
    baseScore: 90,
    momentum: '⚡ HEATING UP',
    catalyst: 'Wind turbine, utility transformer, and manufacturing plant machinery moves requiring complex state permitting and multi-axle trailers.',
    targetPersona: 'VP of Heavy Logistics, Project Freight Director, Fleet Operations Manager',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'oversized superload transport and route permitting capacity',
      message: '{{firstName}}, utility and EPC contractors face multi-month project delays when heavy haul trailers fail state escort permitting. Are you accepting direct heavy equipment rigging and route transportation contracts?'
    },
    deadLeadRevival: '"{{firstName}}, did your team move those oversized transformers, or is that transport project still waiting on permits?"'
  },
  {
    id: 'maritime-shipyard-repair',
    name: 'Commercial Marine & Commercial Shipyard Services',
    sector: '🚚 Logistics & Supply Chain',
    avgDealSize: '$45k - $250k Overhaul',
    baseScore: 92,
    momentum: '⚡ HEATING UP',
    catalyst: 'Coast Guard safety inspections and maritime environmental retrofits driving tug, barge, and ferry drydocking demand.',
    targetPersona: 'Port Captain, Marine Operations Director, Shipyard General Manager',
    winVelocity: '21 - 42 Days',
    godLevelHook: {
      subject: 'drydock space availability for commercial tug and barge inspection',
      message: '{{firstName}}, commercial vessel operators are waiting 12+ weeks for certified drydock inspection berths to maintain USCG certificates of inspection. Do you have drydock availability for upcoming regulatory refits?'
    },
    deadLeadRevival: '"{{firstName}}, did your maritime fleet complete drydock inspection, or are vessels awaiting shipyard space?"'
  },
  {
    id: 'drone-infrastructure-inspection',
    name: 'Commercial Drone LIDAR & Infrastructure Inspection',
    sector: '🚚 Logistics & Supply Chain',
    avgDealSize: '$18k - $65k Survey',
    baseScore: 89,
    momentum: '⚡ HEATING UP',
    catalyst: 'Utility powerline wildfire liabilities and bridge corrosion mandates replacing human climbers with autonomous drone LIDAR scans.',
    targetPersona: 'VP of Asset Integrity, Director of Utility Maintenance, Civil Inspection Lead',
    winVelocity: '14 - 21 Days',
    godLevelHook: {
      subject: 'sub-centimeter drone LIDAR utility corridor surveys',
      message: '{{firstName}}, manual utility line and structural inspections cost 5x more and expose ground crews to severe fall hazards. Have you integrated autonomous drone thermal and LIDAR surveys to inspect high-voltage transmission lines?'
    },
    deadLeadRevival: '"{{firstName}}, did your utility team test that drone inspection pilot, or are crews still inspecting manually?"'
  },

  // =========================================================================
  // 20. RENEWABLE ENERGY, UTILITIES & CLEANTECH (CONTINUED)
  // =========================================================================
  {
    id: 'commercial-ev-charging-epc',
    name: 'Commercial EV Fleet Charging Infrastructure EPCs',
    sector: '⚡ Energy & CleanTech',
    avgDealSize: '$35k - $180k Turnkey Build',
    baseScore: 96,
    momentum: '🔥 SURGE',
    catalyst: 'Corporate ESG mandates and municipal diesel bans forcing delivery fleets to construct dedicated Level 3 DC fast-charging depots.',
    targetPersona: 'VP of Fleet Electrification, Director of Sustainable Infrastructure, Chief Operating Officer',
    winVelocity: '21 - 45 Days',
    godLevelHook: {
      subject: 'utility interconnect approvals for commercial DC fast charging',
      message: '{{firstName}}, commercial fleet electrification plans are stalling 9+ months waiting for local electric utility interconnect studies. Are you working with turnkey EPCs that handle utility engineering and NEVI grant funding directly?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys get that EV charging depot energized, or is the project held up at the utility?"'
  },
  {
    id: 'bess-battery-storage',
    name: 'Commercial & Industrial Battery Energy Storage (BESS)',
    sector: '⚡ Energy & CleanTech',
    avgDealSize: '$50k - $300k Installation',
    baseScore: 97,
    momentum: '🔥 SURGE',
    catalyst: 'Industrial plants facing crippling utility demand charges ($25+/kW) installing on-site batteries for peak shaving.',
    targetPersona: 'Chief Sustainability Officer, VP of Plant Engineering, Director of Energy Management',
    winVelocity: '21 - 45 Days',
    godLevelHook: {
      subject: 'eliminating $150k+ in utility peak demand charges with BESS',
      message: '{{firstName}}, manufacturing plants running heavy shifts see utility demand charges make up over 40% of their electric bill. Have you modeled on-site battery storage (BESS) to shave peak kilowatt spikes?'
    },
    deadLeadRevival: '"{{firstName}}, did your facility complete that battery storage feasibility study, or did that project pause?"'
  },
  {
    id: 'industrial-water-treatment',
    name: 'Industrial Wastewater Treatment & Water Reclamation',
    sector: '⚡ Energy & CleanTech',
    avgDealSize: '$30k - $150k System',
    baseScore: 91,
    momentum: '⚡ HEATING UP',
    catalyst: 'Municipalities slapping chemical plants and food processors with massive sewer surcharge fines for high BOD/COD discharge.',
    targetPersona: 'VP of Environmental Compliance, Plant Engineer, EHS Director',
    winVelocity: '21 - 42 Days',
    godLevelHook: {
      subject: 'eliminating municipal sewer surcharge fines on wastewater discharge',
      message: '{{firstName}}, food and industrial processors are paying tens of thousands per month in city sewer discharge surcharges. Have you evaluated closed-loop water filtration to recycle 80% of process water on-site?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys install that wastewater treatment system, or are you still paying city surcharges?"'
  },
  {
    id: 'energy-procurement-brokerage',
    name: 'Commercial Deregulated Electricity & Gas Brokers',
    sector: '⚡ Energy & CleanTech',
    avgDealSize: '$20k - $80k Commission',
    baseScore: 88,
    momentum: '📊 STEADY',
    catalyst: 'Volatile natural gas and power wholesale markets prompting corporate CFOs to lock multi-year fixed commercial supply rates.',
    targetPersona: 'Chief Financial Officer (CFO), VP of Procurement, Director of Facilities',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'locking commercial wholesale electric rates before winter rate hikes',
      message: '{{firstName}}, multi-facility commercial enterprises in deregulated energy states often pay default utility tariff rates 18% above wholesale. Have you reverse-auctioned your electric supply contracts for the upcoming calendar year?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys lock your commercial energy supply contract, or did you stay on the default utility rate?"'
  },

  // =========================================================================
  // 21. SPECIALIZED HIGH-END B2B SERVICES & GOVCON (CONTINUED)
  // =========================================================================
  {
    id: 'govcon-capture-advisory',
    name: 'GovCon Federal RFP Capture & Proposal Writing',
    sector: '💼 Specialized B2B Services',
    avgDealSize: '$25k - $100k Proposal Fee',
    baseScore: 97,
    momentum: '🔥 SURGE',
    catalyst: 'Government contractors losing multi-million dollar federal RFPs on minor compliance errors seeking veteran capture executives.',
    targetPersona: 'VP of Business Development, Director of Federal Sales, GovCon Founder',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'Federal RFP win-rate optimization on upcoming DoD/DHS bids',
      message: '{{firstName}}, mid-tier federal contractors lose 70% of competitive bids due to weak Section L & M compliance scoring. Are you bringing in veteran capture management to write your prime proposals before final RFP submission?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys submit that federal RFP proposal, or did you decide not to bid?"'
  },
  {
    id: 'crisis-pr-communications',
    name: 'High-Stakes Corporate Crisis PR & Reputation Firms',
    sector: '📢 Marketing, Media & Agencies',
    avgDealSize: '$30k - $150k Retainer',
    baseScore: 93,
    momentum: '🔥 SURGE',
    catalyst: 'Executive scandals, data breaches, and activist short-seller attacks requiring immediate 24/7 strategic narrative control.',
    targetPersona: 'Chief Communications Officer (CCO), General Counsel, Board Chairman',
    winVelocity: '7 - 14 Days',
    godLevelHook: {
      subject: 'crisis response protocol and media mitigation for {{companyName}}',
      message: '{{firstName}}, corporate PR disasters escalate into brand-destroying headlines within 90 minutes on social channels. Does your executive team have a battle-tested crisis response agency on immediate emergency retainer?'
    },
    deadLeadRevival: '"{{firstName}}, did your team finalize that crisis PR retainer agreement, or did that issue blow over?"'
  },
  {
    id: 'cyber-insurance-brokerage',
    name: 'Specialized Cyber Liability & Ransomware Underwriting',
    sector: '💼 Financial Services & Banking',
    avgDealSize: '$15k - $60k Annual Premium',
    baseScore: 92,
    momentum: '⚡ HEATING UP',
    catalyst: 'Carriers refusing to renew commercial cyber policies without proof of enterprise MFA, endpoint detection, and offline backups.',
    targetPersona: 'Chief Risk Officer, VP of Insurance, Chief Financial Officer',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'securing commercial cyber liability renewals without coverage exclusions',
      message: '{{firstName}}, cyber insurers are denying claims on un-audited cloud environments and slapping 40% premium increases on renewals. Have you stress-tested your security controls against standard carrier underwriting checklists?'
    },
    deadLeadRevival: '"{{firstName}}, did you guys bind your cyber liability insurance renewal, or are you still shopping quotes?"'
  },
  {
    id: 'b2b-customer-success-ops',
    name: 'Enterprise Customer Success & Churn Mitigation Ops',
    sector: '💻 Enterprise Software & AI',
    avgDealSize: '$20k - $70k ARR',
    baseScore: 90,
    momentum: '⚡ HEATING UP',
    catalyst: 'SaaS companies struggling with negative net revenue retention (NRR) hiring specialized CS ops to predict and halt enterprise churn.',
    targetPersona: 'Chief Customer Officer (CCO), VP of Customer Success, Head of Retention',
    winVelocity: '14 - 28 Days',
    godLevelHook: {
      subject: 'flagging at-risk enterprise accounts 60 days before contract renewal',
      message: '{{firstName}}, B2B SaaS companies lose up to 15% of annual contract value when customer health declines invisibly. Have you implemented automated product telemetry to alert CSMs when executive login frequency drops?'
    },
    deadLeadRevival: '"{{firstName}}, did your CS team implement that automated churn detection system, or is retention still an issue?"'
  }
];

module.exports = {
  NICHE_VAULT
};
