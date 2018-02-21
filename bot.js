/**
 * REQUIRE
 * Discord related
 */

const Discord = require('discord.js'),
      client = new Discord.Client();

/**
 * REQUIRE
 * Express
 */

const express = require('express'),
      app = express();
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
   console.log('gelbooru-bot ready !');
 })

/**
 * EVENT
 * On message
 */

client.on('message', message => {
  // If the first char is '$'
  if (message.content === '$help')
  {
    message.reply('\n`$`: Random images\n`$tag` Search for `tag`\n`$tag1+tag2` Search for `tag1` and `tag2`');
  }
  else if (message.content.charAt(0) === '$')
  {
    // Get tags from $command
    var data = message.content.split('$'),
        tags = data[1],
        pid = Math.floor((Math.random()*1000) + 1);
    // Reply with a confirmation message
    message.reply(`Searching image for \`${tags}\` `);
    // API GET
    axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=1&tags=${tags}&pid=${pid}`)
    .then((image) => {
      // Save image var
      image = image.data[0];
      if (image !== undefined)
      {
        // Save url var
        var url;
        // If a sample was found send the sample
        if (image.sample)
        {
          url = `https://simg3.gelbooru.com//samples/${image.directory}/sample_${image.hash}.jpg`;
          console.log(`A sample was found for ${tags} : ${url}`);
        }
        else
        { // If not, send the original file
          url = image.file_url;
          console.log(`A sample wasn't found for ${tags} : ${url}`);
        }
        // Send the reply
        if (image.source !== '')
        { // If source isn't empty
          message.reply(`${url} \n ${image.source}`);
        }
        else
        {
          message.reply(`${url}`);
        }
      }
      else
      {
        message.reply(`Any results for \`${tags}\``);
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