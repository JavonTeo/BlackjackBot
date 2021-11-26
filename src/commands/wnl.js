const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();
client.login(process.env.bjbot_Token);

module.exports = {
    name: "wnl",
    description: "final command displaying the winning and losses of each player",
    execute(message) {
        try {
            var file = require('/Users/Acer user/Desktop/blackjackbot/bjInfo.json');
        } catch (error) {
            console.error(error);
            message.channel.send('This command cannot be activated without launching a game(!startbj).');
            return;
        }
        if (!file.playerInfo[`${file.dealer.dealerName}`].specialcombo) {
            if (!file.opened) {
                message.channel.send('Dealer must open at least one player before this command can be activated (!open).')
                return;
            }
        }

        //"cardssum":{"IDIOTYT": 15, "LuX": 13}
        // let cardssum = file.cardssum;
        // let cardvalue = file.cardvalue;
        let dealer = file.dealer;
        let WnL = file.WnL;
        // let playerInfo = file.playerInfo;
        // let bets = file.bets;
        // let playernameArr = Object.getOwnPropertyNames(playerInfo);


        // let dealercardssum = cardssum[`${dealer.dealerName}`];
        // let dealerdeck = cardvalue[`${dealer.dealerName}`];
        // for (let i = 0; i < playernameArr.length; i++) {
        //     if (dealergotBLBB)
        //     {
        //         break;
        //     }
        //     let player = playernameArr[i];
        //     if (player == dealer.dealerName)
        //     {
        //         continue;
        //     }
        //     let playercardssum = cardssum[`${player}`];
        //     let playerdeckvalue = cardvalue[`${player}`];
        //     if (playercardssum == 21 && playerdeckvalue.length == 2) {
        //         continue;
        //     }
        //     else if (playercardssum == 21 && playerdeckvalue == ["7", "7", "7"]) {
        //         continue;
        //     }
        //     else if (playercardssum <= 21 && playerdeckvalue.length == 5) {
        //         continue;
        //     }
        //     else if (dealercardssum == 21 && dealerdeck == ["7", "7", "7"]) {
        //         continue;
        //     }
        //     else if (dealercardssum <= 21 && dealerdeck.length == 5) {
        //         continue;
        //     }

        //     if (dealercardssum == 21) {
        //         if (playercardssum == 21)
        //         {
        //             continue;
        //         }
        //         else
        //         {
        //             WnL[`${player}`] -= 1 * parseInt(bets[`${player}`]);
        //             continue;
        //         }
        //     }

        // }
        let WnLValArr = Object.values(WnL);
        console.log(WnLValArr);
        let dealerWinnings = 0 - WnLValArr.reduce((accumulator, addition) => accumulator + addition);
        WnL[`${dealer.dealerName}`] = dealerWinnings;
        let embed = new Discord.MessageEmbed();
        embed
        .setColor("#FF69B4")
        .setTitle("Winnings/Losses for all players");
        let string = '';
        let WnLEntries = Object.entries(WnL)
        for (let i = 0; i < WnLEntries.length; i++) {
            let playerName = WnLEntries[i][0];
            let playerWnL = WnLEntries[i][1];
            string = string.concat(`${playerName} : ${playerWnL}\n`);
        }
        embed.setDescription(string);
        message.channel.send(embed);
    }
}