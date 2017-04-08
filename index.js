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

//global variables for voice channel stuff
var dispatcher = null;
//variable for playing audio, initalizes to false
var radioChannel = null;
//variable to make sure the radio stream ends
var streaming = false;

var words = ["Blood Money","Benji","Funny Money","Yard ","Pots of Money",
             "Brass","Scrilla","Scrappa","Dibs","Handbag","Measures",
             "Bag of Sand","roblox","911 is a inside job","smoke weed",
             "matt is cia","the third temple is coming","Flag","Handful",
             "Mill","Sheckles","Ton","Stack","Brick","Dough","Bread",
             "Good Cash","C-Note","Feddie","Cod","Course Note","High Rollin",
             "Yayo","Rack","kilo","mula","Fuck-Fuck","nigga","big weed",];

//generates a string of random words
function randomWords(size){
    var returnstring = '';
    for(var i=0;i<size-1;i++){
        returnstring+= words[Math.floor( Math.random()*words.length)] + " ";
    }
    returnstring+= words[Math.floor( Math.random()*words.length)];
    return returnstring;
}

bot.on('presenceUpdate',Presence=>{
    if( Presence.user !=null && Presence.user.presence != null && Presence.user.presence.game!= null && Presence.user.presence.game.name != null){
        if(Presence.user.presence.game.name === 'osu!'){
            
            playAudioInSwamp("https://youtu.be/a8c5wmeOL9o",1);
        }
        if(Presence.user.presence.game.name === 'ROBLOX'){
            playAudioInSwamp("https://youtu.be/V4jH0WeV67I",1000000000);
        }
    
    }
    
});

//singularly play audio on end of audio stream leave channel (defaults to swamp)
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
                
            });
        });
}

//singularly play audio on end of audio stream leave channel
function playAudio(message){
        voiceChannel = message.member.voiceChannel;
        songData = getSong(message);
        if (!voiceChannel) {
            console.log("null VoiceChannel")
        }
        voiceChannel.join()
            .then(connnection => {
            let stream = yt(songData[0], {audioonly: true});
            dispatcher = connnection.playStream(stream);
            dispatcher.setVolume(songData[1]);
            dispatcher.on('end', () => {
                voiceChannel.leave();
              
            });
        });
}

//continually stream audio 
function audioStream(message){
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) {
            console.log("null VoiceChannel")
        }
        voiceChannel.join()
            .then(connnection => {
            songData = getSong(message);
            let stream = yt(songData[0], {audioonly: true});
            dispatcher = connnection.playStream(stream);
            dispatcher.setVolume(songData[1]);
            dispatcher.on('end', () => {
                //recursive call to start again
                if(streaming){
                    audioStream(message);
                }
                
            });
        });
}

//plays a singular song given a message
function getSong(message){
    try {  
            var songs = fs.readFileSync('\songs.txt', 'utf8');   
            console.log("songlist: " + songs);    
            var songArray = songs.split("|");
            //makes sure to select a song, not the number of times played
            //song at even indencis 
            do{
                var randomIndex = Math.floor( Math.random()*(  songArray.length*1));
            }while(randomIndex%2 ==1)

            message.channel.sendMessage("Song #" + Math.floor(randomIndex/2) + " selected out of " + Math.floor(songArray.length/2) + " known songs.");
            message.channel.sendMessage("Song #" + Math.floor(randomIndex/2) + " has been selected " + songArray[randomIndex + 1] + " times.");
            
            //modifying new song length
            //have to re-write whole file unfortunately (can't think of better way)
           
           
            var logger = fs.createWriteStream('\songs.txt', {
                //flags: 'a' // 'a' means appending (old data will be preserved)
            })
             
            for(var i = 0; i<songArray.length; i++){
                //updating song selected num
                if(i==randomIndex+1){
                    var newInt = parseInt( songArray[i]) + 1;
                    songArray[i] = newInt.toString();
                }
                //writing to the file again
                //if statement makes sure not to concatanate trailing "|"
                if(i==songArray.length-1){
                    logger.write(songArray[i]);
                }
                else{
                    logger.write(songArray[i]+ "|");
                }
                
            }
            
         
            var song = songArray[randomIndex];
            var volume = parseInt( songArray[randomIndex +1]) + 1;
            console.log(song + " selected");

            return [song,volume];

        } catch(e) {
            console.log('Error:', e.stack);
        }
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
            dispatcher.setVolumeDecibels(parseInt(message.content.substr(6,message.content.length)));
        }
    }
    
    if (message.content.startsWith('sing me a song')) {

        
        message.channel.sendMessage(randomWords(Math.floor( Math.random()*20)),{tts:true});

    }
    if(message.content.substr(0,5) === 'learn'){
        console.log("writing");
        fs.appendFile("\songs.txt", message.content.substr(6,message.content.length) + "|0|", function(err) {
        if(err) {
            return console.log(err);
        }


        console.log("The file was saved!");
        }); 
    }
    if(message.content === 'start radio'){
        if(streaming){
            message.reply("Stop trying to fuck the bot up dick weed");
        }
        else{
            message.reply("Starting up radio, type 'stop radio' to stop");
         
        
            //storing voicechannel
            radioChannel = message.member.voiceChannel;
            streaming = true;
            audioStream(message);
        }
        

    }
    if(message.content === 'stop radio'){
        //if there is a radioChannel
        if(streaming){
            streaming = false;
            radioChannel.leave();
            
        }
    }
   

});



bot.login(token);