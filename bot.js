 require('dotenv').config();
const Discord = require('discord.js');
const cron = require('node-cron');

const { TOKEN, VOICE_CHANNEL_ID, GUILD_ID, TEXT_CHANNEL_ID } = process.env;

const client = new Discord.Client();
client.commands = new Discord.Collection();

let guild, voiceChannel, textChannel; 


// When bot comes online check the guild and voice channel are valid
// if they are not found the program will exit
 client.on('ready', async () => {
	try {
		guild = await client.guilds.fetch(GUILD_ID);
		voiceChannel = guild.channels.cache.get(VOICE_CHANNEL_ID);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
	textChannel = guild.channels.cache.get(TEXT_CHANNEL_ID);
	console.log('Big Ben Ready...');
}); 

// use node-cron to create a job to run every hour
const task = cron.schedule('0 0 */1 * * *', async () => {
	let { hour, amPm, timezoneOffsetString } = getTimeInfo();
	console.log('BONG BONG BONG BONG')
	// if text channel was defined send message in chat
	if (textChannel) {
		const messageEmbed = new Discord.MessageEmbed()
			.setColor('#FFD700')
			.setTitle(`⏲️ The time is now ${hour}:00 ${amPm} GMT${timezoneOffsetString} ⏲️`)
			.setFooter('powered by retardation')
		textChannel.send(messageEmbed);
	}



	// check if VC defined in config is empty
	if (voiceChannel.members.size >= 1) {
		try {
			// connect to voice channel
			const connection = await voiceChannel.join();
			// counter for looping
			let count = 1;

			// immediately invoked function that loops to play the bell sound 
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

// function to get current time and return object containing
// hour and if it is am or pm
const getTimeInfo = () => {
	let time = new Date();
	let hour = time.getHours() >= 12 ? time.getHours() - 12 : time.getHours();
	let minutes = time.getMinutes();
	hour = hour === 0 ? 12 : hour;
	let amPm = time.getHours() >= 12 ? 'PM' : 'AM';
	// get gmt offset in minutes and convert to hours
	let gmtOffset = time.getTimezoneOffset() / 60
	// turn gmt offset into a string representing the timezone in its + or - gmt offset
	let timezoneOffsetString = `${gmtOffset > 0 ? '-' : '+'} ${Math.abs(gmtOffset)}`;
	console.log(timezoneOffsetString);

	return {
		hour,
		minutes,
		amPm,
		timezoneOffsetString
	}
}

function processCommand(receivedMessage)
{
	let fullCommand = receivedMessage.content.substr(1)
	let splitCommand = fullCommand.split(" ")
	let primaryCommand = splitCommand[0]
	let arguments = splitCommand.slice(1)

	console.log("Command received: " + primaryCommand)
	console.log("Arguments: " + arguments)

	if(primaryCommand == 'time')
		timeCommand()
}

function timeCommand()
{
	let { hour, minutes, amPm, timezoneOffsetString } = getTimeInfo()

	const messageEmbed = new Discord.MessageEmbed()
			.setColor('#FFD700')
			.setTitle(`BONG BONG BONG The time is now ${hour}:${minutes} ${amPm} GMT${timezoneOffsetString} ⏲️`)
			.setFooter('powered by retardation')
		textChannel.send(messageEmbed);
}

// start the cron job
task.start(); 

 client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }
    
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }
})


client.login('ODU4MDI0OTk3MjgwNTQ2ODE2.YNYIDA.Ak4T3XUCtnn-epVdLNecB6jBbJ0');