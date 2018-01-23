# SteamAPI.io Discord Bot

### About
Note: Following project requires a API Key from https://steamapi.io as well created Bot on https://discordapp.com/developers/applications/me. For any questions, read documentations first!

This is just a simple example for a working Discord bot. By default it will react on !price command and output embedded message with items and their prices. You can change appearance and some styling directly from a config file.

### Setup
Install latest version of NodeJS.
Download or clone this project.
Open config.json file and change required values (described in config section).
Run command prompt (cmd.exe) and switch to project folder.
Run following command:
```BASH
  npm i
  node index.js
```

### Config
- `apps` apps ID's you want to enable.
- `steamapi.io-key` API Key you need to grab the prices from https://steamapi.io.
- `discord-token` API Key for your Discord created bot.
- `reconnect` If the bot should reconnect on disconnect or error event.
- `command` Parameter on which your bot will react to search the prices.
- `icon` Icon on the header of embedded message.
- `color` Color accent of an embedded message.
- `results` Number of max results within a message. Maximal is 25.

### Contribution
If you want to contribute you must follow these rules:
- Adding elements to config requires you to update README.md file
- You must comment your code sufficently
- You have to add enough for it to be merged
- Obviously make sure personal details are out of config when makng a PR
- Leave placeholder commands and responces in
- Dont add anything to the bot to scam people
