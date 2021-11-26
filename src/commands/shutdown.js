module.exports = {
    name: "shutdown",
    description: "warns members that bot will shutdown",
    execute(message)
    {
        message.channel.send("I am going to shutdown soon. Goodbye everyone and see you again another day!!");
    }
};
