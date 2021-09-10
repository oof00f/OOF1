const fs = require('fs')
const fetch = require('node-fetch')
const querystring = require('querystring')
const Discord = require('discord.js')

const config = require("./config.json")
const { prefix, token } = require("./config.json")

const client = new Discord.Client()
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command);
}


const embedFiles = fs.readdirSync("./embeds").filter(file => file.endsWith('.js'))

for (const file of embedFiles) {
  const command = require(`./embeds/${file}`)
  client.commands.set(command.name, command);
}

const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}


process.on('unhandledRejection', error => {
  console.error('unhandledRejection:', error);
});


client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

const args = message.content.slice(prefix.length).trim().split(/ +/)
const command = args.shift().toLowerCase();

try {
  client.commands.get(command).execute(message, args);
} catch(error) {
  console.error(error);
  message.channel.send(error)
}
});

client.login(config.token)