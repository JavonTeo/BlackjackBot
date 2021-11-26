const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name:'zao',
    description: 'abandon game live to bet another day',
    async execute (message)
    {
        try {
            var file = require('/Users/Acer user/Desktop/blackjackbot/bjInfo.json');
        } catch (error) {
            console.log(`Error due to !${message} command`);
            message.channel.send('This command cannot be activated without launching a game(!startbj).');
            return;
        }
        if (!file.cardsgiven) {
            message.channel.send('Cards have not been distributed yet(!drawcards).');
            return;
        }
        const author = message.author.username;
        const authorcardsvalueArr = file.cardvalue[author];
        let playerInfo = file.playerInfo;
        if (authorcardsvalueArr.length > 2) {
            message.channel.send(`${author}, you cannot zao as you have already hit!`);
            return;
        }
        if (file.hsCmplt) {
            let playersList = Object.getOwnPropertyNames(playerInfo);
            let isAuthoringame = false;
            for (let index = 0; index < playersList.length; index++) {
                if (playersList[index] == author) {
                    isAuthoringame = true;
                }
                else {continue;}
            }
            if (isAuthoringame) {
                message.channel.send(`${author}, you cannot zao as you have already stood.`);
                return;
            }
            else
            {
                message.channel.send(`${author}, you are not participating in this blackjack game.`);
                return;
            }
        }
        let totalvalue = 0;
        authorcardsvalueArr.forEach(value => {
            if (value == ('KING' || 'QUEEN' || 'JACK'))
            {
                totalvalue += 10;
            }
            else if (value == 'ACE')
            {
                if (authorcardsvalueArr.includes('4')) {
                    totalvalue += 11;
                }
                else if (authorcardsvalueArr.includes('5')) {
                    totalvalue += 10;
                }
            }
            else
            {
                let num = parseInt(value);
                totalvalue += num;
            }
        });
        if (totalvalue != 15)
        {
            message.channel.send(`${author}, you cannot zao as your cards do not total 15!`);
            return;
        }
        let bets = file.bets
        const dealerzao = (AUTHusername) => {
            if (AUTHusername == file.dealer.dealerName) {
                //game ends automatically and all players collect back their own bet
                message.channel.send(`Dealer ${AUTHusername} has zao. Game ends automatically. Please !clearcache before starting new game.`);
                let nameArr = Object.getOwnPropertyNames(bets);
                console.log(nameArr);      
                let embed = new Discord.MessageEmbed();
                embed
                .setColor('#FFFFFF')    //white
                .setTitle(`All bets will be returned.`);
                for (let i = 0; i < nameArr.length; i++)
                {
                    let playername = nameArr[i];
                    let playerbet = bets[`${playername}`];
                    embed.addField(playername, `$bet: ${playerbet}`);
                }
                message.channel.send(embed);
                return;
            }
        }
        dealerzao(author);
        let cardvalue = file.cardvalue;
        let cardcode = file.cardcode;
        const deletion = (AUTHusername) => {
            delete cardvalue[`${AUTHusername}`];
            delete cardcode[`${AUTHusername}`];
            delete playerInfo[`${AUTHusername}`];
            delete bets[`${AUTHusername}`];
            return file
        }
        let newfile = deletion(author);
        fs.writeFileSync('/Users/Acer user/Desktop/blackjackbot/bjInfo.json', JSON.stringify(newfile));
    }
}