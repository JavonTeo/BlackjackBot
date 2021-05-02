const { MessageCollector } = require('discord.js');
const { choosedealerarr } = require('./choosedealer.js');
module.exports = {
    name: 'placebets',
    description: 'take the bet amount from each player',
    execute(message)
    {
        let betApproval = false;
        const [dealerApproval, dealer_user] = choosedealerarr;
        if (dealerApproval = false) {
            message.channel.send('This command cannot be activated without choosing dealer ($choosedealer).');
            return;
        }
        message.channel.send("All players, place your bets.");
        const betList = [];
        const filter = (m) => !isNaN(parseFloat(m.content));
        const bet_collector = new MessageCollector(message.channel, filter)
        bet_collector.on('collect', (m) =>
        {
            betList.push(`${m.author.username} : ${m.content}`);   //displays username:betamount
            message.send(`${m.author.username} placed bet of ${m.content}.`);
        });
        bet_collector.on('end', () => 
        {
            if (betList.length == players_list.length)
            {
                message.channel.send("All bets received, good to go");
                betApproval = true;
            }
            else {
                message.channel.send("Something went wrong with the bets. Please try $placebet again.");
            }
        });
        const placebetarr = [betApproval, betList, dealer_user];
        return placebetarr;
    }
}