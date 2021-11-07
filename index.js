require('dotenv').config()
require('./utils/globals.js')
const Discord = require('discord.js');
const fs = require("fs");
global.bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES",  "GUILD_MEMBERS"] });
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'))
for (const file of commandFiles) {
    const props = require(`./commands/${file}`)
    console.log(`${file} loaded`)
    console.log(props.data.name)
    bot.commands.set(props.data.name, props)
}

xrequire('./handlers/eventHandler')(bot);

//Playing Message
bot.on("ready", async () => {
    //Log Bot's username and the amount of servers its in to console
    console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers!`);

    //Set the Presence of the bot user
    bot.user.setActivity("My Code", {type: "PLAYING"});
});

// Interaction Must Be On Index For Avoid Error

bot.on('interactionCreate', async interaction => { // Handle Slash Command
	if (!interaction.isCommand()) return;
	const command = bot.commands.get(interaction.commandName);
    let args;
    if(command.option.status == true)
        args = interaction.options.get(command.option.name).value
	if (!command) return;
	try {
		await command.execute(interaction, null, args != "" ? args : "", true);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
//Token needed in token.json
bot.login(process.env.TOKEN);

process.on('unhandledRejection', rejection => {
    /* eslint-disable no-console */
    console.warn('\n[unhandledRejection]');
    console.warn(rejection);
    console.warn('[/unhandledRejection]\n');
    /* eslint-enable no-console */
  });