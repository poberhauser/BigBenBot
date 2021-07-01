const Discord = require('discord.js');

module.exports = {
    name: 'time',
    description: 'time',
    execute(message, args)
    {
        let time = new Date();
        let realboytime = time.toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: '2-digit', minute: '2-digit' });
        
        const messageEmbed = new Discord.MessageEmbed()
            .setColor('#FFD700')
            .setTitle(`BONG BONG BONG The time is now ${realboytime} ⏲️`)
            .setFooter('powered by retardation')
            message.channel.send(messageEmbed);
    }
}