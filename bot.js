const fs = require('fs');
const Discord = require('discord.js');
const cron = require('node-cron');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

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
	let {hour} = getTimeInfo();
	console.log('BONG BONG BONG BONG')
	console.log(hour)

	if (voiceChannel.members.size >= 1) {
		try {
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
	let hour = parseInt(time.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: '2-digit' }));
	let minutes = parseInt(time.toLocaleTimeString("en-US", { timeZone: "America/New_York", minute: '2-digit' }));
	return {
		hour,
		minutes
	}
}

task.start();

client.login(token);