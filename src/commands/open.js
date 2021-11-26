const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

require('dotenv').config();
client.login(process.env.bjbot_Token);

module.exports = {
    name: "open",
    description: "dealer command. reveals args' cards to main server.",
    async execute(message, args) {
        try {
            var file = require('/Users/Acer user/Desktop/blackjackbot/bjInfo.json');
        } catch (error) {
            console.error(error);
            message.channel.send('This command cannot be activated without launching a game(!startbj).');
            return;
        }
        if (file.playerInfo[`${file.dealer.dealerName}`].specialcombo) {
            message.channel.send('Dealer already has ban luck/ban ban/wu long/triple 7!');
            return;
        }
        if (!file.hsCmplt) {
            message.channel.send('hit/stand phase must be completed first! (!hitstand)');
            return;
          }
        if (message.author.id != file.dealer.dealerID) {
            message.channel.send("Only dealer can activate this command.");
            return;
        }
        if (args.length == 0) {
            message.channel.send("Please input who you would like to open. Format: !open 'playername'/!open all");
            return;
        }
        let cardcode = file.cardcode;
        // let cardvalue = file.cardvalue;
        let playerInfo = file.playerInfo;
        let cardssum = file.cardssum;
        let dealercardssum = cardssum[`${file.dealer.dealerName}`];
        let WnL = file.WnL;
        let bets = file.bets;
        let namepropOrigArr = Object.getOwnPropertyNames(playerInfo);
        let playersListLC = namepropOrigArr.map((prop) => {
            return prop.toLowerCase();
        });
        const openPlayer = args[0].toLowerCase();
        // if (openPlayer == 'all') {
        //     for (let i = 0; i < namepropOrigArr.length; i++) {
        //         let origName = namepropOrigArr[i];
        //         for (let index = 0; index < cardcode[origName].length; index++) {
        //             let card = cardcode[origName][index];
        //             let cardImg = `https://deckofcardsapi.com/static/img/${card}.png`;
        //             let embed = new Discord.MessageEmbed();
        //             embed
        //             .setTitle(`${origName} card #${index+1}`)
        //             .setImage(cardImg);
        //             message.channel.send(embed);
        //         }
        //     }
        //     for (prop in playerInfo) {
        //         playerInfo[`${prop}`].opened = true;
        //     }
        // }
        {
            if (!playersListLC.includes(openPlayer)) {
                message.channel.send(`${openPlayer} is not a participant of the game. Please try again.`)
                return;
            }

            for (let i = 0; i < playersListLC.length; i++) {
                let nameprop = playersListLC[i];
                if (nameprop != openPlayer) {
                    continue;
                }
                let origName = namepropOrigArr[i];
                for (let index = 0; index < cardcode[origName].length; index++) {
                    let card = cardcode[origName][index];
                    let cardImg = `https://deckofcardsapi.com/static/img/${card}.png`;
                    let embed = new Discord.MessageEmbed();
                    embed
                    .setTitle(`${origName} card #${index+1}`)
                    .setImage(cardImg);
                    message.channel.send(embed);
                }
                if (openPlayer == file.dealer.dealerName) {
                    file.opened = true;
                    fs.writeFileSync('/Users/Acer user/Desktop/blackjackbot/bjInfo.json', JSON.stringify(file));
                    continue;
                }
                playerInfo[`${origName}`].opened = true;
                let playercardssum = cardssum[`${origName}`];
                if (playerInfo[`${origName}`].specialcombo) {continue;}
                if (file.dealer.bao) {continue;}
                //none have 21
                if (playercardssum > 21)
                {
                    WnL[`${origName}`] -= parseInt(bets[`${origName}`]);
                }
                else if (dealercardssum > playercardssum && dealercardssum <= 21)
                {
                    WnL[`${origName}`] -= parseInt(bets[`${origName}`]);
                }
                else if (dealercardssum < playercardssum && playercardssum <= 21)
                {
                    WnL[`${origName}`] += parseInt(bets[`${origName}`]);
                }
                else
                {
                    continue;
                }
                file.opened = true;
                fs.writeFileSync('/Users/Acer user/Desktop/blackjackbot/bjInfo.json', JSON.stringify(file));
            }
        }
    }
}