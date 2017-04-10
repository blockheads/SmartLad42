const token2 = '';

//youtube object
const yt = require('ytdl-core');
//write to file
const fs = require('fs');

//the voice channel the bot is currently in
var voiceChannel = null;
//the dispatcher the bot uses for voice activity
var dispatcher = null;
//flag if the player is streaming or not
var streaming = false;


var screams = ["https://youtu.be/CKUDgLYfzAw","https://youtu.be/-p1OGgPkLcw",
                "https://youtu.be/8w0SpnL_Ysg","https://youtu.be/bSK0wmREv5g",
                "https://youtu.be/AsAAybD5iKU","https://youtu.be/Rq2vdkfjaMg"];

//public functions
module.exports = 
{
    //stops the current audio stream
    stop: function(){
        //stop streaming
        streaming=false;

        if(voiceChannel){
            voiceChannel.leave();
        }
        dispatcher = null;
        voiceChannel = null;
    },

    //modifies the current songs volume
    volume: function(message){
        console.log("set volume : " + message.content.substr(6,message.content.length));
        console.log(dispatcher);
        if(dispatcher != null){
            //dispatcher.setVolumeDecibels(parseFloat(message.content.substr(6,message.content.length)));
            //sets the volume to small because semi-large numbers are way too loud
            var vol = parseFloat(message.content.substr(6,message.content.length)) / 10;
            dispatcher.setVolume(vol);

        }
    },

    //skips the current song
    skip: function (){
        //making sure the dispatcher exists
            if(dispatcher){
                //to skip first we have to end the current dispatcher
                dispatcher.end();
            }
    },

    scream : function (bot){
        //delete this.
        if(dispatcher){
            //stop streaming
            streaming=false;
            dispatcher.end();
            dispatcher = null;
            voiceChannel = null;
        }
        //now that refreashed start streaming the scream
        streaming=true;
        playAudioInSwamp(screams[Math.floor(Math.random()*screams.length)],1000000,bot);
    },

    learnSong : function (message){
        console.log("writing");
        fs.appendFile("\songs.txt", message.content.substr(6,message.content.length) + "|0|", function(err) {
            if(err) {
                return console.log(err);
            }


            console.log("The file was saved!");
        });
    },

    //starts up the radio
    startRadio: function (message){
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
    },

    //gets top songs
    leaderboard: function (message){
        var num = parseInt(message.content.substr(3,message.length));
        //searching the top boys
        message.reply("Analyzing the top " + num + "... please hold...");
        //grabbing the songlist and splitting it up
        var songs = fs.readFileSync('\songs.txt', 'utf8');
        var songArray = songs.split("|");
        var newArray = [];
        
        //going to store the song name and times played in a array
        //part of one bigger array
        for(var i=0;i<songArray.length-1;i+=2){
            //i is the song, i+1 is the # times played
            newArray.push([songArray[i],songArray[i+1],i/2]);
        }
        
        //sort using songComparator defined
        newArray.sort(songCompare);

        //making sure the number was inputed correctly
        if(!isNaN(num)){
            //making sure it's also not larger than the array size
            if(num > newArray.length){
                return message.reply("The are only " + newArray.length + " songs!");
            }
            //then printing out the top boys 
            for(var i=1;i<=num;i++){
                message.channel.sendMessage(i +". |" + " Song #" + newArray[i][2] + " Played " + newArray[i][1] + " times " + " (" + newArray[i][0] + ")");
            }
        }
        else{
            message.reply("Invalid format!");
        }
        
    },
    playSpecificSong(song,volume,bot){
        //delete this.
        //delete this.
        if(dispatcher){
            //stop streaming
            streaming=false;
            dispatcher.end();
            dispatcher = null;
            voiceChannel = null;
        }
        //now that refreashed start streaming the scream
        streaming=true;
        playAudioInSwamp(song,volume,bot);
    }

}




//singularly play audio on end of audio stream leave channel (defaults to swamp)
function playAudioInSwamp(song,volume,bot){
    if(streaming){
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
                if(voiceChannel){
                    streaming = false;
                    voiceChannel.leave();
                }
            });
        });
    }
    
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
        dispatcher.setVolume(songData[1]);
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
            var volume = (parseInt( songArray[randomIndex +1])) /10;
            console.log(song + " selected");

            return [song,volume];

        } catch(e) {
            console.log('Error:', e.stack);
        }
}


//compares the song array
function songCompare(a,b){
    //the first elements store the amount of times played
    return (parseInt(b[1] ) - parseInt(a[1]));
    
}