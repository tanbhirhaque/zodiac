require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', async () => {
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    console.log(`Connected to Guild: ${guild.name} (${guild.id})`);
    
    const categories = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory);
    console.log(`Found ${categories.size} categories.\n`);
    
    const societyRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'society member');
    console.log(`Society Member Role: ${societyRole ? societyRole.id : 'NOT FOUND'}`);

    for (const [id, cat] of categories.sort((a,b) => a.position - b.position)) {
      const everyoneOverwrite = cat.permissionOverwrites.cache.get(guild.roles.everyone.id);
      const societyOverwrite = societyRole ? cat.permissionOverwrites.cache.get(societyRole.id) : null;
      
      const everyoneCanView = everyoneOverwrite ? !everyoneOverwrite.deny.has(PermissionFlagsBits.ViewChannel) : true;
      const societyCanView = societyOverwrite 
        ? (societyOverwrite.allow.has(PermissionFlagsBits.ViewChannel) ? 'ALLOW' : (societyOverwrite.deny.has(PermissionFlagsBits.ViewChannel) ? 'DENY' : 'NEUTRAL'))
        : 'INHERIT';
      
      console.log(`[${cat.position}] "${cat.name}" | @everyone View: ${everyoneCanView ? 'YES' : 'NO (LOCKED)'} | Society Member: ${societyCanView}`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.destroy();
  }
});

client.login(process.env.DISCORD_TOKEN);
