# DEAD LEAD SOCIETY — Discord Bot Foundation

> *"Where Dead Leads Get a Second Chance."*

Production-ready Discord bot foundation built with **Node.js 20+**, **discord.js v14**, and **JavaScript**. Designed specifically to power the **Dead Lead Society** community with declarative, configuration-driven, and idempotent server setup automation.

---

## Table of Contents

1. [Requirements](#1-requirements)
2. [Node.js Installation](#2-nodejs-installation)
3. [Dependencies Installation (`npm install`)](#3-dependencies-installation-npm-install)
4. [Creating the Discord Application](#4-creating-the-discord-application)
5. [Creating the Discord Bot](#5-creating-the-discord-bot)
6. [Inviting the Bot to Your Server](#6-inviting-the-bot-to-your-server)
7. [Required Permissions](#7-required-permissions)
8. [Creating and Configuring `.env`](#8-creating-and-configuring-env)
9. [Starting the Bot](#9-starting-the-bot)
10. [Available Commands](#10-available-commands)
11. [How the Configuration File Works](#11-how-the-configuration-file-works)
12. [How Idempotent Setup Works](#12-how-idempotent-setup-works)
13. [Security Warnings](#13-security-warnings)

---

## 1. Requirements

* **Node.js**: Version `20.0.0` or higher
* **npm**: Version `10.0.0` or higher
* A Discord account with a server where you have **Administrator** or **Manage Server** permissions
* A Discord Developer Application registered in the Discord Developer Portal

---

## 2. Node.js Installation

Ensure Node.js 20+ is installed on your operating system:

* **Windows**: Download and run the official installer from [nodejs.org](https://nodejs.org/) (LTS recommended).
* **macOS**: Install via Homebrew: `brew install node`
* **Linux (Ubuntu/Debian)**: Install via NodeSource repository:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

Verify your installation:
```bash
node -v   # Should be v20.x or higher
npm -v    # Should be v10.x or higher
```

---

## 3. Dependencies Installation (`npm install`)

From the root directory of the project (`DeadLeadSocietyBot`), run:

```bash
npm install
```

This installs:
* **`discord.js`** (`^14.18.0`): Official Discord API wrapper.
* **`dotenv`** (`^16.4.7`): Environment variable loader.

---

## 4. Creating the Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Log in with your Discord account.
3. Click the **New Application** button in the upper right.
4. Name your application (e.g. `Dead Lead Society Bot`).
5. Agree to the Discord Developer Terms of Service and click **Create**.
6. On the **General Information** page, copy your **Application ID** (this is your `CLIENT_ID`).

---

## 5. Creating the Discord Bot

1. In your application dashboard, navigate to the **Bot** tab on the left menu.
2. Click **Add Bot** (or verify the default bot user created).
3. Under the bot username, click **Reset Token** and confirm.
4. **Copy the token immediately** (this is your `DISCORD_TOKEN`). Keep it secret.
5. *Privileged Gateway Intents*: This bot foundation uses minimal intents (`GatewayIntentBits.Guilds`) and does **not** require Privileged Gateway Intents (no MessageContent or Server Members intent toggles are required).

---

## 6. Inviting the Bot to Your Server

1. In the Discord Developer Portal, navigate to **OAuth2** -> **URL Generator** on the left menu.
2. Under **Scopes**, check:
   * `bot`
   * `applications.commands` (enables slash commands like `/setup` and `/audit`)
3. Under **Bot Permissions**, select:
   * `Manage Channels`
   * `Manage Roles`
   * `View Channels`
   * `Send Messages`
   * `Embed Links`
   * `Attach Files`
   * `Read Message History`
4. Copy the generated URL at the bottom of the page.
5. Paste the URL into your web browser, select your target Discord server, and click **Authorize**.

> **Important**: In your Discord server's **Server Settings** -> **Roles**, ensure the bot's role is dragged above the roles it will create and manage (e.g. Admin, Moderator, Lead Specialist) so it has the Discord role hierarchy authority to assign and configure them.

---

## 7. Required Permissions

The bot requires these permissions to execute its setup, audit, and onboarding operations:

| Permission | Reason |
| :--- | :--- |
| `Manage Channels` | Creates and configures categories, text, forum, and voice channels. |
| `Manage Roles` | Creates, synchronizes, and assigns community member roles. |
| `View Channels` | Inspects channel structure during `/audit` and monitors channels. |
| `Send Messages` | Sends command feedback, intelligence dossiers, and alerts. |
| `Embed Links` | Displays formatted status reports, Top 30 matrices, and audit summaries. |
| `Read Message History` | Reads existing messages for idempotent synchronization. |
| `Add Reactions` | Automatically reacts to verify introductions. |
| `Manage Messages` | Pins onboarding manifesto and rules in respective channels. |

---

## 8. Creating and Configuring `.env`

Copy `.env.example` to `.env` (or update the existing `.env` file):

```bash
# Windows PowerShell:
Copy-Item .env.example .env

# macOS / Linux:
cp .env.example .env
```

Open `.env` in your text editor and fill in your three values:

```env
# Your Discord Bot Token (from Bot tab)
DISCORD_TOKEN=MTE5OT...example_token...abc

# Your Application Client ID (from General Information tab)
CLIENT_ID=123456789012345678

# Target Server (Guild) ID (Right click your Discord server -> Copy Server ID)
GUILD_ID=987654321098765432
```

> **How to get your GUILD_ID**:
> 1. In Discord, go to **User Settings** -> **Advanced** -> Turn on **Developer Mode**.
> 2. Right-click your server icon in the left server list and click **Copy Server ID**.

---

## 9. Starting the Bot

### Step 1: Deploy Slash Commands
Before the commands appear in Discord, register them with Discord's API:

```bash
npm run deploy
```

*Output:*
```
[BOOT] Preparing slash command deployment...
[COMMAND] Deploying 2 application (/) commands...
[COMMAND] Targeting guild ID: 987654321098765432
[BOOT] Successfully registered 2 guild slash commands!
```

### Step 2: Start the Bot

**Production Mode:**
```bash
npm start
```

**Development Mode (auto-restart on file save):**
```bash
npm run dev
```

*Startup log output:*
```
[BOOT] Dead Lead Society Bot is starting...
[BOOT] Logged in as Dead Lead Society Bot#1234 (ID: ...)
[BOOT] Connected successfully.
[BOOT] Serving in 1 guild(s).
```

---

## 10. Available Commands

Both commands are strictly restricted to administrators (`Administrator` or `Manage Server` permission). Normal community members cannot execute them.

### `/audit`
Inspects the current server state against `config/server-structure.json`:
* Displays system health, WebSocket latency, and member counts.
* Verifies bot permissions (`Manage Channels`, `Manage Roles`).
* Audits existing vs missing roles, categories, and channels.
* Detects duplicate channels or roles.
* Outputs a clean branded status embed.

### `/news [action: post|preview]`
Fetches the latest B2B sales, lead generation, cold outreach, and RevOps news articles:
* `action: Post to Announcements`: Broadcasts the update directly to `#announcements`.
* `action: Preview Privately`: Shows an ephemeral preview embed only visible to you.

---

## 10.1 Automated Daily Industry News

The bot automatically posts curated B2B sales and lead generation intelligence twice every day:
* **🌅 Morning Briefing**: Daily at **9:00 AM** (`Asia/Dhaka` / BST)
* **🌆 Evening Roundup**: Daily at **7:00 PM** (`Asia/Dhaka` / BST)
* **De-duplication**: Tracked via `data/posted-news.json` so the exact same article is never broadcast twice.

## 11. How the Configuration File Works

Server architecture is completely declarative and defined in:
`config/server-structure.json`

```json
{
  "community": {
    "name": "DEAD LEAD SOCIETY",
    "tagline": "Where Dead Leads Get a Second Chance."
  },
  "roles": [
    {
      "name": "Lead Specialist",
      "color": "#F1C40F",
      "hoist": true,
      "mentionable": false,
      "permissions": ["ViewChannel", "SendMessages", "ReadMessageHistory"]
    }
  ],
  "categories": [
    {
      "name": "💼 LEAD REVIVAL",
      "position": 3,
      "permissions": {
        "@everyone": {
          "allow": ["ViewChannel", "SendMessages", "ReadMessageHistory"]
        }
      },
      "channels": [
        {
          "name": "lead-strategies",
          "type": "text",
          "topic": "Strategies, revival workflows, and outreach playbooks.",
          "position": 1
        },
        {
          "name": "deal-room",
          "type": "forum",
          "topic": "Forum threads for specific dead leads and opportunities.",
          "position": 2
        }
      ]
    }
  ]
}
```

* Supported channel types: `"text"` (`GuildText`), `"voice"` (`GuildVoice`), and `"forum"` (`GuildForum`).
* When you need to add new channels or roles in future phases, edit `config/server-structure.json` and run `/setup`.

---

## 12. How Idempotent Setup Works

Idempotency guarantees that executing `/setup` multiple times produces the exact same end state without creating duplicate resources:

1. **Role Verification**:
   * Inspects `guild.roles.cache` by name.
   * If a role exists, it is reused.
   * If missing, it is created with configured colors and permissions.
   * Existing bot roles and `@everyone` are never modified or deleted.

2. **Category & Channel Verification**:
   * Inspects `guild.channels.cache` by name, type, and parent category ID.
   * Text channel names are normalized according to Discord conventions (lowercase, hyphens).
   * If `#lead-strategies` already exists under `💼 LEAD REVIVAL`, it will **never** create `#lead-strategies-2` or duplicate categories.
   * Only missing resources are provisioned.

---

## 13. Security Warnings

* **Never commit `.env`**: `.env` is listed in `.gitignore`. Never upload or share your `.env` file or bot token.
* **Token Protection**: If your bot token is accidentally leaked or posted publicly, Discord will automatically revoke it. Immediately reset the token in the Discord Developer Portal and update your local `.env`.
* **Privileged Intents**: Do not enable privileged gateway intents unless explicitly required for future features. Minimal intents keep the bot lightweight, fast, and secure.
* **Administrator Overwrites**: Never assign `Administrator` to channel permission overwrites. Discord permissions are managed securely through role assignment.

---

## 14. 24/7 Free Cloud Hosting (PC Off Support)

To keep the bot running 24/7 even when your personal computer is turned off:

1. The bot includes a built-in keep-alive HTTP health server (`src/services/healthServer.js`) listening on port `3000` (or dynamic cloud `$PORT`).
2. Deploy the repository as a **Free Web Service** on [Render.com](https://render.com) using the included `render.yaml` or [Dockerfile](Dockerfile).
3. Set a free 5-minute HTTP monitor on [UptimeRobot.com](https://uptimerobot.com) targeting your Render app's `/health` endpoint to prevent idle sleeping.
4. For complete step-by-step instructions in Bengali and English, read [HOSTING_GUIDE.md](HOSTING_GUIDE.md).
