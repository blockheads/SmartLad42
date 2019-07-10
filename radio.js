
//youtube object
const yt = require('ytdl-core');
//write to file
const fs = require('fs');

var screams = ["https://youtu.be/CKUDgLYfzAw","https://youtu.be/-p1OGgPkLcw",
                "https://youtu.be/8w0SpnL_Ysg","https://youtu.be/bSK0wmREv5g",
                "https://youtu.be/AsAAybD5iKU","https://youtu.be/Rq2vdkfjaMg"];

var streaming = false;

const tokens = require('./tokens.js');

const sqlite3 = require('sqlite3').verbose();

//public functions
module.exports = {
    //stops the current audio stream
    stop: function(message){

        if(!streaming){
            return message.reply("I am not playing anything!");
        }

        console.log("stop function executing...");

        //stop streaming
        if( !message.member.voiceChannel ){
            return message.reply("You are not in a voice channel!");
        }

        streaming = false;

        message.member.voiceChannel.leave();
        return undefined;
        
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
    skip: function (message){
        
        message.reply("skip under matienence.");
        // if(!streaming){
        //     return message.reply("I am not playing anything!");
        // }

        // console.log("skip function executing...");

        // //stop streaming
        // if( !message.member.voiceChannel ){
        //     return message.reply("You are not in a voice channel!");
        // }

        // streaming = false;

    },

    scream : function (message,bot){
        //delete this.
        if(dispatcher){
            //then just stop the audio
            stop();
        }
        //now that refreashed start streaming the scream
        streaming=true;
        playAudioInSwamp(screams[Math.floor(Math.random()*screams.length)],1000000,bot);
    },

    learnSong : function (message) {

         //splitting the word based on keyword to retrieve url
         var split = message.content.split("learn");
         var url = split[1];
         //here first we must check if it is a valid youtube link
         if( !yt.validateURL(url) ){
             return message.reply(`${url} is not a valid youtube link`);
         }
        
        song = message.content.substr(6,message.content.length);

        let db = new sqlite3.Database('smartDatabase.db');
        
        //storing our jsons
        createdAtJson = JSON.stringify(message.createdAt);

        // insert one row into the langs table
        db.run(`INSERT INTO songs(name,plays,user,time) VALUES(?,?,?,?)`, [song,0,message.author.username,createdAtJson], function(err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            message.reply('Thank you ' +  message.author.username + " Your song has been stored on the secure Tendienet™.");
        });
        
        // close the database connection
        db.close();


    },

    //starts up the radio
    startRadio: async function (message){
        
        if(streaming){
            return message.reply("I'm already playing something!");
        }

        const voiceChannel = message.member.voiceChannel;
        if(!voiceChannel){
            return message.reply("error, not in voice channel");
        }
        
        //joining the voice channel
        try{
            var connection = await voiceChannel.join();
        }
        catch (error){
            console.error("could not join the voice channel, error: ${error} ");
            return message.channel.send("I could not join the voice channel, error: {$error}");
        }    
        return audioStream( message, connection );
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
            if(connection){
                connection = null;
            }
        }
        
        playAudioInSwamp(song,volume,bot);
    }

};




//singularly play audio on end of audio stream leave channel (defaults to swamp)
function playAudioInSwamp( song,volume,bot ){
    if(streaming){
        voiceChannel = bot.channels.get(tokens.getToken2());
        if (!voiceChannel) {
            console.log("null VoiceChannel");
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
async function audioStream(message,connection){
    
    //grabing the volume and song
    try{
        songData = await getSong(message);
        console.log(songData);
        // scenario where there is no song....
        if(!songData){
            console.log("Recieved no songData");
            try{
                if(voiceChannel){
                    streaming = false;
                    voiceChannel.leave();
                }
                
            }
            catch(error){
                
            }
            finally{
                return;
            }
        }
    }
    catch (error){
        console.error("could not get song, error: ",error);
        return;
    }
    
    var songname = songData[0];
    await console.log(`retrieved  from function call: ${songname}`);


    //we are now streaming audio!
    streaming = true;

    
    if(!songData[2])
        username = "UNKNOWN TENDIENET RESIDENT";
    else{
        username = songData[2]
    }
    if(!songData[3]){
        timeString = "UNKNOWN TIME";
    }
    else{
        timeString = JSON.parse(songData[3])
    }

    message.reply("Selected  " + songname + " Which has been played " + songData[1] + " Stored by " + username + " at " + timeString);

    //setting the dispatcher to play the stream
    const dispatcher = await connection.playStream(yt(songname,{filter: "audioonly"}))
        .on('end', () => {
            
            console.log("The song has ended.");
            //check if we are still playing audio
            if(streaming){
                audioStream(message,connection);
            }
            else{
                connection.disconnect();
            }
        
    });

    //choosing the volume
    dispatcher.setVolume(volumeScale(songData[1]));

}

//gets a song with a volume
async function getSong(message){

    return new Promise(function(resolve,reject){

        // open the database
        let db = new sqlite3.Database('smartDatabase.db');

        let sql = 'SELECT * FROM songs ORDER BY RANDOM() LIMIT 1';
        

        db.get(sql,[],(err,row) => {
            if (err){
                reject(console.error(err.message));
            }

            if(!row){
                message.reply("No songs stored yet, add a song with 'learn <youtubeLink>'");
                reject("No songs stored yet, add a song to the tendieNet with 'learn <youtubeLink>'");
            }    
            
            console.log(row);
            songData = [row.name,row.plays,row.user,row.time];
            
            // we need to update that row, hence why we keep a primary key, got to stay FAST
            let sql = 'UPDATE songs SET plays = ? WHERE id = ?';
            db.get(sql,[row.plays+1,row.id],(err,updateRow) =>{
                // if we error out it's cool, all we are doing is updating the song play count anyways...
                if (err){
                    console.error(err.message);
                }
            });
            

            db.close();
            console.log(songData);
            resolve(songData);
        });

    });
}


//compares the song array
function songCompare(a,b){
    //the first elements store the amount of times played
    return (parseInt(b[1] ) - parseInt(a[1]));
    
}

//volume scaling, very important stuff
function volumeScale(volume){
    return  Math.abs( Math.cos(volume*10)*Math.pow(1.3,volume)*1/10);
}

