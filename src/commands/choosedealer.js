const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();
client.login(process.env.bjbot_Token);

module.exports = {
    name: 'choosedealer',
    description: 'randomly chooses dealer from the playerList',
    execute(message, args)
    {
        try {
            var file = require('/Users/Acer user/Desktop/blackjackbot/bjInfo.json')
        } catch (err) {
            console.log(err);
            message.channel.send('This command cannot be activated without launching a game (!startbj).');
            return;
        }
        if (!file.gameApproval) {return;}
        if (args.length == 0) {
            let embed = new Discord.MessageEmbed();
            embed
            .setColor("#32CD32")
            .setTitle("ERROR IN CHOOSEDEALER COMMAND")
            .setDescription("Please indicate if you would like to have a randomly selected dealer, or a specific dealer. \n")
            .addField("random: ", "!choosedealer random")
            .addField("specific player: ", "!choosedealer 'playername'");
            message.channel.send(embed);
            return;
        }
        let argPassed = args[0];
        let dealerID;
        let dealerName;
        let playerInfo = file.playerInfo;
        let playerNamesArr = Object.getOwnPropertyNames(playerInfo);
        if (argPassed == 'random') {
            const randIndex = Math.floor(Math.random() * playerNamesArr.length) //comes out with random index from list
            dealerName = playerNamesArr[randIndex];
            for (let prop in playerInfo)
            {
                if (playerInfo[`${prop}`].name == dealerName) {
                    dealerID = playerInfo[`${prop}`].id;
                    break;
                }
                else {continue;}
            }
        }
        else {
            // argPassed = some player name
            for (let prop in playerInfo)
            {
                let propLC = prop.toLowerCase();
                if (propLC == argPassed.toLowerCase()) {
                    dealerID = playerInfo[`${prop}`].id;
                    dealerName = playerInfo[`${prop}`].name;
                    break;
                }
                else {continue;}
            }
            if (dealerID ==  undefined || dealerName ==  undefined) {
                message.channel.send("That player is not found.");
                return;
            }
        }
        file.dealer = {};
        file.dealer.dealerName = dealerName
        file.dealer.dealerID = dealerID;
        file.dealerApproval = true;
        for (prop in playerInfo) {
            playerInfo[`${prop}`].opened = false;
            playerInfo[`${prop}`].specialcombo = false;
        }
        fs.writeFileSync('C:/Users/Acer user/Desktop/blackjackbot/bjInfo.json', JSON.stringify(file));
        message.channel.send(`${dealerName}, you are the dealer for this game! You can place bets now (!placebets).`);
    }
}