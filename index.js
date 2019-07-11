//necessary code to include discord.js library
const Discord = require('discord.js');
const bot = new Discord.Client();

//the message handler
const mh = require('./messageHandler.js');
//radio.js
const radio = require('./radio.js');

const tokens = require('./tokens.js');

const sqlite3 = require('sqlite3').verbose();

const fs = require('fs')


//initializes the bot to logon
bot.on('ready', () =>{
    console.log('Smart Boy 42 Online.');

    // building our database tables
    // opening up our SMART database, very smart new tech
    let db = new sqlite3.Database('smartDatabase.db');
   
    db.run('CREATE TABLE IF NOT EXISTS songs(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, plays INTEGER, user TEXT, time TEXT)');
    
    //db.run('DROP TABLE songs');	

    /** 
    db.all('SELECT * FROM songs2',[],(err,rows) =>{
        if(err){
	    throw err;
	}
	rows.forEach((row) =>{
	    db.run('INSERT INTO songs(id,name,plays,user,time) VALUES(?,?,?,?,?)',[row.id,row.name,row.plays,null,null],function(err){
		if(err){
			return console.log(err.message);
		}
	    });
	   
	});
    });
    **/

    db.close();
    console.log('ready!');
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
bot.on('message', async message =>{
    mh.messageHandle(message,bot);
});


bot.login(tokens.getToken1());
