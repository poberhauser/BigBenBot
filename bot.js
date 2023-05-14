const fs = require('fs');
const {Client, Collection, Events, GatewayIntentBits} = require('discord.js');
const cron = require('node-cron');
const { prefix, token, guild_id, voice_channel_id, text_channel_id } = require('./config.json');


const client = new Client({
	intents: [
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages
		]});
client.commands = new Collection();

let guild, voiceChannel, textChannel;

client.on('ready', async () => {
	try {
		console.log(voice_channel_id);
		console.log(guild_id);
		guild = await client.guilds.fetch(guild_id);
		voiceChannel = guild.channels.cache.get(voice_channel_id);
		console.log(voiceChannel.members.size);
	}
	catch (error) {
		console.log(error);
		process.exit(1);

	}
})

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});


const task = cron.schedule('0 0 */1 * * *', async () => {
	let { hour } = getTimeInfo();
	console.log('BONG BONG BONG BONG');
	console.log(hour);
	console.log(voiceChannel.members.size);

	if (voiceChannel.members.size >= 1) {
		try {
			console.log('Hello!')
			const connection = await voiceChannel.join();
			let count = 1;
			(function play() {
				connection.play('bigben.mp3')
					.on('finish', () => {
						count += 1;
						if (count <= hour) {
							play();
						} else {
							connection.disconnect();
						}
					})
			})();

		} catch (error) {
			console.log(error);
		}
	}
});

const getTimeInfo = () => {
	let time = new Date();
	let hour = parseInt(time.toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: '2-digit' }));
	let minutes = parseInt(time.toLocaleTimeString("en-US", { timeZone: "America/Chicago", minute: '2-digit' }));
	return {
		hour,
		minutes
	}
}

task.start();

client.login(token);
