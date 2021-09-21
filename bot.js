require('dotenv').config();


const XMLHttpRequest = require('xhr2');

const { Client, Intents } = require('discord.js');

const botIntents = new Intents();
botIntents.add(Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS)

const client = new Client({intents: botIntents});

client.on('ready', () => {
    console.log(`${client.user.username} has logged in`);
});

client.on('messageCreate', (message) => {
    //need to check if the author is a bot
    if (message.author.bot)
    {
        return;
    }
    else
    {
        console.log(`[${message.author.tag}]: ${message.content}`);
        message.channel.send("Hello there");

        const Http = new XMLHttpRequest();
        const url = `https://api.fabdb.net/cards/browse?keywords=${message.content}`;

        Http.open("GET", url);
        Http.send();

        Http.onreadystatechange = (e) => {
            console.log(Http.responseText);
        }
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
