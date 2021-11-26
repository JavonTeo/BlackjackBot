module.exports = {
    name: "whoisdealer",
    description: "states who is dealer",
    execute(message)
    {
        try {
            var file = require('/Users/Acer user/Desktop/blackjackbot/bjInfo.json');
          } catch (error) {
            console.log(error);
            message.channel.send('This command cannot be activated without launching a game(!startbj).');
            return;
          }
        if (!file.dealerApproval)
        {
            message.channel.send("dealer hasnt been chosen");
            return;
        }
        message.channel.send(`dealer is ${file.dealerName}`);
    }
}