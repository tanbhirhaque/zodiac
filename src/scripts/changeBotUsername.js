const { Client, GatewayIntentBits, Events } = require('discord.js');
const { config } = require('../config');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, async () => {
  console.log(`Current bot user: ${client.user.tag} (ID: ${client.user.id})`);

  const candidates = ['zodiac.bot', 'zodiac_bot', 'zodiac.society', 'zodiac.hq', 'zodiac.ai'];
  let usernameChanged = false;

  for (const name of candidates) {
    try {
      const updated = await client.user.setUsername(name);
      console.log(`✅ Successfully updated global Discord username to: "${updated.username}"`);
      usernameChanged = true;
      break;
    } catch (err) {
      console.log(`Candidate "${name}" failed: ${err.message}`);
    }
  }

  // Also ensure guild nickname is Zodiac
  try {
    const guild = await client.guilds.fetch(config.guildId);
    const me = await guild.members.fetchMe();
    await me.setNickname('Zodiac');
    console.log(`✅ Guild display nickname is: "${me.displayName}"`);
  } catch (err) {
    console.log(`Guild nickname error: ${err.message}`);
  }

  client.destroy();
  process.exit(0);
});

client.login(config.token).catch(err => {
  console.error('Login failed:', err.message);
  process.exit(1);
});
