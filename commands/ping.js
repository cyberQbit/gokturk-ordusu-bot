module.exports = {
    name: 'ping',
    description: 'Botun hızını ölçer',
    execute(message, args) {
        message.channel.send(`🏓 Pong! Gecikme: ${Date.now() - message.createdTimestamp}ms`);
    },
};