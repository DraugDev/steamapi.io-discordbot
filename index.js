/* REQUIRED LIBRARIES
-------------------------------------------------------------- */
var discord = require('discord.io');
var request = require('request');

/* CONFIG FILE
-------------------------------------------------------------- */
var config = require('./config');

/* CACHE PRICES
-------------------------------------------------------------- */
var prices = {};

/* INITIALIZE BOT
-------------------------------------------------------------- */
var bot = new discord.Client({
  token: config['discord-token'],
  autorun: true
});

/* INTERVALS
-------------------------------------------------------------- */
get_prices();
setInterval(function () {
  get_prices();
}, 60 * 60 * 1000);

/* CONNECTION FUNCTIONS
-------------------------------------------------------------- */
bot.on('ready', function () {
  console.log(`[INFO] Logged in as ${bot.username} with ID ${bot.id}`);
  console.log(`[INFO] You can invite your bot by visiting following URL: https://discordapp.com/oauth2/authorize?client_id=${bot.id}&scope=bot&permissions=0`);
});

bot.on('disconnect', function (msg, code) {
  console.log(`[ERR] Disconnected with message ${msg} and code number ${code}.`);


  if (config['reconnect'] == true) {
    console.log(`[INFO] Trying to reconnect.`);
    bot.connect();
  }
});

/* MESSAGE FUNCTIONS
-------------------------------------------------------------- */
bot.on('message', function (user, userID, channelID, message, event) {

  // React on message
  if (message.indexOf(config['command']) == 0) {

    // Get only items name
    var name = message.replace(config['command'], '').trim();

    // Check if name empty
    if (!name.length) {
      return;
    }

    // All found results
    var results = [];

    // Complex regex to find all matching values
    var regex = new RegExp("^(?=.*\\b" + name.replace(/[^0-9a-z]/gi, ' ').replace(/\s\s+/g, ' ').trim().split(' ').join("\\b)(?=.*\\b") + "\\b).*$", "gi");

    // Build result list
    for (var i in prices) {
      if (i.match(regex)) {
        results.push(prices[i]);
      }
      if (results.length >= (config['results'] > 25 ? 25 : config['results'])) {
        break;
      }
    }

    // Prepare message
    var message = '';
    if (results.length > 0) {
      for (var i in results) {
        message += "[" + results[i].appid + "] - **" + results[i].market_hash_name + "** - " + '$' + results[i].price + "\r\n";
      }
    } else {
      message = "No matching results found. Please try another one!";
    }

    // Send message to channel
    bot.sendMessage({
      to: channelID,
      embed: {
        'author': {
          'name': results.length + ' results maching "' + name + '" criteria:',
          'icon_url': config['icon']
        },
        'description': message,
        'color': parseInt(config['color'], 16),
        'footer': {
          'text': "Prices and Inventories provided by SteamAPI.io. Prices are cached.",
          'icon_url': 'https://steamapi.io/assets/img/favicons/favicon-32x32.png'
        },
      }
    });

  }
});

/* INTERNAL FUNCTIONS
-------------------------------------------------------------- */
function get_prices() {
  config['apps'].forEach(function(appid) {
    request({
      'uri': 'https://api.steamapi.io/market/prices/' + appid + '?key=' + config['steamapi.io-key'],
      'json': true,
    }, function(err, response, json) {

      // Some error happened
      if(err || response.statusCode != 200) { 
        console.log(`[ERR] Can not get prices for app ID ${appid}.`);
        return;
      }

      // Fill up data
      for(var item in json) {
        prices[appid + '-' + item] = {
          appid: appid,
          market_hash_name: item,
          price: parseFloat(json[item]).toFixed(2)
        };
      }
       
    }.bind(appid));
  });
}
