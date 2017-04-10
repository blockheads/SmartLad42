//necessary code to include discord.js library
const Discord = require('discord.js');
const bot = new Discord.Client();

//the message handler
const mh = require('./messageHandler.js');
//radio.js
const radio = require('./radio.js')

//bot token shh
const token = '';


//initializes the bot to logon
bot.on('ready', () =>{
    console.log('Smart Boy 42 Online.');
});

bot.on('presenceUpdate',Presence=>{
    if( Presence.user !=null && Presence.user.presence != null && Presence.user.presence.game!= null && Presence.user.presence.game.name != null){
        if(Presence.user.presence.game.name === 'osu!'){
            radio.playSpecificSong("https://youtu.be/a8c5wmeOL9o",10,bot);
        }
        if(Presence.user.presence.game.name === 'ROBLOX'){
            radio.playSpecificSong("https://youtu.be/V4jH0WeV67I",1000000000,bot);
        }

    }

});

//event listener for any messages
bot.on('message',message=>{
    mh.messageHandle(message,bot);
});


bot.login(token);
