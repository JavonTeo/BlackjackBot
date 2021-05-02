const fs = require('fs');
let { gameApproval, playerList } = require('../bjWritestream.js');
module.exports = {
    name: 'choosedealer',
    description: 'randomly chooses dealer from the playerList',
    execute(message)
    {
        let dealerApproval = false;
        if (gameApproval == false)
        {
            message.channel.send('This command cannot be activated without launching a game ($startbj).');
            return;
        }
        else {
            message.channel.send('Game is go.');
        }
        // const dealer_index = Math.floor(Math.random() * playerList.length) //comes out with random index from list
        // dealer_user = playerList[dealer_index];
        // message.channel.send(`${dealer_user.username}, you are this game's dealer.`);
        // dealerApproval = true;
        // const choosedealerarr = [dealerApproval, dealer_user];
        // return choosedealerarr;
    }
}