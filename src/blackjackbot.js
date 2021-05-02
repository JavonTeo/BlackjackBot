let token = "ODIyMzQzOTIwMDU0NDM1ODcw.YFQ5dA.2ccHjmsER92uGuCwDNnh0Bo9pPk";
const Discord = require('discord.js');     //import the Client module of discord.js
const bot = new Discord.Client();
const fs = require('fs');
const fspromises = require('fs').promises;
const path = require('path');
// const EventEmitter = require('events');
// const emitter = new EventEmitter()
// emitter.setMaxListeners(50)

const PREFIX = '$';
// let game_approval = false;

bot.commandsarchive = new Discord.Collection();
// C:\Users\Acer user\Desktop\blackjackbot\src\commands
// src\commands
const commandFiles =  fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) //loading command files into commandsarchive
{
    const command = require(`./commands/${file}`);
    bot.commandsarchive.set(command.name, command);
};

fspromises.readdir(path.join(__dirname, 'events'))
.then(files => {
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let eventName = file.substring(0, file.indexOf(".js"));
        let eventModule = require(path.join(__dirname, 'events', eventName));
        console.log(`${eventName}.js was registered`);
        bot.on(eventName, eventModule.bind(null, bot));
    });
})
.catch(err => console.log(err));

bot.on('message', (message) => 
{
    // if (message.author.bot) {return;}
    if (!message.content.startsWith(PREFIX)) {return;}
    // checked that content contains PREFIX and is not by bot
    const [CMD_NAME, ...args] = message.content
    .trim()
    .substring(PREFIX.length)
    .split(/\s+/);

    const command = CMD_NAME.toLowerCase();
    if (!bot.commandsarchive.has(command)) 
    {
        message.channel.send("I dont have that command.");
        return;
    };
    try {
        bot.commandsarchive.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send("There was an issue executing that command.");
    }
});


bot.login(token);