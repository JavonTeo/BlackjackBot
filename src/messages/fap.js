const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name:'fap',
    execute(message, args)
    {
        const embed = new Discord.MessageEmbed()
        .setColor("#FFFDD0")
        .setTitle('OH YEAAAAAAAAAAAAA')
        .setDescription('yehB0000i');

        const imageFiles = fs.readdirSync('./src/fapimages').filter(file => file.endsWith('.jpg'));
        // console.log(imageFiles);
        let i = 0;
        for (const file of imageFiles)
        {
            if (args[1] == file.split('.jpg')[0])
            {
                embed.attachFiles(`./src/fapimages/${args[1]}.jpg`);
                message.channel.send(embed);
            }
            else if (i === imageFiles.length - 1) {
                message.channel.send(`${args[1]} leaks on the way...`)
            }
            else
            {
                i++;
            }
        }
    }
};
