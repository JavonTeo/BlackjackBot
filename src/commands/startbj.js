const { MessageCollector } = require('discord.js');
const fs = require('fs');
let { playersList, gameApproval } = require('../variables.js');
module.exports = {
    name: "startbj",
    description: "kicks off the blackjack game",
    execute(message)
    {
        message.channel.send("Collecting players...reply with 'joinbj' in 10 seconds");
        const filter = (m) => m.content.toLowerCase() === "joinbj";
        const players_collector = new MessageCollector(message.channel, filter, {time: 10000});
        players_collector.on('collect', (m) => 
        {
            playersList.push(m.author);
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
        players_collector.on('end', () => 
        {
            launch_ornot = new Promise((resolve, reject) => 
            {
                if (playersList.length > 1)     //collected.size OR playersList.length
                {
                    resolve(message.channel.send(`${playersList.length} players received: ${playersList}. Reply '$choosedealer' for me to assign dealer (random).`));
                    gameApproval = true;
                    let file = fs.createWriteStream('../blackjackbot/src/bjWritestream.js');
                    file.write('playersList = [');
                    playersList.forEach((sessPlayer) => {
                        file.write(sessPlayer + ', ');
                    })
                    file.write('];\n');
                    file.write('gameApproval = true;');
                    file.end();
                }
                else
                {
                    reject(message.channel.send(`Blackjack not launched due to insufficient players. Only ${playersList.length}, ${playersList.username} player joined.`));
                    gameApproval = false;
                }
            })
            launch_ornot
            .then((result) => {result;})
            .catch((result) => {result;});
        });
        // const startbjarr =  [gameApproval, playersList];
        // return gameApproval;
    },
}