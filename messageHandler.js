//for words.js functions
const words = require('./words.js');
//for radio.js functions
const radio = require('./radio.js');
//for tendies.js functions
const tendies = require('./tendie/tendies.js');
//write to files
const fs = require('fs');
//for sql-lite
const sql = require("sqlite");
sql.open("./wordStorage.sqlite");


var fuckMatt = false;


//module.exports = "public" functions...
module.exports = 
{
    //main function handles a message
    messageHandle: async function (message,bot){
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
            radio.volume(message);
        }
        //gw
        if (message.content.startsWith('God says...')) {
            words.godSays(message);
        }
        //scotsman insults
        if(message.content.startsWith('scotsman'))
        {
            words.scotsman(message);
        }

        if(message.content.substr(0,5) === 'learn'){
            radio.learnSong(message);
        }
        if(message.content === 'start radio'){
            radio.startRadio(message);
        }
        if(message.content === 'stop radio' || message.content === 'stop screaming'){
            radio.stop(message);
        }
        if(message.content === 'fuck matt'){
            fuckMatt=!fuckMatt;
        }
        if(message.content.includes('seig') || message.content.includes('SEIG')) {
        message.reply("HEIL");
        }
        if(message.content.includes('scream')){
            radio.scream(bot);
        }
        if(message.content === 'skip'){
            radio.skip(message);
        }
        if(message.content.substr(0,3) === 'top'){
            radio.leaderboard(message);
        }
        if(message.content === ('tendieRegister')){
            
            message.reply("Atempting to register you to tendies.net please wait...");
            tendies.initializePlayer(message);
        }
        if(message.content === ('tendies') || message.content === ('tendos')){
            tendies.printTendies(message);
        }
        if(message.content === ('tendieMine')){
            tendies.mineTendies(message);
        }
        if(message.content.substr(0,4) === ('!rtd')){
            message.reply("rolling a d" +message.content.substr(5,6) + "...");
            message.reply("I rolled a " + Math.floor(Math.random() * parseInt(message.content.substr(5,6)) + 1)); 
        }
        if(message.content.substr(0,7) === ('addGame')){
            fs.appendFile("\games.txt", message.content.substr(8,message.content.length) + "|", function(err) {
                if(err) {
                    return console.log(err);
                }
                message.reply("added " + message.content.substr(8,message.content.length));
            });
        }
        if(message.content === ('pickGame')){
            var games = fs.readFileSync('\games.txt', 'utf8');
            var gameArray = games.split("|");
            if(games.length >0){
                var ranIndex = Math.floor(Math.random() * (gameArray.length-1));
                message.reply("I choose " + gameArray [ ranIndex]);
                

                    
                var logger = fs.createWriteStream('\games.txt', {
                    //flags: 'a' // 'a' means appending (old data will be preserved)
                })

                //now writing everything to the file except the chosen game
                for(var i = 0; i<gameArray.length-1; i++){
                    
                    if(i!=ranIndex){
                        logger.write(gameArray[i]+ "|") ;
                    }

                }
            }
            else{
                message.reply("no games in list!");
            }
            
        }
        if(message.content.startsWith("sqlstoreword")){

            var split = message.content.split("sqlstoreword");

            sql.run("CREATE TABLE IF NOT EXISTS wordStorage (word TEXT)").then(() => {
                sql.run("INSERT INTO wordStorage (word) VALUES (?)", ["willitoverwrite?"]);
                return undefined;
            });
            //otherwise overwrite previous entry
            sql.run(`UPDATE wordStorage SET word = '${split[1]}'`);
    
        }
        if(message.content.startsWith("sqlloadword")){

            sql.get(`SELECT * FROM wordStorage`).then(row => {
                message.reply(`Your word was : ${row.word}`);
            }).catch(() => {
                message.reply("please give me a word first!");
            });
            
            
        } 
        
    }

}

