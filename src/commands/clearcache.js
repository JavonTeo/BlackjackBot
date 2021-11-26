const fs = require('fs');
module.exports = {
    name: 'clearcache',
    description: 'clear bjInfo.json for a fresh game',
    execute(message)
    {
        path = 'C:/Users/Acer user/Desktop/blackjackbot/bjInfo.json'
        let fileExists = fs.existsSync(path);
        console.log(fileExists);
        if (!fileExists)
        {
            message.channel.send("Cache is already clear! (bjInfo.json does not exist)");
            return console.log('bjInfo.json does not exist.');
        }
        fs.unlinkSync(path);
        message.channel.send('Cache has been cleared! (bjInfo.json deleted)');
    }
};
