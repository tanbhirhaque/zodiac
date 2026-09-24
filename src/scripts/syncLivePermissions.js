require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits, OverwriteType } = require('discord.js');
const fs = require('fs');
const path = require('path');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('clientReady', async () => {
  console.log(`\n======================================================`);
  console.log(`🛡️  ZODIAC LIVE PERMISSION SYNCHRONIZER`);
  console.log(`======================================================\n`);

  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    console.log(`Connected to Guild: ${guild.name} (ID: ${guild.id})`);

    await guild.channels.fetch();
    await guild.roles.fetch();

    const structurePath = path.join(__dirname, '../../config/server-structure.json');
    const structure = JSON.parse(fs.readFileSync(structurePath, 'utf8'));

    const roleEveryone = guild.roles.everyone;
    const roleSocietyMember = guild.roles.cache.find(r => r.name.toLowerCase() === 'society member');
    const roleTimedOut = guild.roles.cache.find(r => r.name.toLowerCase() === 'timed out');
    const roleFounder = guild.roles.cache.find(r => r.name.toLowerCase() === 'founder');
    const roleAdmin = guild.roles.cache.find(r => r.name.toLowerCase() === 'administrator' || r.name.toLowerCase() === 'admin');
    const roleMod = guild.roles.cache.find(r => r.name.toLowerCase() === 'moderator');

    if (!roleSocietyMember) {
      throw new Error('Crucial role "Society Member" not found in guild!');
    }
    console.log(`✓ Resolved roles:`);
    console.log(`  - @everyone: ${roleEveryone.id}`);
    console.log(`  - Society Member: ${roleSocietyMember.id}`);
    console.log(`  - Timed Out: ${roleTimedOut ? roleTimedOut.id : 'N/A'}`);
    console.log(`  - Founder: ${roleFounder ? roleFounder.id : 'N/A'}`);
    console.log(`  - Admin: ${roleAdmin ? roleAdmin.id : 'N/A'}`);
    console.log(`  - Mod: ${roleMod ? roleMod.id : 'N/A'}\n`);

    // Helper to sleep and avoid hitting Discord rate limits
    const safeRateLimitDelay = 350;

    // 1. Sync Categories
    console.log(`--- [1/2] Synchronizing Category Permissions ---`);
    for (const catConfig of structure.categories) {
      const category = guild.channels.cache.find(
        c => c.type === ChannelType.GuildCategory && c.name.toLowerCase() === catConfig.name.toLowerCase()
      );

      if (!category) {
        console.warn(`[WARN] Category not found on server: "${catConfig.name}"`);
        continue;
      }

      const isGate = catConfig.name.includes('THE GATE');

      const overwrites = [];

      if (isGate) {
        // THE GATE: Publicly viewable, but members/everyone cannot send messages at category level
        overwrites.push({
          id: roleEveryone.id,
          type: OverwriteType.Role,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
          deny: [PermissionFlagsBits.SendMessages]
        });
        overwrites.push({
          id: roleSocietyMember.id,
          type: OverwriteType.Role,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
          deny: [PermissionFlagsBits.SendMessages]
        });
      } else {
        // ALL OTHER 15 CATEGORIES: Strictly locked from @everyone, unlocked for Society Member
        overwrites.push({
          id: roleEveryone.id,
          type: OverwriteType.Role,
          deny: [PermissionFlagsBits.ViewChannel]
        });
        overwrites.push({
          id: roleSocietyMember.id,
          type: OverwriteType.Role,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
        });
      }

      // Staff roles
      if (roleFounder) {
        overwrites.push({
          id: roleFounder.id,
          type: OverwriteType.Role,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages]
        });
      }
      if (roleAdmin) {
        overwrites.push({
          id: roleAdmin.id,
          type: OverwriteType.Role,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages]
        });
      }
      if (roleMod) {
        overwrites.push({
          id: roleMod.id,
          type: OverwriteType.Role,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages]
        });
      }

      try {
        await category.permissionOverwrites.set(overwrites, 'Zodiac: Align Least Privilege Structure');
        console.log(`✓ Category Synced: "${category.name}" [${isGate ? 'PUBLIC GATE' : 'LOCKED FOR @EVERYONE'}]`);
      } catch (err) {
        console.error(`✗ Error on Category "${category.name}":`, err.message);
      }

      await sleep(safeRateLimitDelay);
    }

    // 2. Sync Channels within Categories
    console.log(`\n--- [2/2] Synchronizing Channel-Level Overwrites ---`);
    for (const catConfig of structure.categories) {
      const category = guild.channels.cache.find(
        c => c.type === ChannelType.GuildCategory && c.name.toLowerCase() === catConfig.name.toLowerCase()
      );
      if (!category) continue;

      const isGate = catConfig.name.includes('THE GATE');
      const childChannels = guild.channels.cache.filter(c => c.parentId === category.id);

      for (const [, channel] of childChannels) {
        const name = channel.name.toLowerCase();
        const isVoice = channel.type === ChannelType.GuildVoice;
        const isIntro = name.includes('introductions');
        const isTimeout = name.includes('timeout-zone');
        const isTaskBoard = name.includes('task-board');
        const isBroadcast = name.includes('market-trends') || name.includes('demand-signals') || name.includes('bot-results') || name.includes('lead-autopsy') || name.includes('message-frameworks') || name.includes('icp-framework') || name.includes('bot-guide');

        const channelOverwrites = [];

        // Staff overwrites
        if (roleFounder) {
          channelOverwrites.push({
            id: roleFounder.id,
            type: OverwriteType.Role,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages]
          });
        }
        if (roleAdmin) {
          channelOverwrites.push({
            id: roleAdmin.id,
            type: OverwriteType.Role,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages]
          });
        }
        if (roleMod) {
          channelOverwrites.push({
            id: roleMod.id,
            type: OverwriteType.Role,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages]
          });
        }

        if (isTimeout) {
          // Timeout zone: hidden from everyone & Society Member, visible only to Timed Out role
          channelOverwrites.push({
            id: roleEveryone.id,
            type: OverwriteType.Role,
            deny: [PermissionFlagsBits.ViewChannel]
          });
          channelOverwrites.push({
            id: roleSocietyMember.id,
            type: OverwriteType.Role,
            deny: [PermissionFlagsBits.ViewChannel]
          });
          if (roleTimedOut) {
            channelOverwrites.push({
              id: roleTimedOut.id,
              type: OverwriteType.Role,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
              deny: [PermissionFlagsBits.SendMessages]
            });
          }
        } else if (isIntro) {
          // #introductions: @everyone and Society Member can write; Timed Out cannot write
          channelOverwrites.push({
            id: roleEveryone.id,
            type: OverwriteType.Role,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
          });
          channelOverwrites.push({
            id: roleSocietyMember.id,
            type: OverwriteType.Role,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
          });
          if (roleTimedOut) {
            channelOverwrites.push({
              id: roleTimedOut.id,
              type: OverwriteType.Role,
              deny: [PermissionFlagsBits.SendMessages]
            });
          }
        } else if (isGate) {
          // The rest of THE GATE channels: Read-only for everyone & Society Member
          const allowList = [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory];
          if (name.includes('announcements')) {
            allowList.push(PermissionFlagsBits.AddReactions);
          }
          channelOverwrites.push({
            id: roleEveryone.id,
            type: OverwriteType.Role,
            allow: allowList,
            deny: [PermissionFlagsBits.SendMessages]
          });
          channelOverwrites.push({
            id: roleSocietyMember.id,
            type: OverwriteType.Role,
            allow: allowList,
            deny: [PermissionFlagsBits.SendMessages]
          });
        } else if (isTaskBoard || isBroadcast) {
          // Read-only for Society Member, completely locked for @everyone
          channelOverwrites.push({
            id: roleEveryone.id,
            type: OverwriteType.Role,
            deny: [PermissionFlagsBits.ViewChannel]
          });
          channelOverwrites.push({
            id: roleSocietyMember.id,
            type: OverwriteType.Role,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AddReactions],
            deny: [PermissionFlagsBits.SendMessages]
          });
        } else if (isVoice) {
          channelOverwrites.push({
            id: roleEveryone.id,
            type: OverwriteType.Role,
            deny: [PermissionFlagsBits.ViewChannel]
          });
          channelOverwrites.push({
            id: roleSocietyMember.id,
            type: OverwriteType.Role,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak, PermissionFlagsBits.Stream]
          });
        } else {
          // Standard member channels (discussions, submissions, tools, armory, etc.)
          channelOverwrites.push({
            id: roleEveryone.id,
            type: OverwriteType.Role,
            deny: [PermissionFlagsBits.ViewChannel]
          });
          channelOverwrites.push({
            id: roleSocietyMember.id,
            type: OverwriteType.Role,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.AttachFiles,
              PermissionFlagsBits.EmbedLinks,
              PermissionFlagsBits.AddReactions
            ]
          });
        }

        try {
          await channel.permissionOverwrites.set(channelOverwrites, 'Zodiac: Align Least Privilege Structure');
          console.log(`  ✓ Channel Synced: #${channel.name}`);
        } catch (err) {
          console.error(`  ✗ Error on #${channel.name}:`, err.message);
        }

        await sleep(safeRateLimitDelay);
      }
    }

    console.log(`\n======================================================`);
    console.log(`🎉 ALL CATEGORIES & CHANNELS PERMISSIONS FULLY SYNCED!`);
    console.log(`======================================================\n`);

  } catch (err) {
    console.error('Fatal execution error:', err);
  } finally {
    client.destroy();
  }
});

client.login(process.env.DISCORD_TOKEN);
