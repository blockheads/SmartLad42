
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

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();


myEmitter.on('end',  (message,bot)=>{
    console.log("next song");
    radioHandler.dispatcher.destroy();
    radioHandler.song.playing = false;
});

myEmitter.on('stop',  ()=>{
    console.log("stopping audio");
    radioHandler.donePlaying();
    radioHandler.dispatcher.destroy();
    radioHandler.connection.disconnect();
});

class User{

    constructor(username){
        this.username = username;
    }

}

class Song{

    constructor(name,plays,user,time){
        this.name = name;
        this.plays = plays;
        this.user = user;
        this.time = time;
        this.playing = false;
    }


}

class RadioHandler{

    constructor(){
        this.currentSong = null;
        // this is to handle as we are selecting our song
        this.selecting = false;
        this.dispatcher = null;
        // the current swamp
        this.swamp = null;
        //screaming?
        this.screaming = false;
        this.connection = null;
    }

    setSong(song){
        this.currentSong = song;
    }

    donePlaying(){
        if(this.currentSong){
            this.currentSong.playing = false;
        }
        this.currentSong = null;
    }

    isPlaying(){
        return this.currentSong != null || this.selecting;
    }

    get song(){
        return this.currentSong;
    }

    end(message,bot){
        myEmitter.emit('end',message,bot);
    }

    stop(){
        myEmitter.emit('stop');
    }

    // when a audiostream is finished playing
    finished(message,bot){
        console.log("next song");
        this.dispatcher.destroy();
        if (this.isPlaying()){
            this.song.playing = false;
            audioStream(message,bot);
        }
        else{

        }
    }
}

// our radio handler is built boiii
let radioHandler = new RadioHandler();

//public functions
module.exports = {
    //stops the current audio stream
    stop: function(message,bot){

        if(!radioHandler.isPlaying()){
            return message.reply("I am not playing anything!");
        }

        console.log("stop function executing...");

        //stop streaming
        if( !message.member.voiceChannel ){
            return message.reply("You are not in a voice channel!");
        }

        message.reply("Done playing audio!");
        radioHandler.stop();
        
        bot.user.setActivity('visit TendieNet™');
       
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
    skip: function (message,bot){
        
        if(!radioHandler.isPlaying()){
            return message.reply("I am not playing anything!");
        }

        if(radioHandler.screaming){
            return message.reply("YOU CAN'T' SKIP A SCREAM");
        }

        console.log("skip function executing...");

        //stop streaming
        if( !message.member.voiceChannel ){
            return message.reply("You are not in a voice channel!");
        }

        radioHandler.end(message,bot);

    },

    scream : function (message,bot){
        console.log("scream");
        if(!radioHandler.swamp){
            message.reply("You must set a swamp first.");
            return;
        }

        if (radioHandler.isPlaying()){
            radioHandler.stop();
        }
        
        song = screams[Math.floor(Math.random()*screams.length)];
        radioHandler.setSong(new Song(song,null,null,null));
        radioHandler.screaming = true;
        playAudioInSwamp(song,1000000,bot);

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
    startRadio: async function (message,bot){
        
        if(radioHandler.isPlaying()){
            return message.reply("I'm already playing something!");
        }

        const voiceChannel = message.member.voiceChannel;
        if(!voiceChannel){
            return message.reply("error, not in voice channel");
        }
        
        //joining the voice channel
        try{
            var connection = await voiceChannel.join();
            radioHandler.connection = connection;
        }
        catch (error){
            console.error("could not join the voice channel, error: ${error} ");
            return message.channel.send("I could not join the voice channel, error: {$error}");
        }    
        audioStream( message, bot );
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
    setSwamp: function(message,bot){
        const voiceChannel = message.member.voiceChannel;
        if(!voiceChannel){
            return message.reply("error, not in voice channel, please join a swamp to set.");
        }
        message.reply('swamp set to ' + voiceChannel.name);
        radioHandler.swamp = voiceChannel;
    },
    playSpecificSong(song,volume,bot){
        //delete this.
        //delete this.
        if(radioHandler.isPlaying()){
            //stop streaming
            radioHandler.end();
        }
        
        playAudioInSwamp(song,volume,bot);
    },
    // 

};




//singularly play audio on end of audio stream leave channel (defaults to swamp)
function playAudioInSwamp( song,volume,bot ){

    voiceChannel = radioHandler.swamp;
    voiceChannel.join()
        .then(connnection => {
        let stream = yt(song, {audioonly: true});
        dispatcher = connnection.playStream(stream).on('end', () => {
            console.log("ending");
            connnection.disconnect();
            radioHandler.dispatcher.destroy();
            radioHandler.screaming = false;
        });
        radioHandler.dispatcher = dispatcher;
        radioHandler.connection = connnection;
        dispatcher.setVolume(volume);
    });
    
}

//continually stream audio
async function audioStream(message,bot){
    //we are now streaming audio!

    // selecting a song
    radioHandler.selecting = true;


    console.log(radioHandler.song)

    //grabing the volume and song
    try{
        songData = await getSong(message);
        radioHandler.selecting = false;

        console.log(songData);
        // scenario where there is no song....
        if(!songData){
            console.log("Recieved no songData");
            try{
                if(voiceChannel){
                    radioHandler.donePlaying();
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
    
    let song = new Song(songname,songData[1],new User(username),timeString);
    radioHandler.setSong(song);

    yt.getBasicInfo(songname,(err,info)=>{
        if(err){
            console.log(err);
        
        }
        else{
            console.log(info.title);
            bot.user.setActivity(info.title);
        }
    });

    //setting the dispatcher to play the stream
    const dispatcher = await radioHandler.connection.playStream(yt(songname,{filter: "audioonly"}))
        .on('end', () => {
            radioHandler.finished(message,bot);
        });
    
    radioHandler.dispatcher = dispatcher;

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

