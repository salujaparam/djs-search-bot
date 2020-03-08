  
const { RichEmbed } = require("discord.js");

module.exports = {
    name: "hi",
    category: "greet",
    description: "Greets the user",
    run: (client, message, args) => {
        message.channel.send(`hey <@${message.author.id}>`);
    }
}