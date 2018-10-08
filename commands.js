const axios = require('axios')
const signale = require('signale')

exports.checkRequest = (message) => {
  if (message.content.charAt(0) === '$') {
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
            signale.success(`${message.author.username} requested '${message.content}' = ${image.file_url}`)
          }
        })
      })
      .catch((error) => {
        message.reply('Sorry, there was an unexpected error. Try with another tags')
        signale.fatal(new Error(error))
      })
  }
}

exports.checkHelp = (message) => {
  if (message.content === '$help') {
    let embed =
    {
      title: 'Commands',
      fields: [
        {
          name: '$',
          value: 'Search random images (Can be NSFW)'
        },
        {
          name: '$tag',
          value: 'Search for tag'
        },
        {
          name: '$tag -5',
          value: 'Search for tag and get 5 results at once'
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
    signale.success(`${message.author.username} requested ${message.content}`)
  }
}
