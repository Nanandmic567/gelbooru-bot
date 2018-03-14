/**
 * REQUIRE
 * Discord related
 */

const Discord = require('discord.js'),
      client = new Discord.Client();

/**
 * REQUIRE
 * HTTP Request
 */

const axios = require('axios');

/**
 * REQUIRE
 * Express
 */

const express = require('express'),
      app = express(),
      webPort = process.env.PORT || 80;

/**
 * LOGIN
 * Bot
 */

client.login(process.env.DISCORD_KEY);


/**
 * EVENT
 * ready
 */

 client.on('ready', () => {
   console.log('gelbooru-bot is initialized !');
 })

/**
 * EVENT
 * On message
 */

client.on('message', message => {
  if (message.content === '$help')
  {
    var embed = 
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
    message.reply('', { embed: embed });
  }
  else if (message.content.charAt(0) === '$')
  {
    // Get tags from $command
    var data = message.content.split('$'),
        tags = data[1].replace(' ', '+'),
        pid = Math.floor((Math.random()*5000) + 1);
    // API GET
    axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=1&tags=${tags}&pid=${pid}`)
    .then((image) => {
      // Save image var
      image = image.data[0];
      if (image !== undefined)
      {
        // If a sample was found send the sample
        console.log(`${image.file_url}`);
          var embed = {
            "title": "Go to image source on Gelbooru",
            "description": `You searched for: ${tags}`,
            "url": `https://gelbooru.com/index.php?page=post&s=view&id=${image.id}`,
            "color": 44678,
            "image": {
              "url": `${image.file_url}`
            }
          };
          message.reply({embed});
      }
      else
      {
        axios.get(`https://gelbooru.com/index.php?page=dapi&s=tag&q=index&json=1&name_pattern=${tags.replace(/\s/g, '+')}&limit=3&order=DESC&orderby=count`)
          .then((suggestions) => {
            var suggestion1 = suggestions.data[0].tag,
                suggestion2 = suggestions.data[1].tag,
                suggestion3 = suggestions.data[2].tag;
            var suggestion1count = `${suggestions.data[0].count} results found.`,
                suggestion2count = `${suggestions.data[1].count} results found.`,
                suggestion3count = `${suggestions.data[2].count} results found.`;
            var embed = 
            {
                title: `Any results for ${tags}, Here some suggestions :`,
                fields: [
                  {
                    name: $suggestion1,
                    value: $suggestion1count
                  },
                  {
                    name: $suggestion2,
                    value: $suggestion2count
                  },
                  {
                    name: $suggestion3,
                    value: $suggestion3count
                  }
                ]
            }

            message.reply({embed});
          });
      }
    });
  } 
})

/*
 * WEBSERVER
 * Serve index.html
 */

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

/*
 * WEBSERVER
 * Port
 */

 app.listen(webPort, () => {
  console.log(`Webserver is listening on ${webPort}`);
 });

 /*
 * WEBSERVER
 * Middleware
 */

app.use(express.static(__dirname + '/views'));