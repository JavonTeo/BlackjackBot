const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require("node-fetch");
const fs = require('fs');

require('dotenv').config();
client.login(process.env.bjbot_Token);

module.exports = {
    name:"dealerhitstand",
    description:"hit/stand for dealer, activated anytime after hitstand for other non-dealers",
    async execute(message)
    {
        try {
            var file = require('/Users/Acer user/Desktop/blackjackbot/bjInfo.json');
        } catch (error) {
            console.error(error);
            message.channel.send('This command cannot be activated without launching a game(!startbj).');
            return;
        }
        if (!file.deckID) {
            message.channel.send('Draw cards first(!drawcards)!');
            return;
          }
        if (file.playerInfo[`${file.dealer.dealerName}`].specialcombo) {
            message.channel.send('Dealer already has ban luck/ban ban!');
            return;
        }
        if (!file.hsCmplt) {
            message.channel.send('Dealer cannot hit/stand before other players (!hitstand).');
            return;
        }
        if (message.author.id != file.dealer.dealerID) {
            message.channel.send("Only dealer can activate this command.");
            return;
        }
        const deckID = file.deckID;
        const dealerID = file.dealer.dealerID;
        const dealerName = file.dealer.dealerName;
        let dealerdeckvalue = file.cardvalue[dealerName];
        let dealerdeckcode = file.cardcode[dealerName];
        let WnL = file.WnL;
        let bets = file.bets;
        let playerInfo = file.playerInfo;

        async function draw1(DECKid) {
            const card = await fetch(`https://deckofcardsapi.com/api/deck/${DECKid}/draw/?count=1`);
            const data = await card.json();
            const drawnCard = {
                img : data.cards[0].image, 
                value : data.cards[0].value,
                code : data.cards[0].code}
            return drawnCard;
          }

        const filter = (MSG) => {
            if (MSG.author.id === dealerID)
            {
                if (MSG.content.toLowerCase() == "hit" || MSG.content.toLowerCase() ==  "stand")
                {
                    return true;
                }
                else    {return false;}
            }
            else    {return false;}
        }
        await message.channel.send(`Dealer ${dealerName}, hit or stand?`)
        // // PLACE AWAIT HERE
        let times_of_hit = 0;
        do {
            times_of_hit++;
            let collectedhitstand = await message.channel.awaitMessages(filter, {max:1})
            m = collectedhitstand.first();
            console.log(m.content);
            if (m.content == "hit")
            {
                const newCard = await draw1(deckID);
                const embed = new Discord.MessageEmbed();
                embed
                .setTitle(`HIT #${times_of_hit}`)
                .setImage(newCard.img);
                await client.users.cache.get(dealerID).send(embed);
                console.log(`HIT ${times_of_hit}`);
                dealerdeckvalue.push(newCard.value);
                dealerdeckcode.push(newCard.code);
                fs.writeFileSync('/Users/Acer user/Desktop/blackjackbot/bjInfo.json', JSON.stringify(file));                
            }
        } while (m.content != 'stand')
        await message.channel.send(`${dealerName} has stood.`);
        let playercardssum = 0;
        let numofAces = 0;
        for (let i = 0; i < dealerdeckvalue.length; i++) {
            let card = dealerdeckvalue[i];
            if (card == ('KING' || 'QUEEN' || 'JACK')) {
                playercardssum += 10;
            }
            else if (card == 'ACE')
            {
                numofAces += 1;
            }
            else    //number
            {
                playercardssum += parseInt(card);
            }
        }
        switch (dealerdeckvalue.length) {
            case 2:
                //example: "A", 2-9. highest score will be "A" == 11
                if (numofAces == 1) {
                    playercardssum += 11;
                }
                break;
            case 3:
                //example: "A", 12-20: "A" will be 1. if "A", 3-11: "A" will be 10
                if (numofAces == 1) {
                    if (playercardssum >= 12) {
                        playercardssum += 1;
                    }
                    else if (playercardssum <= 11) {
                        playercardssum += 10;
                    }
                }
                else if (numofAces == 2) {
                    playercardssum += (1+10);
                }
                break;
            case 4:
            case 5:
                //"A" is 1 no matter what
                playercardssum += (1*numofAces);
                break;
            default://numofAces==0
                break;
        }
        file.cardssum[`${dealerName}`] = playercardssum;
        await client.users.cache.get(dealerID).send(`Your total card value is ${playercardssum}.`);
        if (playercardssum > 21) {
            message.channel.send(`${dealerName} has bao...`);
            for (let index = 0; index < dealerdeckcode.length; index++) {
                let card = dealerdeckcode[index];
                let cardImg = `https://deckofcardsapi.com/static/img/${card}.png`;
                let embed = new Discord.MessageEmbed();
                embed
                .setTitle(`${dealerName} card #${index+1}`)
                .setImage(cardImg);
                message.channel.send(embed);
            }
            let playerInfoArr = Object.getOwnPropertyNames(playerInfo);
            for (let j = 0; j < playerInfoArr.length; j++) {
                const playerName = playerInfoArr[j];
                if (playerName == dealerName) {continue;}
                if (playerInfo[`${playerName}`].opened) {continue;}
                WnL[`${playerName}`] += parseInt(bets[`${playerName}`]);
            }
            file.dealer.bao = true;
        }
        else if (playercardssum == 21 && dealerdeckvalue == ["7", "7", "7"]) {
            //triple 7
            message.channel.send(`${dealerName} has 7-7-7!`);
            for (let index = 0; index < dealerdeckcode.length; index++) {
                let card = dealerdeckcode[index];
                let cardImg = `https://deckofcardsapi.com/static/img/${card}.png`;
                let embed = new Discord.MessageEmbed();
                embed
                .setTitle(`${dealerName} card #${index+1}`)
                .setImage(cardImg);
                message.channel.send(embed);
            }
            let playerInfoArr = Object.getOwnPropertyNames(playerInfo);
            for (let j = 0; j < playerInfoArr.length; j++) {
                const playerName = playerInfoArr[j];
                if (playerName == dealerName) {continue;}
                if (playerInfo[`${playerName}`].opened) {continue;}
                WnL[`${playerName}`] -= 7 * parseInt(bets[`${playerName}`]);
            }
            playerInfo[`${dealerName}`].specialcombo = true;
            //game straightaway ends
        }
        else if (playercardssum <= 21 && dealerdeckvalue.length == 5) {
            message.channel.send(`${dealerName} has 五龙!`);
            for (let index = 0; index < dealerdeckcode.length; index++) {
                let card = dealerdeckcode[index];
                let cardImg = `https://deckofcardsapi.com/static/img/${card}.png`;
                let embed = new Discord.MessageEmbed();
                embed
                .setTitle(`${dealerName} card #${index+1}`)
                .setImage(cardImg);
                message.channel.send(embed);
            }
            let playerInfoArr = Object.getOwnPropertyNames(playerInfo);
            for (let j = 0; j < playerInfoArr.length; j++) {
                const playerName = playerInfoArr[j];
                if (playerName == dealerName) {continue;}
                if (playerInfo[`${playerName}`].opened) {continue;}
                WnL[`${playerName}`] -= 2 * parseInt(bets[`${playerName}`]);
            }
            playerInfo[`${dealerName}`].specialcombo = true;
            //game straighaway ends
        }
        file.dealerhsCmplt = true;
        fs.writeFileSync('/Users/Acer user/Desktop/blackjackbot/bjInfo.json', JSON.stringify(file));
    }
}
