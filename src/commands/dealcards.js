const { placebetarr } = require('./placebets.js');
const { startbjarr } = require('./startbj.js');
module.exports = {
    name : "dealcards",
    description : "Deals card to all players. Only dealer can activate this command.",
    execute(message)
    {
        const [betApproval, betList, dealer_user] = placebetarr;
        const [game_approval, players_list] = startbjarr;
        if (betApproval == false) {
            message.channel.send('This command cannot be activated without placing bets ($placebet).');
            return;
        }
        if (message.author == dealer_user) {
            message.channel.send('This command can only be activated by the dealer.');
            return;
        }
        const card_values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
        const card_suits = ['Club', 'Dimes', 'Heart', 'Spades']
        for (let i = 0; i < players_list.length; i++)
        {
            player_id = players_list[i];
            card1_valueindex = Math.floor(Math.random() * card_values.length);
            card1_suitsindex = Math.floor(Math.random() * card_suits.length);
            player_id.send(`1st card: ${card_values[card1_valueindex]} of ${card_suits[card1_suitsindex]}`);
            card2_valueindex = Math.floor(Math.random() * card_values.length);
            card2_suitsindex = Math.floor(Math.random() * card_suits.length);
            player_id.send(`2nd card: ${card_values[card2_valueindex]} of ${card_suits[card2_suitsindex]}`);
        }
        message.channel.send("All card dealts. Initiating hit/stand phase.");    
    }
}