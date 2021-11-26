module.exports = {
    name: 'ping',
    description: 'replies pong',
    execute(message)
    {
        message.channel.send('pong');
    },
};