//necessary code to include discord.js library
const Discord = require('discord.js');
const bot = new Discord.Client();
//youtube object
const yt = require('ytdl-core');
//write to file
const fs = require('fs');

//bot token shh
const token = 'MzAwMDI1NjMwNzE0NDk0OTc2.C8mt1w.n17F0ZiVIWLQ21t1dgemob2AqJ0';
bot.login();

//initializes the bot to logon
bot.on('ready', () =>{
    console.log('Smart Boy 42 Online.');
});


//event listener for any messages
bot.on('message',message=>{
    if(message.content === 'what is my avatar'){
        //reply with users avatar
        message.reply(message.author.avatarURL);
    }
    if(message.content.includes('hitler')){
        message.reply("Sig Heil");
    }
    if(message.content.substr(0,4) === 'play'){
        bot.user.setGame(message.content.substr(4,message.content.length));
    }
    if (message.content.startsWith('sing me a song')) {
        //random song selected
        
        try {  
            var songs = fs.readFileSync('\songs.txt', 'utf8');   
            console.log(songs);    
            var songArray = songs.split("|");
            var song = songArray[0];
            console.log(song + " selected");

        } catch(e) {
            console.log('Error:', e.stack);
        }

        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) {
            return message.reply(`Please be in a voice channel first!`);
        }
        voiceChannel.join()
            .then(connnection => {
            let stream = yt(song, {audioonly: true});
            const dispatcher = connnection.playStream(stream);
            dispatcher.on('end', () => {
                voiceChannel.leave();
            });
        });
    }
    if(message.content.substr(0,5) === 'learn'){
        console.log("writing");
        fs.appendFile("\songs.txt", message.content.substr(6,message.content.length) + "|", function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
        }); 
    }
   

});

bot.on('Game',Game=>{
    bot.message("User is playing " + Game.name);
});

bot.login(token);