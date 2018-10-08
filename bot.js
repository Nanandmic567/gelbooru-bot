/**
 * REQUIRE
 * Node + Misc
 */

const path = require('path')

const signale = require('signale')

require('dotenv').config()

/**
 * REQUIRE
 * Discord related
 */

const Discord = require('discord.js')

const client = new Discord.Client()

/**
 * REQUIRE
 * Express
 */

const express = require('express')

const app = express()

const webPort = process.env.PORT || 80

/**
 * Commands
 * Functions
 */

const commands = require('./commands')

/**
 * LOGIN
 * Bot
 */

client.login(process.env.DISCORD_KEY)

/**
 * EVENT
 * Discord.js
 */

client.on('ready', () => {
  signale.success('gelbooru-bot is initialized !')
  client.user.setPresence({ game: { name: 'Prefix : $' } })
})

client.on('message', message => {
  if (message.content.startsWith('$')) {
    if (!message.channel.nsfw) {
      message.reply('Your request must be in a nsfw channel.')
      return signale.pending('/!\\ Request not in nsfw channel.')
    }
    commands.checkHelp(message)
    commands.checkRequest(message)
  }
})

client.on('error', (error) => {
  signale.fatal(new Error(error))
})

client.on('disconnect', () => {
  signale.fatal(new Error('gelbooru-bot is down.'))
})

/*
 * WEBSERVER
 * Serve index.html
 */

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/views/index.html'))
})

/*
 * WEBSERVER
 * Port
 */

app.listen(webPort, () => {
  signale.success(`Webserver is listening on ${webPort}`)
})

/*
 * WEBSERVER
 * Middleware
 */

app.use(express.static(path.join(__dirname, 'views')))

/*
 * PROCESS
 * Uncaught Exception
 */

process.on('uncaughtException', (error) => {
  signale.fatal(new Error(error))
})
