const fetch = require("node-fetch");
const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();
require('dotenv').config();
client.login(process.env.bjbot_Token);

module.exports = {
    name: "drawcards",
    description: "dealer deals cards",
    async execute(message)
    {
      //canvas: collage the 2 card images together
        //{ Dualbricks: '$56', LumembersArr: '$5' }
        try {
            var file = require('/Users/Acer user/Desktop/blackjackbot/bjInfo.json');
          } catch (error) {
            console.log(error);
            message.channel.send('This command cannot be activated without launching a game(!startbj).');
            return;
          }
        if (!file.betApproval) {
          message.channel.send('Place bets first(!placebets)');
          return;
        }
        let membersArr;
        try {
          membersArr = client.guilds.cache.get(process.env.SNAKESid).members.cache.toJSON()
        } catch (error) {
          message.channel.send("Bot not yet ready. Try again in a few seconds.")
          return;
        }
        
        let playerInfo = file.playerInfo;
        let pList = [];
        for (let prop in playerInfo) {
          let playerId = playerInfo[`${prop}`].id;
          pList.push(playerId);
        }
        const botcheckPromise = (user) => { 
        return new Promise(async(resolve) => {
          const res = await client.users.fetch(user.userID);
          const botdata = !res.bot;
          resolve(botdata);
          })
        }
        async function asyncFilter(array, promise) {
          const result = await Promise.all(array.map(promise))
          return array.filter((_v, index) => result[index])
        }
        const filterUser = asyncFilter(membersArr, async(elem) => {
          let botornot = await botcheckPromise(elem);
          return botornot;
        });

        async function newdeck() {
          const deck = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/');
          const data = await deck.json();
          let deckID = data.deck_id;
          return deckID;
        }

        async function draw2(DECKid, playerID) {
          const twocards = await fetch(`https://deckofcardsapi.com/api/deck/${DECKid}/draw/?count=2`);
          let data;
          try {
            data = await twocards.json()
          } catch (error) {
            message.channel.send(`${playerID} experienced ERROR`);
            console.log(error);
            return;
          }
          const drawnCards = {
            first : {
              img : data.cards[0].image, 
              value : data.cards[0].value,
              code : data.cards[0].code},
            second : {
              img : data.cards[1].image, 
              value : data.cards[1].value,
              code : data.cards[1].code}
          }
          return drawnCards;
        }
        
        async function main() {
          file.cardvalue = {};
          file.cardcode = {};
          let deckID = await newdeck();
          filterUser.then((response) => {
            for (let i = 0; i < pList.length; i++) 
            {
              var playerid = pList[i];
              for (let index = 0; index < response.length; index++)
              {
                let person = response[index];
                if (person.userID != playerid) {continue;}
                // console.log(`${person.displayName} : ${deckID}`);
                draw2(deckID, person.userID)
                .then((response) => {
                  const embed1 = new Discord.MessageEmbed;
                  const embed2 = new Discord.MessageEmbed;
                  embed1
                  .setTitle("HERE ARE YOUR CARDS")
                  .setImage(response.first.img);
                  embed2
                  .setImage(response.second.img);
                  client.users.cache.get(person.userID).send(embed1).catch((err) => {console.log(`${person.displayName} issa bot`);});
                  client.users.cache.get(person.userID).send(embed2).catch((err) => {console.log(`${person.displayName} issa bot`);});
                  file.cardvalue[person.displayName] = [response.first.value, response.second.value];
                  file.cardcode[person.displayName] = [response.first.code, response.second.code];
                  file.cardsgiven = true;
                  file.deckID = deckID;
                  return file;
                })
                .then((updatedfile) => {
                  fs.writeFileSync('C:/Users/Acer user/Desktop/blackjackbot/bjInfo.json', JSON.stringify(updatedfile));})
                .catch(err => console.log(err))
              }
            }
          })
          .catch((err) => {console.log(err);})
        }
        await main();
        message.channel.send("Please call command: !21check to check for ban luck, ban ban.");
      }
}