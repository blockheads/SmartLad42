//for words.js functions
const words = require('./words.js');
//for radio.js functions
const radio = require('./radio.js');
//for tendies.js functions
const tendies = require('./tendie/tendies.js');
//write to files
const fs = require('fs');

var fuckMatt = false;


//module.exports = "public" functions...
module.exports = 
{
    //main function handles a message
    messageHandle: async function (message,bot){
        let messageContent = (message.content).toLowerCase();

        if(fuckMatt && message.author.id==='193186571615207424'){
            message.delete();
            message.reply("fuck you matt");
        }
        if(messageContent === 'what is my avatar'){
            //reply with users avatar
            message.reply(message.author.avatarURL);
        }
        if(messageContent.includes('hitler')){
            message.reply("Seig Heil");
        }
        if(messageContent.substr(0,4) === 'play'){
            bot.user.setGame(message.content.substr(4,message.content.length));
        }
        if(messageContent.substr(0,6) === 'volume'){
            radio.volume(message);
        }
        //gw
        if (messageContent.startsWith('god says...')) {
            words.godSays(message);
        }
        //scotsman insults
        if(messageContent.startsWith('scotsman'))
        {
            words.scotsman(message);
        }

        if(messageContent.substr(0,5) === 'learn'){
            radio.learnSong(message);
        }
        if(messageContent === 'start radio'){
            radio.startRadio(message,bot);
        }
        if(messageContent === 'stop radio' || messageContent === 'stop screaming'){
            radio.stop(message,bot);
        }
        if(messageContent === 'fuck matt'){
            fuckMatt=!fuckMatt;
        }
        if(messageContent.includes('seig')) {
        message.reply("HEIL");
        }
        if(messageContent.includes('scream')){
            radio.scream(message,bot);
        }
        if(messageContent === 'set swamp'){
            radio.setSwamp(message,bot);
        }
        if(messageContent === 'skip'){
            radio.skip(message);
        }
        if(messageContent.substr(0,3) === 'top'){
            radio.leaderboard(message);
        }
        if(messageContent === ('tendie register')){
            
            message.reply("Atempting to register you to tendies.net please wait...");
            tendies.initializePlayer(message);
        }
        if(messageContent === ('tendies') || messageContent === ('tendos')){
            tendies.printTendies(message);
        }
        if(messageContent === ('tendie mine')){
            tendies.mineTendies(message);
        }
        if(messageContent.substr(0,4) === ('!rtd')){
            message.reply("rolling a d" +message.content.substr(5,6) + "...");
            message.reply("I rolled a " + Math.floor(Math.random() * parseInt(message.content.substr(5,6)) + 1)); 
        }
        if(messageContent.substr(0,7) === ('add game')){
            fs.appendFile("\games.txt", message.content.substr(8,message.content.length) + "|", function(err) {
                if(err) {
                    return console.log(err);
                }
                message.reply("added " + message.content.substr(8,message.content.length));
            });
        }
        if(messageContent === ('pick game')){
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
        
    }

}

