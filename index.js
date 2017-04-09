//necessary code to include discord.js library
const Discord = require('discord.js');
const bot = new Discord.Client();
//youtube object
const yt = require('ytdl-core');
//write to file
const fs = require('fs');
//sleep

//bot token shh
const token = '';
const token2 = '';

//initializes the bot to logon
bot.on('ready', () =>{
    console.log('Smart Boy 42 Online.');
});

var fuckMatt = false;
//the voice channel the bot is currently in
var voiceChannel = null;
//the dispatcher the bot uses for voice activity
var dispatcher = null;
//flag if the player is streaming or not
var streaming = false;

var screams = ["https://youtu.be/CKUDgLYfzAw","https://youtu.be/-p1OGgPkLcw",
                "https://youtu.be/8w0SpnL_Ysg","https://youtu.be/bSK0wmREv5g",
                "https://youtu.be/AsAAybD5iKU","https://youtu.be/Rq2vdkfjaMg"]

var words = ["Blood Money","Benji","Funny Money","Yard ","Pots of Money",
             "Brass","Scrilla","Scrappa","Dibs","Handbag","Measures",
             "Bag of Sand","roblox","911 was an inside job","smoke weed",
             "Matt is CIA","the third temple is coming","Flag","Handful",
             "Mill","Sheckles","Ton","Stack","Brick","Dough","Bread",
             "Good Cash","C-Note","Feddie","Cod","Course Note","High Rollin",
             "Yayo","Rack","kilo","mula","Fuck-Fuck","nigga","big weed",
             "Big Watch","Big Booty","Shaboobalaboopy","Stiplificate",
             "Apologin","Bling Bling","Mamajahambo","dinosaurs",
             "movie movie movie","Captian Alexe","Herb","Buster",
             "Flossy","Thizz","Bling Bling","Frankenstein Controls","CIA radio",
             "Dianna Cowern"];

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

            playAudioInSwamp("https://youtu.be/a8c5wmeOL9o",10);
        }
        if(Presence.user.presence.game.name === 'ROBLOX'){
            playAudioInSwamp("https://youtu.be/V4jH0WeV67I",1000000000);
        }

    }

});

//singularly play audio on end of audio stream leave channel (defaults to swamp)
function playAudioInSwamp(song,volume){
    voiceChannel = bot.channels.get(token2);
    if (!voiceChannel) {
        console.log("null VoiceChannel")
    }
    voiceChannel.join()
        .then(connnection => {
        let stream = yt(song, {audioonly: true});
        dispatcher = connnection.playStream(stream);
        dispatcher.setVolume(volume);
        dispatcher.on('end', () => {
            VoiceChannel.leave();
        });
    });
}

//continually stream audio 
function audioStream(message,connection){
    //this can only be called while streaming
    if(streaming){
        //grabing the volume and song
        var songData = getSong(message);
        let stream = yt(songData[0],{audioonly:true});
        //setting the dispatcher to play the stream
        dispatcher = connection.playStream(stream);
        //fires when the stream ends
        dispatcher.on('end',()=>{
        //begins another audio stream with the connection if has a voicechannel
        //and a dispatcher
        audioStream(message,connection);
        
        });
    }
    
    
}

//gets a song with a volume
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
            var volume = parseFloat( songArray[randomIndex +1])/10;
            console.log(song + " selected");

            return [song,volume];

        } catch(e) {
            console.log('Error:', e.stack);
        }
}

//event listener for any messages
bot.on('message',message=>{
    if(fuckMatt && message.author.id==='193186571615207424'){
        message.delete();
        message.reply("fuck you matt");
    }
    if(message.content === 'what is my avatar'){
        //reply with users avatar
        message.reply(message.author.avatarURL);
    }
    if(message.content.includes('hitler')){
        message.reply("Seig Heil");
    }
    if(message.content.substr(0,4) === 'play'){
        bot.user.setGame(message.content.substr(4,message.content.length));
    }
    if(message.content.substr(0,6) === 'volume'){
        console.log("set volume : " + message.content.substr(6,message.content.length));
        console.log(dispatcher);
        if(dispatcher != null){
            //dispatcher.setVolumeDecibels(parseFloat(message.content.substr(6,message.content.length)));
            //sets the volume to small because semi-large numbers are way too loud
            var vol = parseFloat(message.content.substr(6,message.content.length)) / 10;
            dispatcher.setVolume(vol);
            
        }
    }
    
    if (message.content.startsWith('God says...')) {

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
        //so you can't break the bot
        if(!streaming){
            //begin streaming audio
            streaming = true;
            //first if checks if voiceChannel exists
            if(!voiceChannel){
                voiceChannel = message.member.voiceChannel;
                //this checks if user in voice channel who sent 'start radio' message
                if(!voiceChannel){
                    return message.reply("error, not in voice channel");
                }
            }
            //joining the voice channel
            voiceChannel.join()
            //initializing a connection as a promise
            .then(connection=>{
                //inside here we simply play music
                audioStream(message,connection);
            });
        }
        

    }
    if(message.content === 'stop radio' || message.content === 'stop screaming'){
        //stop streaming
        streaming=false;

        //nullifying everything and leaving the channel
        if(dispatcher){
            dispatcher.end();
        }
        if(voiceChannel){
            voiceChannel.leave();   
        }
        dispatcher = null;
        voiceChannel = null;       
    }
    if(message.content === 'fuck matt'){
        fuckMatt=!fuckMatt;
    }
   if(message.content.includes('seig') || message.content.includes('SEIG')) {
      message.reply("HEIL");
    }
    if(message.content.includes('scream')){
        
        dispatcher.end();
        playAudioInSwamp(screams[Math.floor(Math.random()*screams.length)],1000000);
    }
    if(message.content === 'skip'){
        //to skip first we have to end the current audio stream
        dispatcher.end();
        //so you cant break it by spamming skip calls
        //then lets resume the radio by starting a new connection
        voiceChannel.join()
        
    }
    if(message.content === 'leaderboard'){
        
    }
   



});



bot.login(token);