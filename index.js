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

var dispatcher = null;
var voiceChannel = null;

    
function playAudioInSwamp(song,volume){
    
        voiceChannel = bot.channels.get("246421186777448460");
        if (!voiceChannel) {
            console.log("null VoiceChannel")
        }
        voiceChannel.join()
            .then(connnection => {
            let stream = yt(song, {audioonly: true});
            dispatcher = connnection.playStream(stream);
            dispatcher.setVolume(volume);
            dispatcher.on('end', () => {
                voiceChannel.leave();
                voiceChannel = null;
            });
        });
}

function playAudio(guildMember,song){
        voiceChannel = guildMember.voiceChannel;
        if (!voiceChannel) {
            console.log("null VoiceChannel")
        }
        voiceChannel.join()
            .then(connnection => {
            let stream = yt(song, {audioonly: true});
            dispatcher = connnection.playStream(stream);

            dispatcher.on('end', () => {
                voiceChannel.leave();
                voiceChannel = null;
            });
        });
}


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
    if(message.content.substr(0,6) === 'volume'){
        console.log("set volume : " + message.content.substr(6,message.content.length));
        console.log(dispatcher);
        if(dispatcher != null){
            dispatcher.setVolume(parseInt(message.content.substr(6,message.content.length)));
        }
    }
    if(message.content === 'stop'){
        if(dispatcher != null){
            dispatcher.leave();
        }
    }
    
    if (message.content.startsWith('sing me a song')) {
        //random song selected
        
        try {  
            var songs = fs.readFileSync('\songs.txt', 'utf8');   
            console.log("songlist: " + songs);    
            var songArray = songs.split("|");
            var song = songArray[Math.floor( Math.random()*(  songArray.length*1))];
            console.log(song + " selected");
            playAudio(message.member,song);

        } catch(e) {
            console.log('Error:', e.stack);
        }

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