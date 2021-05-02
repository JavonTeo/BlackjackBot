module.exports = (bot, message) =>
{
    if (!message.content.startsWith(PREFIX))
    {
        if (message.content.toLowerCase() == 'hello')
        {
            message.reply("onionhaseyo");
        }
        else {return;}
    };
    const [CMD_NAME, ...args] = message.content
    .trim()
    .substring(PREFIX.length)
    .split(/\s+/);
    if (CMD_NAME.toLowerCase() === "startbj")
    {
        message.channel.send("Collecting players...reply with '$join' in 10 seconds");
        const players_list = [];
        const filter = (m) => m.content.toLowerCase() === "$join";
        const players_collector = new MessageCollector(message.channel, filter, {time: 10000});
        players_collector.on('collect', (m) => 
        {
            players_list.push(m.author.username);
            if (players_list.length == 1)
            {
                message.channel.send(`FIRST PLAYER ${m.author.username} has joined blackjack game.`);
            }
            else
            {
                for (let i = 0; i < players_list.length; i++)
                {
                    for (let q = 1; q < players_list.length; q++)
                    {
                        if (players_list[q] === players_list[i])   //q is the incoming
                        {
                            players_list.splice(q, 1);
                            message.channel.send(`${m.author.username}, you have already joined!`);
                            break;
                        }
                        else
                        {
                            continue;
                        }
                    }

                };
                message.channel.send(`${m.author.username} has joined blackjack game.`);
            }
        });
        players_collector.on('end', async () => 
        {
            launch_ornot = new Promise((resolve, reject) => 
            {
                if (players_list.length > 1)     //collected.size OR players_list.length
                {
                    resolve(message.channel.send(`${players_list.length} players received: ${players_list}. Launching blackjack...`));
                }
                else
                {
                    reject(message.channel.send(`Blackjack not launched due to insufficient players. Only ${players_list.length} player joined.`));
                }
            })
            await launch_ornot;
        });
    }
    if (CMD_NAME.toLowerCase() === "commands")
    {
        //show channel all avail commands
        console.log("list of commands not complete");
    }
};