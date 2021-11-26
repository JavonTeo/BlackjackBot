const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
require('dotenv').config();
client.login(process.env.bjbot_Token);

module.exports = {
    name: "21check",
    description: 'check if anyone has 21',
    execute(message) {
        try {
            var file = require('/Users/Acer user/Desktop/blackjackbot/bjInfo.json');
        } catch (error) {
            message.channel.send('This command cannot be activated without launching a game(!startbj).');
            return;
        }
        if (!file.cardsgiven) {
          message.channel.send('Unable to check as no one has any cards(!drawcards)');
          return;
        }
        let achieved21 = false;
        let playerInfo = file.playerInfo;
        let dealerName = file.dealer.dealerName;
        let dealerdeck = file.cardvalue[dealerName];
        let dealerdeckcode = file.cardcode[dealerName];
        let cardssum = {};
        for (let prop in playerInfo) {
            cardssum[`${prop.name}`] = 0;
        }
        if (dealerdeck[0] == 'ACE' && dealerdeck[1] == 'ACE')
        {
            message.channel.send(`Dealer ${dealerName} has BAN BAN!`);
            achieved21 = true;
            cardssum[`${dealerName}`] = 21;
            playerInfo[`${dealerName}`].opened = true;
            playerInfo[`${dealerName}`].specialcombo = true;
            for (let i = 0; i < dealerdeckcode.length; i++) {
                let card = dealerdeckcode[i];
                let cardImg = `https://deckofcardsapi.com/static/img/${card}.png`;
                let embed = new Discord.MessageEmbed();
                embed
                .setTitle(`${dealerName} card #${i+1}`)
                .setImage(cardImg);
                message.channel.send(embed);
            }
        }
        else if (dealerdeck.includes('ACE') && (dealerdeck.includes('10') || dealerdeck.includes('JACK') || dealerdeck.includes('QUEEN') || dealerdeck.includes('KING')))
        {
            message.channel.send(`Dealer ${dealerName} has BAN LUCK!`);
            achieved21 = true;
            cardssum[`${dealerName}`] = 21;
            playerInfo[`${dealerName}`].opened = true;
            playerInfo[`${dealerName}`].specialcombo = true;
            for (let i = 0; i < dealerdeckcode.length; i++) {
                let card = dealerdeckcode[i];
                let cardImg = `https://deckofcardsapi.com/static/img/${card}.png`;
                let embed = new Discord.MessageEmbed();
                embed
                .setTitle(`${dealerName} card #${i+1}`)
                .setImage(cardImg);
                message.channel.send(embed);
            }
        }
        let bets = file.bets;
        let WnL = file.WnL;
        console.log(WnL[`IDIOTYT`]);
        console.log(WnL);
        let cardsvaluearr = Object.entries(file.cardvalue);
        for (let i = 0; i < cardsvaluearr.length; i++) {
            let playerName = cardsvaluearr[i][0];    //string of name
            let playerdeck = cardsvaluearr[i][1];    //array of cards
            if (playerName == dealerName) {
                continue;
            }
            let playerhasBLBB = false;
            let betspropArr = Object.getOwnPropertyNames(bets);
            let playerBet = '';
            for (let index = 0; index < betspropArr.length; index++) {
                //fished out the playerbetamount
                if (playerName == betspropArr[index]) {
                    playerBet = bets[`${playerName}`];
                    break;
                }
            }
            if (playerdeck[0] == 'ACE' && playerdeck[1] == 'ACE')
            {
                message.channel.send(`${playerName} has BAN BAN!`);
            }
            else if (playerdeck.includes('ACE') && (playerdeck.includes('10') || playerdeck.includes('JACK') || playerdeck.includes('QUEEN') || playerdeck.includes('KING')))
            {
                message.channel.send(`${playerName} has BAN LUCK!`);
            }

            if (dealerdeck[0] == 'ACE' && dealerdeck[1] == 'ACE')
            {
                // ban ban
                if (playerdeck[0] == 'ACE' && playerdeck[1] == 'ACE')
                {
                    playerhasBLBB = true;
                }
                else if (playerdeck.includes('ACE') && (playerdeck.includes('10') || playerdeck.includes('JACK') || playerdeck.includes('QUEEN') || playerdeck.includes('KING')))
                {
                    WnL[`${playerName}`] += -parseInt(playerBet);
                    playerhasBLBB = true;
                }
                else
                {
                    WnL[`${playerName}`] += -3 * parseInt(playerBet);
                }
            }
            else if (dealerdeck.includes('ACE') && (dealerdeck.includes('10') || dealerdeck.includes('JACK') || dealerdeck.includes('QUEEN') || dealerdeck.includes('KING')))
            {
                if (playerdeck[0] == 'ACE' && playerdeck[1] == 'ACE')
                {
                    WnL[`${playerName}`] += parseInt(playerBet);
                    playerhasBLBB = true;
                }
                else if (playerdeck.includes('ACE') && (playerdeck.includes('10') || playerdeck.includes('JACK') || playerdeck.includes('QUEEN') || playerdeck.includes('KING')))
                {
                    playerhasBLBB = true;
                }
                else
                {
                    WnL[`${playerName}`] += -2 * parseInt(playerBet);
                    console.log(WnL[`${playerName}`]);
                }
            }
            else
            {
                if (playerdeck[0] == 'ACE' && playerdeck[1] == 'ACE')
                {
                    WnL[`${playerName}`] += 3 * parseInt(playerBet);
                    achieved21 = true;
                    playerhasBLBB = true;
                }
                else if (playerdeck.includes('ACE') && (playerdeck.includes('10') || playerdeck.includes('JACK') || playerdeck.includes('QUEEN') || playerdeck.includes('KING')))
                {
                    WnL[`${playerName}`] += 2 * parseInt(playerBet);
                    achieved21 = true;
                    playerhasBLBB = true;
                }
            }

            if (playerhasBLBB) {
                cardssum[`${playerName}`] = 21;
                playerInfo[`${playerName}`].opened = true;
                playerInfo[`${playerName}`].specialcombo = true;
                let playerdeckcode = file.cardcode[playerName];
                for (let i = 0; i < playerdeckcode.length; i++) {
                    let card = playerdeckcode[i];
                    let cardImg = `https://deckofcardsapi.com/static/img/${card}.png`;
                    let embed = new Discord.MessageEmbed();
                    embed
                    .setTitle(`${playerName} card #${i+1}`)
                    .setImage(cardImg);
                    message.channel.send(embed);
                }
            }
            file.WnL = WnL;
            file.cardssum = cardssum;
            fs.writeFileSync('/Users/Acer user/Desktop/blackjackbot/bjInfo.json', JSON.stringify(file));
        }
        if (!achieved21) {
            message.channel.send("No one has achieved 21 yet!");
            return;
        }
    }
}