/**
 * An HTTP endpoint that acts as a webhook for Discord message.create event
 * @param {object} event
 * @returns {any} result
 */
module.exports = async (event, context) => {
  // authenticates you with the API standard library
  
  // TODO: probably clean this up too 
  const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
  const {Client, Intents} = require('discord.js');
  const botIntents = new Intents();
  const https = require('https');

  let messageContent =`I need a card name to look up, include that next time ( ͡° ͜ʖ ͡°)`;

  if (context.params.event.content.includes('!fab')) {
    let channelToSend = context.params.event.channel_id;

    // lazy message idenfitication, this is super fraglie, we should make it better
    let query = context.params.event.content.split('!fab')[1].trim();
    if (query) {
      var returnString = query;

      let req = https.get(
        encodeURI(`https://api.fabdb.net/cards?keywords=${query}`),
        (res) => {
          let data = '';

          // This needs to be here to aggregate the data. Unless we have a better way of doing this, I didn't want to put more work into it right now.
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            console.log(returnString);
            let response = JSON.parse(data);
            console.log(response);
            returnString = response.data[0].image;
            console.log(returnString);
            // this can't use await in here because we are waiting for the response from the api call, so this is sync
            lib.discord.channels['@0.2.0'].messages.create({
              channel_id: channelToSend,
              content: returnString,
            });
          });
        }
      );

      // idk why but we need to send a second message here for the one above it to send. i want to find a way to get rid of this
      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id: channelToSend,
        content: returnString,
      });
    } else {
      //default message
      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id: channelToSend,
        content: messageContent,
      });
    }
  }
};
