const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require("node-fetch");
const fs = require('fs');

require('dotenv').config();
client.login(process.env.bjbot_Token);

module.exports = {
    name:"hitstand",
    description:"hit/stand phase",
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
        const deckID = file.deckID;
        const playerInfo = file.playerInfo;
        const dealer = file.dealer;
        let playersList = [];
        for (let prop in playerInfo)
        {
            let player_Id = playerInfo[`${prop}`].id;
            playersList.push(player_Id);
        }
        // const allCards = ["A"];
        async function draw1(DECKid) {
            const card = await fetch(`https://deckofcardsapi.com/api/deck/${DECKid}/draw/?count=1`);
            const data = await card.json();
            const drawnCard = {
                img : data.cards[0].image, 
                value : data.cards[0].value,
                code : data.cards[0].code}
            return drawnCard;
          }
        let cardssum = file.cardssum;
        let WnL = file.WnL;
        let bets = file.bets;
        for (let i = 0; i < playersList.length; i++) {
            let currentplayerid = playersList[i];
            if (currentplayerid == dealer.dealerID) {
                continue;
            }
            let currentplayername = '';
            Object.keys(playerInfo).forEach((indiPlayerinfo) => {
                if (playerInfo[indiPlayerinfo].id == currentplayerid)
                {
                    currentplayername = playerInfo[indiPlayerinfo].name;
                }
            })
            if (playerInfo[`${currentplayername}`].specialcombo) {
                continue;
            }
            let currentplayerdeckvalue = file.cardvalue[currentplayername];
            let currentplayerdeckcode = file.cardcode[currentplayername];
            const filter = (MSG) => {
                if (MSG.author.id === currentplayerid)
                {
                    if (MSG.content.toLowerCase() == "hit" || MSG.content.toLowerCase() ==  "stand")
                    {
                        return true;
                    }
                    else    {return false;}
                }
                else    {return false;}
            }
            await message.channel.send(`${currentplayername}, hit or stand?`)
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
                    await client.users.cache.get(currentplayerid).send(embed);
                    console.log(`HIT ${times_of_hit}`);
                    currentplayerdeckvalue.push(newCard.value);
                    currentplayerdeckcode.push(newCard.code);
                    fs.writeFileSync('/Users/Acer user/Desktop/blackjackbot/bjInfo.json', JSON.stringify(file));                
                }
            } while (m.content != 'stand')
            await message.channel.send(`${currentplayername} has stood.`);
            let playercardssum = 0;
            let numofAces = 0;
            for (let i = 0; i < currentplayerdeckvalue.length; i++) {
                let card = currentplayerdeckvalue[i];
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
            switch (currentplayerdeckvalue.length) {
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
            cardssum[`${currentplayername}`] = playercardssum;
            await client.users.cache.get(currentplayerid).send(`Your total card value is ${playercardssum}.`);
            if (playercardssum == 21 && currentplayerdeckvalue == ["7", "7", "7"]) {
                //triple 7
                message.channel.send(`${currentplayername} has 7-7-7!`);
                for (let index = 0; index < currentplayerdeckcode.length; index++) {
                    let card = currentplayerdeckcode[index];
                    let cardImg = `https://deckofcardsapi.com/static/img/${card}.png`;
                    let embed = new Discord.MessageEmbed();
                    embed
                    .setTitle(`${currentplayername} card #${index+1}`)
                    .setImage(cardImg);
                    message.channel.send(embed);
                }
                WnL[`${currentplayername}`] += 7 * parseInt(bets[`${currentplayername}`]);
                playerInfo[`${currentplayername}`].opened = true;
                playerInfo[`${currentplayername}`].specialcombo = true;
            }
            else if (playercardssum <= 21 && currentplayerdeckvalue.length == 5) {
                message.channel.send(`${currentplayername} has 五龙!`);
                for (let index = 0; index < currentplayerdeckcode.length; index++) {
                    let card = currentplayerdeckcode[index];
                    let cardImg = `https://deckofcardsapi.com/static/img/${card}.png`;
                    let embed = new Discord.MessageEmbed();
                    embed
                    .setTitle(`${currentplayername} card #${index+1}`)
                    .setImage(cardImg);
                    message.channel.send(embed);
                }
                WnL[`${currentplayername}`] += 2 * parseInt(bets[`${currentplayername}`]);
                playerInfo[`${currentplayername}`].opened = true;
                playerInfo[`${currentplayername}`].specialcombo = true;
            }
            file.hsCmplt = true;
            fs.writeFileSync('/Users/Acer user/Desktop/blackjackbot/bjInfo.json', JSON.stringify(file));
        }
    }
}
