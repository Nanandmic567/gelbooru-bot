/**
 * REQUIRE
 * Node
 */

const path = require('path')

/**
 * REQUIRE
 * Discord related
 */

const Discord = require('discord.js')

const client = new Discord.Client()

/**
 * REQUIRE
 * HTTP Request
 */

const axios = require('axios')

/**
 * REQUIRE
 * Express
 */

const express = require('express')

const app = express()

const webPort = process.env.PORT || 80

/**
 * LOGIN
 * Bot
 */

client.login(process.env.DISCORD_KEY)

/**
 * EVENT
 * ready
 */

client.on('ready', () => {
  console.log('gelbooru-bot is initialized !')
})

client.on('error', (error) => {
  console.log(error)
})

client.on('disconnect', () => {
  console.log('gelbooru-bot is down.')
})

/**
 * EVENT
 * On message
 */

client.on('message', message => {
  if (message.content === '$help') {
    let embed =
    {
      title: 'Commands',
      fields: [
        {
          name: '$',
          value: 'Search random images'
        },
        {
          name: '$tag',
          value: 'Search for tag'
        },
        {
          name: '$tag1 tag2',
          value: 'Search for tag1 and tag2'
        },
        {
          name: '$tag rating:explicit',
          value: 'Search for tag : Explicit content only'
        },
        {
          name: '$tag rating:questionable',
          value: 'Search for tag : Questionable content only'
        },
        {
          name: '$tag rating:safe',
          value: 'Search  for tag : Safe content only'
        }
      ]
    }
    message.reply('', { embed: embed })
  } else if (message.content.charAt(0) === '$') {
    if (!message.channel.nsfw) {
      message.reply('Your request must be in a nsfw channel.')
      return console.log('/!\\ Request not in nsfw channel.')
    }
    // Get tags from $command
    let imgLimit = message.content.includes('-5') ? 5 : 1
    let data = message.content.split('$')
    let tags = data[1].replace(' ', '+')

    let pid = Math.floor((Math.random() * 5000) + 1)
    // API GET
    axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=${imgLimit}&tags=${tags}&pid=${pid}`)
      .then((data) => {
        data.data.forEach(image => {
          if (image !== undefined) {
          // If a sample was found send the sample
            console.log(`${message.author.username} requested '${message.content}' = ${image.file_url}`)
            let embed = {
              'title': 'Go to image source on Gelbooru',
              'description': `You searched for: ${tags}`,
              'url': `https://gelbooru.com/index.php?page=post&s=view&id=${image.id}`,
              'color': 44678,
              'image': {
                'url': `${image.file_url}`
              }
            }
            message.reply({ embed })
          } else {
            axios.get(`https://gelbooru.com/index.php?page=dapi&s=tag&q=index&json=1&name_pattern=${tags}&limit=3&order=DESC&orderby=count`)
              .then((suggestions) => {
                let suggestion1 = suggestions.data[0].tag

                let suggestion2 = suggestions.data[1].tag

                let suggestion3 = suggestions.data[2].tag

                let suggestion1count = `${suggestions.data[0].count} results found.`

                let suggestion2count = `${suggestions.data[1].count} results found.`

                let suggestion3count = `${suggestions.data[2].count} results found.`

                let embed =
                  {
                    title: `Any results for ${tags}, Here some suggestions :`,
                    fields: [
                      {
                        name: suggestion1,
                        value: suggestion1count
                      },
                      {
                        name: suggestion2,
                        value: suggestion2count
                      },
                      {
                        name: suggestion3,
                        value: suggestion3count
                      }
                    ]
                  }

                message.reply({ embed })
              })
          }
        })
      })
      .catch((error) => {
        message.reply('Sorry, there was an unexpected error. Try with another tags', error)
      })
  }
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
  console.log(`Webserver is listening on ${webPort}`)
})

/*
 * WEBSERVER
 * Middleware
 */

app.use(express.static(path.join(__dirname, 'views')))
