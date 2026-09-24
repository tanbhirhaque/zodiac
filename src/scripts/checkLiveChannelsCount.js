require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('clientReady', async () => {
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    await guild.channels.fetch();
    await guild.roles.fetch();
    console.log(`Guild: ${guild.name} (${guild.channels.cache.size} total channels/categories)`);

    const cats = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory);
    console.log(`Categories count: ${cats.size}`);
    
    for (const [id, cat] of cats.sort((a,b) => a.position - b.position)) {
      const childCount = guild.channels.cache.filter(c => c.parentId === cat.id).size;
      console.log(`- ${cat.name} (${childCount} channels)`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    client.destroy();
  }
});

client.login(process.env.DISCORD_TOKEN);
