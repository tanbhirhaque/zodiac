require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType, MessageType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { createBrandedEmbed, BRAND, channelMatches } = require('../utils/helpers');
const welcomeGuideService = require('../services/welcomeGuideService');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// Channel Topics Mapping (Purpose, Action, Rules)
const TOPIC_RULES = {
  // THE GATE
  'welcome': 'GATEWAY OVERVIEW: Official manifesto, membership credentials & 24h countdown. Read-only.',
  'read-me-first': 'THE PHILOSOPHY: Why 90% of B2B pipeline dies & how we reanimate. Read-only.',
  'how-the-society-works': 'OPERATING MECHANICS: Department tasks, submission formats & resource standards. Read-only.',
  'community-rules': 'ZERO-TOLERANCE CODE: No pitch-slapping, no unsolicited DMs, no spam. Violators are banned immediately.',
  'roadmap': 'SOCIETY ROADMAP: The complete acquisition & pipeline reanimation sequence. Read-only.',
  'introductions': 'ZODIAC GATEKEEPER: Post your 4-line intro within 24h to unlock Society Member credentials. No spam or links.',
  'announcements': 'OFFICIAL DISPATCHES: Institutional announcements from Founders & Zodiac. Read-only with reactions.',

  // THE MACHINE
  'bot-guide': 'ZODIAC MANUAL: Detailed operating guide for all 14 bot commands. Read-only.',
  'bot-commands': 'EXECUTION GROUND: Execute Zodiac commands (/reanimate, /roast, /duel, /calculator, /dns, /clause). No off-topic chatter.',
  'bot-tools': 'BOT TOOLBOX: Direct access to Zodiac diagnostics & audit tools.',
  'bot-results': 'SYSTEM OUTPUTS: Automated audit results & calculation telemetry. Read-only.',
  'bot-support': 'TECHNICAL SUPPORT: Report bot errors or request assistance with screenshot.',
  'timeout-zone': 'QUARANTINE ZONE: 24h intro deadline expired. Click [Request 24h Reactivation] to extend. No chat.',
  'dead-leads': 'THE GRAVEYARD: Post stalled or ghosted deals for collaborative community autopsy and revival scripts.',
  'lead-autopsy': 'DAILY AUTOPSY (12:00 PM): Real-world stalled deal case study with interactive diagnosis reveal button.',
  'market-trends': 'MARKET RECON (9:00 AM): Daily B2B commercial intelligence, macro trends & funding signals. Read-only.',
  'demand-signals': 'DEMAND SIGNALS (7:00 PM): Daily outreach catalysts, buying intent triggers & cold email angles. Read-only.',
  'message-frameworks': 'MESSAGE VAULT: Proven high-converting cold email, LinkedIn & follow-up frameworks. Read-only.',
  'icp-framework': 'ICP BLUEPRINT: Institutional frameworks for defining ideal buyer personas & company criteria. Read-only.',

  // PATTERN BASED TOPICS
  'task-board': 'DEPARTMENT TASKS (Read-Only): Active assignments and objectives. Submit completed work in #task-submission.',
  'task-submission': 'SUBMISSION CHAMBER: Post completed assignments, Google Docs/Notion links here. No casual chat.',
  'niche-research': 'NICHE SELECTION: Identify profitable B2B verticals, TAM analysis & market viability.',
  'icp-research': 'ICP ENGINEERING: Deep dive into company firmographics, headcount, revenue & tech stacks.',
  'buyer-persona': 'BUYER PSYCHOLOGY: Understand C-suite decision-makers, buying committees & internal politics.',
  'offer-positioning': 'OFFER ENGINEERING: Transform low-ticket commodity services into high-ticket no-brainer offers.',
  'market-research': 'MARKET INTEL: Quantitative industry trends, competitive gaps & market reports.',
  'industry-research': 'VERTICAL ANALYSIS: Deep dives into SaaS, Agencies, FinTech, Ecom & Logistics sectors.',
  'research-papers': 'WHITEPAPERS: Academic studies, econometric reports & enterprise B2B data.',
  'journal-writing': 'EXECUTION LOGS: Member field journals, outreach evidence & daily acquisition notes.',
  'presentation': 'PITCH DECKS: Slide decks, buyer presentation frameworks & meeting assets.',
  'linkedin-foundation': 'PROFILE FOUNDATION: High-status banner, headline, about section & featured proof architecture.',
  'profile-audit': 'PROFILE AUDITS: Drop your LinkedIn profile link for peer & mentor teardowns.',
  'content-research': 'AUTHORITY CONTENT: Hook frameworks, carousel structures & thought-leadership research.',
  'audience-research': 'BUYER TARGETING: Finding and connecting with high-probability decision-makers.',
  'linkedin-engagement': 'ENGAGEMENT STRATEGY: High-status commenting, networking & relationship building. No pods.',
  'linkedin-positioning': 'CATEGORY LEADERSHIP: Position yourself as the go-to specialist in your niche.',
  'linkedin-outreach': 'DIRECT OUTREACH: High-conversion direct messaging, connection notes & chat-to-call scripts.',
  'lead-research': 'PROSPECT RESEARCH: Methodologies for finding verified high-fit account data.',
  'lead-sourcing': 'LEAD EXTRACTION: Apollo, Sales Navigator, Clay & scraping workflows. No pirated data.',
  'buyer-signals': 'INTENT SIGNALS: Hiring triggers, funding rounds & leadership changes indicating active buying intent.',
  'lead-qualification': 'QUALIFICATION FILTERS: Discard tire-kickers and focus only on high-value buyers.',
  'cold-email': 'COLD OUTREACH: Deliverability, SPF/DKIM/DMARC setups, inbox warmup & copy.',
  'outreach-messaging': 'COPYWRITING LAB: Subject lines, personalized hooks & low-friction CTAs.',
  'follow-up': 'THE REVIVAL LOOP: Strategic follow-up psychology to resurrect unresponsive prospects.',
  'outreach-campaigns': 'CAMPAIGN LAUNCH: Scaled campaign setups using Instantly, Smartlead & secondary domains.',
  'outreach-results': 'CAMPAIGN DATA: Share open rates, reply rates & conversion screenshots. Redact sensitive PII.',
  'discovery-calls': 'DISCOVERY LAB: Diagnose prospect bleeding necks and disqualify tire-kickers.',
  'proposals': 'PROPOSAL DESIGN: High-ticket pricing tiers, scope boundaries & closing proposals.',
  'objection-handling': 'OBJECTION REVERSALS: Flip "no budget", "not now", or "send info" into active contracts.',
  'negotiation': 'DEAL NEGOTIATION: Protect contract margins, payment terms & scope limits.',
  'closing': 'FINAL CLOSING: Getting contracts signed, retainers wired & deals finalized.',
  'client-onboarding': 'CLIENT ONBOARDING: First 48-hour onboarding excellence, kickoff agendas & intake forms.',
  'client-retention': 'CHURN PREVENTION: Delivery quality, SLA management & compounding client lifetime value.',
  'upselling': 'UPSELL STRATEGY: Expanding contract scope and adding revenue tiers to existing accounts.',
  'cross-selling': 'CROSS-SELL ENGINES: Introducing complementary service offerings.',
  'referrals': 'REFERRAL SYSTEMS: Systematic frameworks for extracting warm client referrals.',
  'client-relationships': 'ACCOUNT MANAGEMENT: Executive communication, quarterly reviews & long-term retention.',
  'case-studies': 'CASE STUDIES: Documenting verified client transformations & proof assets.',
  'client-results': 'PROOF VAULT: Share client ROI, closed numbers & performance milestones.',
  'wins-and-results': 'REVENUE CELEBRATIONS: Celebrate closed deals & cash collected! Use Zodiac /win command.',
  'general-chat': 'THE BARRACKS: Open community discussion, daily acquisition banter & general chatter.',
  'questions': 'TACTICAL Q&A: Ask any question on acquisition, sales, tech or operations.',
  'networking': 'OPERATOR NETWORKING: Connect, exchange backgrounds and build strategic relationships.',
  'random': 'OFF-TOPIC: Casual banter, humor & non-work conversations.',
  'discussion': 'DEPARTMENT DISCUSSION: Collaborative discussions on this department topic.',
  'feedback': 'SOCIETY FEEDBACK: Share honest feedback to improve the community.',
  'suggestions': 'IDEA VAULT: Suggest improvements, events or initiatives.',
  'feature-requests': 'BOT REQUESTS: Propose new commands or features for Zodiac.',
  'report-a-problem': 'ISSUE REPORTS: Report broken links, bad behavior or server bugs.',
  'task-feedback': 'ASSIGNMENT REVIEWS: Mentor & peer feedback on submitted assignments.',
  'profile-review': 'PROFILE CRITIQUE: Peer reviews for LinkedIn, Twitter & agency websites.',
  'offer-review': 'OFFER TEARDOWNS: Submit your offer structure for harsh peer review before launching.',
  'outreach-review': 'COPY REVIEW: Get your cold email or DM reviewed before hitting send.',
  'lessons-learned': 'POST-MORTEM: Lessons from lost deals, churned clients or failed campaigns.',
  'skill-offer': 'SKILL OFFER: Offer your verified expertise to fellow operators.',
  'skill-request': 'SKILL REQUEST: Request assistance or hire specialists for specific bottlenecks.',
  'collaboration': 'JOINT VENTURES: Partner up on client projects or co-marketing campaigns.',
  'looking-for-partner': 'AGENCY PARTNERS: Find co-founders, media buyers or outreach specialists.',
  'project-help': 'SOS PROJECT HELP: Emergency assistance on active client deliverables.',
  'referral-network': 'LEAD REFERRALS: Pass off leads outside your ICP to verified society members.',
  'recommended-books': 'CANONICAL READING: Essential books on B2B sales, direct response & business psychology.',
  'templates': 'TEMPLATES: Notion dashboards, Google Sheet trackers, cold email templates & intake forms.',
  'checklists': 'OPERATIONAL CHECKLISTS: Campaign launch checklists, deliverability audits & sales prep.',
  'frameworks': 'DECISION FRAMEWORKS: Proven mental models for positioning, pricing & objection handling.',
  'research-tools': 'RESEARCH TOOLS: Top intelligence and company research software.',
  'lead-tools': 'SCRAPING TOOLS: Apollo, Clay, SalesNav, Findymail & lead database workflows.',
  'email-tools': 'EMAIL INFRASTRUCTURE: Mailboxes, warmup tools, DNS configuration & senders.',
  'linkedin-tools': 'LINKEDIN TOOLBOX: Analytics, profile enhancements & high-status workflows.',
  'analytics-tools': 'PIPELINE ANALYTICS: CRM systems, deal trackers & conversion metrics.',
  'productivity-tools': 'PRODUCTIVITY ARSENAL: Speed up operations with workflow automation tools.',
  'ai-tools': 'AI CAPABILITIES: Practical LLMs and automation tools for research and copy.'
};

