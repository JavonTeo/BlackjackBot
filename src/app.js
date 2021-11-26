const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const fspromises = require('fs').promises;
const path = require('path');

require('dotenv').config();

const PREFIX = '!';

client.login(process.env.bjbot_Token);
client.commandsarchive = new Discord.Collection();
client.messagesarchive = new Discord.Collection();

const commandFiles =  fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) //loading command files into commandsarchive
{
    const command = require(`./commands/${file}`);
    client.commandsarchive.set(command.name, command);
};

const messageFiles = fs.readdirSync('./src/messages').filter(file => file.endsWith('.js'));
for (const file of messageFiles)
{
    const msg = require(`./messages/${file}`);
    client.messagesarchive.set(msg.name, msg);
};

fspromises.readdir(path.join(__dirname, 'events'))      //__dirname = src
.then(files => {
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let eventName = file.substring(0, file.indexOf(".js"));     //individual filename w/o .js
        let eventModule = require(path.join(__dirname, 'events', eventName));   //require('src/events/ready')
        console.log(`${eventName}.js was registered`);
        client.on(eventName, eventModule.bind(null, client));   //client.on('ready', eventModule.bind(null, client))
        //bind sets the parameters and the this object to the function
    });
})
.catch(err => console.log(err));

client.on('message', (message) => 
{
    // if (message.author.client) {return;}
    // if (message.author.bot) {return;}
    if (message.content.startsWith(PREFIX)) {
        const [CMDName, ...args] = message.content
        .trim()
        .substring(PREFIX.length)       //gets rid of '!'
        .split(/\s+/);                  //'!I am javon' splits into CMDName = 'I', args = ['am', 'javon']
        
        const command = CMDName.toLowerCase();
        if (!client.commandsarchive.has(command)) 
        {
            // message.channel.send("I dont have that command.");
            return;
        };
        try {
            client.commandsarchive.get(command).execute(message, args);
        } catch (error) {
            console.error(error);
        }
    }
    else
    {
        const [msgName, ...args] = message.content
        .trim()
        .split(/\s+/);      //msgName = 'fap' args = ['to', 'Javon']

        const msg = msgName.toLowerCase();
        if (!client.messagesarchive.has(msg)) {return;};
        try {
            client.messagesarchive.get(msg).execute(message, args)
        } catch (error) {
            console.error(error);
        }
    }
});