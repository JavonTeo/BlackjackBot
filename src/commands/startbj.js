const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();
require('dotenv').config();
client.login(process.env.bjbot_Token);

module.exports = {
    name: "startbj",
    description: "kicks off the blackjack game",
    execute(message)
    {
        let membersArr;
        try {
            membersArr = client.guilds.cache.get(process.env.SNAKESid).members.cache.toJSON()
        } catch (error) {
            message.channel.send("Bot not yet ready. Try again in a few seconds.")
            return;
        }
        let playersList = [];
        message.channel.send("Collecting players...reply with 'joinbj'. To stop please type #stop");
        const filter = (m) => m.content.toLowerCase() === "joinbj" || m.content.toLowerCase() === '#stop';
        const players_collector = new Discord.MessageCollector(message.channel, filter);
        var playerName = "";       //playername who #stop
        players_collector.on('collect', (m) => 
        {
            if (m.content === "#stop")
            {
                players_collector.stop()
                playerName = m.author.username;
                return;
            }
            playersList.push(m.author.id);
            if (playersList.length == 1)
            {
                message.channel.send(`FIRST PLAYER ${m.author.username} has joined blackjack game.`);
            }
            else
            {
                for (let i = 0; i < playersList.length; i++)
                {
                    if (i == playersList.length - 1)
                    {
                        message.channel.send(`${m.author.username} has joined blackjack game.`);
                    }
                    for (let q = 1; q < playersList.length; q++)
                    {
                        if (i == q) 
                        {
                            continue;
                        }
                        else if (playersList[q] === playersList[i])   //q is the incoming
                        {
                            playersList.splice(q, 1);
                            message.channel.send(`${m.author.username}, you have already joined!`);
                            break;
                        }
                        else
                        {
                            continue;
                        }
                    }
                };
            }
        });
        players_collector.on('end', async() => 
        {
            function isDone() {
                if (playerName != null)
                {
                    return new Promise((resolve => {resolve(console.log("resolved"))}))
                }
            }
            await isDone();
            message.channel.send("Players collection has stopped by " + playerName);
            launch_ornot = new Promise((resolve, reject) => 
            {
                if (playersList.length > 1)     //collected.size OR playersList.length
                {
                    console.log(playersList.length);
                    console.log(playersList);
                    let playerInfo = {};
                    let namesList = [];
                    for (let i = 0; i < playersList.length; i++) {
                        let inputID = playersList[i];
                        let playerinfoupdated = false;
                        for (let index = 0; index < membersArr.length; index++) {
                            if (inputID == membersArr[index].userID) {
                                playerInfo[membersArr[index].displayName] = {};
                                playerInfo[membersArr[index].displayName].name = membersArr[index].displayName;
                                playerInfo[membersArr[index].displayName].id = membersArr[index].userID;
                                playerinfoupdated = true;
                                namesList.push(membersArr[index].displayName);
                            }
                            else {continue;}
                        }
                        if (!playerinfoupdated) {
                            message.channel.send(`Player ID:${inputID} information cannot be found.`);
                        }
                    }
                    resolve(message.channel.send(`${namesList.length} players received: ${namesList}. Reply '!choosedealer' for me to assign dealer (random or specific player).`));
                    console.log(playerInfo);
                    let stringedplayerInfo = JSON.stringify(playerInfo);
                    let file = fs.createWriteStream('../blackjackbot/bjInfo.json');
                    file.write(`{\"playerInfo\":`)
                    file.write(stringedplayerInfo + ',');
                    file.write('\"gameApproval\" : true}');
                    file.end();
                }
                else
                {
                    reject(message.channel.send(`Blackjack not launched due to insufficient players. Only ${playersList.length} player joined.`));
                }
            })
            launch_ornot
            .then((result) => {result;})
            .catch((result) => {result;});
        });
    },
}