client.once('clientReady', async () => {
  console.log(`\n======================================================`);
  console.log(`🏛️  APPLYING CHANNEL GUIDES & ZODIAC GATE DOMINANCE`);
  console.log(`======================================================\n`);

  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    console.log(`Connected to: ${guild.name} (${guild.id})`);
    await guild.channels.fetch();

    const welcomeChan = guild.channels.cache.find(c => channelMatches(c.name, 'welcome'));
    const readMeChan = guild.channels.cache.find(c => channelMatches(c.name, 'read-me-first'));
    const howChan = guild.channels.cache.find(c => channelMatches(c.name, 'how-the-society-works'));
    const rulesChan = guild.channels.cache.find(c => channelMatches(c.name, 'community-rules') || channelMatches(c.name, 'rules'));
    const mapChan = guild.channels.cache.find(c => channelMatches(c.name, 'roadmap') || channelMatches(c.name, 'server-map'));
    const introChan = guild.channels.cache.find(c => channelMatches(c.name, 'introductions'));
    const announceChan = guild.channels.cache.find(c => channelMatches(c.name, 'announcements'));

    // Helper to post or update embed idempotently
    const syncEmbed = async (channel, embed, searchTitle, { pin = false } = {}) => {
      if (!channel) return;
      const msgs = await channel.messages.fetch({ limit: 30 }).catch(() => null);
      let found = null;

      if (msgs) {
        for (const [, msg] of msgs) {
          if (msg.author.id === client.user.id && msg.embeds.length > 0) {
            const title = msg.embeds[0].title || '';
            if (title.toLowerCase().includes(searchTitle.toLowerCase())) {
              found = msg;
              break;
            }
          }
          if (msg.type === MessageType.ChannelPinnedMessage) {
            await msg.delete().catch(() => {});
          }
        }
      }

      if (found) {
        await found.edit({ embeds: [embed] });
        console.log(`  ✓ Updated embed: #${channel.name} [${searchTitle}]`);
      } else {
        const sent = await channel.send({ embeds: [embed] });
        if (pin) await sent.pin().catch(() => {});
        console.log(`  ✓ Posted new embed: #${channel.name} [${searchTitle}]`);
      }
      await sleep(350);
    };

    // =========================================================================
    // 1. POPULATE THE GATE (ZODIAC'S SUPREME DOMINANCE)
    // =========================================================================
    console.log(`\n--- [1/2] Establishing Zodiac's Supreme Dominance in THE GATE ---`);

    // #welcome
    if (welcomeChan) {
      console.log(`Syncing #welcome...`);
      const welcomeEmbed1 = createBrandedEmbed({
        title: '⚡ ZODIAC OVERSEER: WELCOME TO DEAD LEAD SOCIETY',
        description: [
          '***"Where Dead Leads Get a Second Chance."***\n',
          '> **I AM ZODIAC.** I am the autonomous intelligence, security gatekeeper, and pipeline reanimation engine of this society.\n',
          'In modern B2B, **over 90% of sales opportunities stall, ghost, or die in procurement**. Most teams abandon them, burning thousands chasing cold strangers.',
          '',
          '**The Core Truth of this Society:**',
          '> *A stalled prospect who already engaged with your offer has 5x more commercial value than a complete stranger—if you possess the market intelligence, diagnosis, and psychology to reanimate them.*',
          '',
          '🚨 **THE 24-HOUR ADMISSION CLOCK IS RUNNING:**',
          'You currently hold **ZERO credentials**. All 14 institutional departments and war rooms are locked.',
          `To unlock access, you must follow the instructions in <#${introChan?.id || 'introductions'}> within **24 hours**.`
        ].join('\n'),
        color: BRAND.COLOR_PRIMARY,
        fields: [
          {
            name: '🔄 The Complete Client Acquisition Cycle',
            value: '`MARKET` → `ICP` → `BUYER` → `RESEARCH` → `SIGNAL` → `LEAD` → `QUALIFICATION` → `OUTREACH` → `CONVERSATION` → `DISCOVERY` → `PROPOSAL` → `NEGOTIATION` → `CLIENT` → `RETENTION` → `EXPANSION` → `REFERRAL`',
            inline: false
          },
          {
            name: '🧟 The Dead Lead Reanimation Loop',
            value: '`DEAD LEAD` → `AUTOPSY` → `DIAGNOSIS` → `RE-STRATEGY` → `REANIMATION`',
            inline: false
          }
        ]
      });

      const welcomeEmbed2 = createBrandedEmbed({
        title: '🏛️ SOCIETY CREDENTIALS: HOW TO UNLOCK FULL ACCESS',
        description: [
          '**🏛️ Society Member Credential**',
          '• **Status**: *Official Verified Operator*',
          '• Unrestricted access to all **14 core departments**: Graveyard, Autopsy Labs, Sourcing, Cold Email, Negotiations, Armory & War Rooms.\n',
          '🚪 **How to Activate:**',
          `1. Review the rules in <#${rulesChan?.id || 'rules'}>.`,
          `2. Submit your introduction in <#${introChan?.id || 'introductions'}> using the official 4-line format.`,
          '3. **Zodiac** will verify your intro and automatically award the **`Society Member`** role!'
        ].join('\n'),
        color: BRAND.COLOR_SUCCESS
      });

      const welcomeEmbed3 = welcomeGuideService.createZodiacArsenalEmbed(guild);

      await syncEmbed(welcomeChan, welcomeEmbed1, 'ZODIAC OVERSEER');
      await syncEmbed(welcomeChan, welcomeEmbed2, 'SOCIETY CREDENTIALS', { pin: true });
      await syncEmbed(welcomeChan, welcomeEmbed3, 'ZODIAC ARSENAL', { pin: true });
    }

    // #read-me-first
    if (readMeChan) {
      console.log(`Syncing #read-me-first...`);
      const readMeEmbed = createBrandedEmbed({
        title: '📜 THE MANIFESTO: WHY DEAD LEAD SOCIETY EXISTS',
        description: [
          '### 1. The Stalled Pipeline Epidemic',
          'Every agency and B2B firm suffers from an invisible bleed: prospects who say *"Sounds interesting, send me info"*, take a call, and then vanish into thin air.',
          '',
          '### 2. Why Most Outreach Fails',
          'Generic cold email volume is dead. Deliverability filters and executive spam fatigue have made untargeted bulk outreach worthless. Modern closing requires **Signal Intelligence + Forensic Diagnosis**.',
          '',
          '### 3. The 3 Core Pillars of Dead Lead Society',
          '• **Deep Reconnaissance**: Know your buyer better than they know themselves.',
          '• **Psychological Reanimation**: Deploy break-up scripts, 9-word resets, and second-chance offers that compel stalled buyers to reply.',
          '• **Compounding Retention**: High-ticket client delivery that produces case studies and organic referrals.',
          '',
          '> *"We do not beg for replies. We re-engineer the commercial equation until ignoring us is a financial liability."*'
        ].join('\n'),
        color: BRAND.COLOR_PRIMARY
      });
      await syncEmbed(readMeChan, readMeEmbed, 'THE MANIFESTO', { pin: true });
    }

    // #how-the-society-works
    if (howChan) {
      console.log(`Syncing #how-the-society-works...`);
      const howEmbed = createBrandedEmbed({
        title: '⚙️ HOW THE SOCIETY OPERATES: THE DUAL WORKFLOW',
        description: [
          'Dead Lead Society is organized into **14 sequential client acquisition departments**.',
          '',
          '### 📋 Task Boards vs. Submission Chambers',
          '• `📋・task-board`: **Read-Only**. Contains departmental challenges and guidelines.',
          '• `✅・task-submission`: Post your completed Google Docs, Notion sheets or loom teardowns here.',
          '',
          '### 🪦 The Graveyard & The Autopsy',
          '• `🪦・dead-leads`: When an account ghosted or died, post the background here.',
          '• `🩺・lead-autopsy`: Daily at 12:00 PM, Zodiac dissects real stalled deals with interactive reveals.',
          '',
          '### 📚 Standard Resource-Post Format',
          'When sharing frameworks or tools in `🗡️ ┃ THE ARMORY`, always use this structure:\n',
          '```text',
          'RESOURCE NAME: [Tool/Framework Name]',
          'CATEGORY: [e.g. Lead Database / Outreach / AI / Closing]',
          'WHAT IT DOES: [1-2 concise sentences]',
          'BEST USE CASE: [Specific scenario where it excels]',
          'HOW TO USE: [Actionable steps or link]',
          '```'
        ].join('\n'),
        color: BRAND.COLOR_INFO
      });
      await syncEmbed(howChan, howEmbed, 'HOW THE SOCIETY OPERATES', { pin: true });
    }

    // #community-rules
    if (rulesChan) {
      console.log(`Syncing #community-rules...`);
      const rulesEmbed = createBrandedEmbed({
        title: '⚖️ ZODIAC DISCIPLINARY CODE: 5 NON-NEGOTIABLE LAWS',
        description: [
          '***High Signal. Zero Fluff. Strict Accountability.***\n',
          'Zodiac monitors and enforces these rules autonomously. Violations result in immediate disciplinary action:\n'
        ].join('\n'),
        color: BRAND.COLOR_DANGER,
        fields: [
          {
            name: '⏱️ Law 1: Mandatory 24-Hour Introduction',
            value: `Every new entrant must post their verified intro in <#${introChan?.id || 'introductions'}> within **24 hours**. Lurking unverified will trigger quarantine into the timeout zone.`,
            inline: false
          },
          {
            name: '🚫 Law 2: Zero Tolerance for Pitch-Slapping & DM Spam',
            value: 'Sending unsolicited sales offers, affiliate links, course promos, or service pitches in DMs to fellow members is prohibited.\n**Penalty: Permanent ban without warning.**',
            inline: false
          },
          {
            name: '🔒 Law 3: Confidentiality of Deal Rooms & Pipelines',
            value: 'All pipeline data, lead identities, and deal transcripts shared here are strictly confidential. Exposing member data outside this server results in immediate blacklisting.',
            inline: false
          },
          {
            name: '💎 Law 4: Proof of Execution & High Signal',
            value: 'No generic guru quotes or promotional spam. Share real campaign metrics, A/B split tests, cold email data, and actionable B2B revive strategies.',
            inline: false
          },
          {
            name: '🤝 Law 5: High-Status Professional Conduct',
            value: 'Treat fellow operators with professional respect. Sharp intellectual challenge and rigorous critique are welcomed; toxicity is not.',
            inline: false
          }
        ]
      });
      await syncEmbed(rulesChan, rulesEmbed, 'ZODIAC DISCIPLINARY CODE', { pin: true });
    }

    // #roadmap
    if (mapChan) {
      console.log(`Syncing #roadmap...`);
      const mapEmbed = createBrandedEmbed({
        title: '🗺️ DEAD LEAD SOCIETY: COMPLETE OPERATIONAL ROADMAP',
        description: [
          'Navigate the society sequentially through the client acquisition pipeline:\n',
          '```text',
          '1.  🚪 THE GATE           → Zodiac Onboarding, Rules & Introductions',
          '2.  ⚙️ THE MACHINE        → Bot Tools, Reanimation, Autopsy & Market Signals',
          '3.  🎯 TARGET SELECTION   → Niche Research, ICP Engineering & Positioning',
          '4.  🧠 INTELLIGENCE       → Market Research, Whitepapers & Evidence Gathering',
          '5.  ⚔️ THE FRONTLINE      → LinkedIn Profile Foundation, Audits & Outreach',
          '6.  🏹 HUNTING GROUND     → Lead Research, Scraping & Intent Signals',
          '7.  🚀 THE ASSAULT        → Cold Email Infrastructure, Messaging & Campaigns',
          '8.  ⚖️ THE NEGOTIATION    → Discovery Calls, Proposals & Closing Frameworks',
          '9.  🛡️ THE CLIENT FRONT   → Client Onboarding, Retention & Upselling',
          '10. 🗡️ THE ARMORY         → Curated Books, Templates, SOPs & Case Studies',
          '11. 🛠️ FIELD TOOLS        → Research, Scraping, Email & AI Software Guides',
          '12. 📊 AFTER ACTION       → Deal Wins (/win), Reviews & Lessons Learned',
          '13. 🏕️ THE BARRACKS       → Open Community Lounge, Networking & Q&A',
          '14. 🤝 ALLIANCE           → Skill Exchange, Collaboration & Lead Referrals',
          '15. 🎙️ THE WAR ROOM       → Emergency Voice, Research Rooms & Live Labs',
          '16. ☕ OFF DUTY           → Casual Coffee & Relaxed Community Bonding',
          '```'
        ].join('\n'),
        color: BRAND.COLOR_PRIMARY
      });
      await syncEmbed(mapChan, mapEmbed, 'COMPLETE OPERATIONAL ROADMAP', { pin: true });
    }

    // #introductions
    if (introChan) {
      console.log(`Syncing #introductions...`);
      const introEmbed = createBrandedEmbed({
        title: '🚨 ZODIAC GATEKEEPER DIRECTIVE: POST YOUR INTRODUCTION',
        description: [
          '> **ATTENTION NEW ENTRANTS:**',
          '> I am **Zodiac**, the autonomous gatekeeper. You are currently untrusted.',
          '> You have **24 hours** from joining to post your introduction in the exact format below.',
          '> If your 24 hours expire, you will be stripped of access and exiled to <#1551439009031389184>.\n',
          '### 📋 Mandatory Introduction Template:',
          '```yaml',
          'Name / Agency: [Your Name or Agency Name]',
          'Core Offer: [The B2B service or offer you sell]',
          'Target ICP: [Your target industry, buyer title & company size]',
          'Stalled Pipeline: [Where your leads typically stall, ghost, or die]',
          '```\n',
          '**STRICT RULES:**',
          '• Post **ONLY** the 4 lines above. Fill in your details.',
          '• Do not post single-word messages, generic "hi", or promotional links.',
          '• Once posted, I will verify your submission and immediately grant you the **`Society Member`** credential!'
        ].join('\n'),
        color: BRAND.COLOR_WARNING
      });
      await syncEmbed(introChan, introEmbed, 'ZODIAC GATEKEEPER DIRECTIVE', { pin: true });
    }

    // =========================================================================
    // 2. SYNCHRONIZE ALL CHANNEL TOPICS (PURPOSE, ACTION, RULES)
    // =========================================================================
    console.log(`\n--- [2/2] Updating All Channel Topics (Purpose, Action, Rules) ---`);

    const structurePath = path.join(__dirname, '../../config/server-structure.json');
    const structure = JSON.parse(fs.readFileSync(structurePath, 'utf8'));

    let updatedCount = 0;

    for (const catConfig of structure.categories) {
      for (const chConfig of (catConfig.channels || [])) {
        let topicToSet = null;

        // Check exact match
        const baseName = chConfig.name.replace(/^[^\w\s・┃-]+[・┃\s]*/, '').trim().toLowerCase();
        
        for (const [key, topic] of Object.entries(TOPIC_RULES)) {
          if (chConfig.name.toLowerCase().includes(key) || baseName === key) {
            topicToSet = topic;
            break;
          }
        }

        if (!topicToSet) {
          topicToSet = chConfig.topic || `${catConfig.name} - Official discussion channel. Maintain high-signal standards.`;
        }

        // Update JSON structure
        chConfig.topic = topicToSet;

        // Update live Discord channel
        const discordChan = guild.channels.cache.find(c => channelMatches(c.name, chConfig.name));
        if (discordChan && discordChan.type === ChannelType.GuildText) {
          if (discordChan.topic !== topicToSet) {
            try {
              await discordChan.setTopic(topicToSet, 'Zodiac: Align Channel Purpose and Rules');
              console.log(`  ✓ Topic set on #${discordChan.name}`);
              updatedCount++;
            } catch (err) {
              console.warn(`  ⚠️ Could not set topic on #${discordChan.name}: ${err.message}`);
            }
            await sleep(400); // Respect rate limits
          }
        }
      }
    }

    // Write updated server-structure.json
    fs.writeFileSync(structurePath, JSON.stringify(structure, null, 2));
    console.log(`\n✓ Successfully saved all updated topics to config/server-structure.json!`);

    console.log(`\n======================================================`);
    console.log(`🎉 ALL GUIDES, ZODIAC GATE DIRECTIVES & TOPICS APPLIED!`);
    console.log(`======================================================\n`);

  } catch (err) {
    console.error('Fatal execution error:', err);
  } finally {
    client.destroy();
  }
});

client.login(process.env.DISCORD_TOKEN);
