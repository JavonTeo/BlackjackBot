// const path = require("path");
const Discord = require("discord.js");
const fs = require('fs');
// const { resolve } = require("path");

module.exports = {
  name: "placebets",
  description: "collect bet amount from each player",
  execute(message) {
    try {
      var file = require('/Users/Acer user/Desktop/blackjackbot/bjInfo.json');
    } catch (error) {
      console.log(error);
      message.channel.send('This command cannot be activated without launching a game(!startbj).');
      return;
    }
    if (!file.dealerApproval) {
      message.channel.send('Choose a dealer first(!choosedealer)!');
      return;
    }
    let playerInfo = file.playerInfo;
    let playerInfoArr = Object.getOwnPropertyNames(playerInfo);
    var playerName = "";
    function moneyFilter(MSG) {
      const [dollarSign, ...args] = MSG.content
        .trim()
        .substring(0);
      
      const amount = args.join('')
      console.log(amount);
      if (dollarSign == "$" && !isNaN(((amount)))) {
        return true;
      } else {
        return false;
      }
    }
    const filter = (m) =>
    {
      if (m.author.bot) {return false;}
      if (!playerInfoArr.includes(m.author.username)) {return false;}
      if (moneyFilter(m)) 
      {
        if (m.author.id == file.dealer.dealerID) {return false;}
        else {return true;}
      }
      else if (m.content === "#stop")  {return true;}
      else  {return false;}
    }
    const collector = new Discord.MessageCollector(message.channel, filter);
    message.channel.send(
      "Bot is collecting bet amounts now, to stop please type #stop.\nInclude '$' before your bet amount. Take note the bot will only take in the first value you send!"
    );
    collector.on("collect", (m) => 
    {
      console.log("message collected: " + m.content);
      if (m.content === "#stop") {
        collector.stop();
        playerName = m.author.username;
      }
    });
    collector.on("end", async (collectedItem) => 
    {
      // console.log(collectedItem);
      function isDone() {
        if (playerName != null) {
          return new Promise((resolve => {resolve('resolved')}))}}
      await isDone();
      const userBetAmount = {};
      for (let i = 0; i < collectedItem.size - 1; i++) 
      {
        let rawMsg = collectedItem.array()[i].content;
        let amount;
        if (rawMsg[0] == '$') {
          amount = rawMsg.substring(1);}
        console.log(`${collectedItem.array()[i].author.username} bet is ${amount}`);
        if (userBetAmount[collectedItem.array()[i].author.username]) 
        {
          continue;
          //if there is already an entry for the particular player, it will not add to the userBetAmount
          //prevents recording of repeated entries
        }
        userBetAmount[collectedItem.array()[i].author.username] = amount;
      }
      console.log(userBetAmount);             //{ Dualbricks: '56', LuX: '5' }
      let embed = new Discord.MessageEmbed();
      embed
      .setColor('#FFFF00')
      .setTitle(`Bet collection has stopped by ${playerName}.`);
      for (const property in userBetAmount) 
      {
        embed.addField(`${property} bet`, `$${userBetAmount[property]}`);
      }
      message.channel.send(embed);
      WnL = {};
      const userBetAmountArr = Object.entries(userBetAmount);
      for (let j = 0; j < userBetAmountArr.length; j++) {
        WnL[`${userBetAmountArr[j][0]}`] = 0;
      }
      WnL[`${file.dealer.dealerName}`] = 0;
      file.WnL = WnL;
      file.bets = userBetAmount;
      file.betApproval = true;
      fs.writeFileSync('/Users/Acer user/Desktop/blackjackbot/bjInfo.json', JSON.stringify(file));
    });
  }
}
//WnL starts in placebets
