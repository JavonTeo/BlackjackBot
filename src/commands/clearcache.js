const fs = require('fs');
module.exports = {
    name: 'clearcache',
    description: 'clear bjWritestream.js for a fresh game',
    execute(message)
    {
        path = 'src/bjWritestream.js'
        let fileExists = fs.existsSync(path);
        // console.log(pat);
        console.log(fileExists);
        if (!fileExists)
        {
            message.channel.send("Cache is already clear! (bjWritestream.js does not exist)");
            return console.log('bjWritestream.js does not exist.');
        }
        fs.unlinkSync(path);
        message.channel.send('Cache has been cleared! (bjWritestream.js deleted)');
    }
};
