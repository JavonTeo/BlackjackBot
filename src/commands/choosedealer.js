const fs = require('fs');
module.exports = {
    name: 'choosedealer',
    description: 'randomly chooses dealer from the playerList',
    execute(message)
    {
        try {
            let {gameApproval, playersList} = require('../bjWritestream.js');
        } catch (err) {
            console.log(err);
            message.channel.send('This command cannot be activated without launching a game ($startbj).');
        }
        if (!gameApproval) { return; }
        message.channel.send('Game is go.');
        const dealerIndex = Math.floor(Math.random() * playersList.length) //comes out with random index from list
        console.log(`dealerID = ${dealerID}`);
        dealerID = playersList[dealerIndex];
        fs.appendFileSync('../blackjackbot/src/bjWritestream.js', `\ndealerApproval = true;\ndealerID = ${dealerID}`);
        bot.users.fetch()
    }
}
