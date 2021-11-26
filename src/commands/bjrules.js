const Discord = require('discord.js');

module.exports = {
    name: 'bjrules',
    description: 'shows order of commands to play blackjack',
    execute(message)
    {
        let embed = new Discord.MessageEmbed()
        embed
        .setColor('#800020')    //burgundy
        .setTitle("PROCEDURE FOR A BLACKJACKGAME")
        .setDescription('startbj -> choosedealer -> placebets -> drawcards -> 21check -> hitstand -> open "player"')
        .addField("ADDITIONAL COMMANDS", "dealerhitstand - activated anytime after hitstand.\nzao - activate if your cards = 15\nwhoisdealer - reveals the dealer for the current game\nclearcache - clears all info for the current game\nbjrules - learn to play ban luck!")
        .addField("TAKE NOTE: VALUES OF ACE CHANGES WITH AMT OF CARDS ON HAND", "2 cards in hand - 10 OR 11\n3 cards in hand - 1 OR 10\n4 or more cards in hand - 1")
        message.channel.send(embed);
    }
};