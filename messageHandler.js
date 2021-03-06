//for words.js functions
const words = require('./words.js');
//for radio.js functions
const radio = require('./radio.js');
//for tendies.js functions
const tendies = require('./tendie/tendies.js');
//write to files
const fs = require('fs');

var fuckMatt = false;

// tendie commands
COMMANDS = {'what is my avatar' : tendieCommand,
            'play'              : tendieCommand,
            'volume'            : tendieCommand,
            'god says...'       : tendieCommand,
            'scotsman'          : tendieCommand,
            'learn'             : tendieCommand,
            'start radio'       : tendieCommand,
            'stop'              : tendieCommand,
            'matt'              : tendieCommand,
            'seig'              : tendieCommand, 
            'scream'            : tendieCommand,
            'set swamp'         : tendieCommand,
            'skip'              : tendieCommand,
            'top'               : tendieCommand,
            'register'          : tendieCommand,
            'tendies'           : tendieCommand,
            'mine'              : tendieCommand,
            '!rtd'              : tendieCommand,
            'add game'          : tendieCommand,
            'pick game'         : tendieCommand,} 

//module.exports = "public" functions...
module.exports = 
{
    //main function handles a message
    messageHandle: async function (message,bot){
        let messageContent = (message.content).toLowerCase();

        // specific methods to handle
        if(Matt && message.author.id==='193186571615207424'){
            message.delete();
            message.reply("Bad matt.");
        }

        for(var key in COMMANDS){

            if (messageContent.startsWith(key)){
                return COMMANDS[key](message,bot);
            }
        }
       
        
    }

}

async function tendieCommand(message,bot){
    let messageContent = (message.content).toLowerCase();

   
    if(messageContent === ('register')){
        
        message.reply("Atempting to register you to tendies.net please wait...");
        try{
            tendies.initializePlayer(message);
        }
        catch(error){
            message.reply("Failed to initialize you to the net!");
        }
        
        return;
    }

    tendieUser = false;

    try{
        tendieUser = await tendies.getUser(message.author.id);
    }
    finally{
        if(!tendieUser){
            message.reply("Sorry " + message.author.username + " you aren't registered on the TendieNet™, please register with 'register'.");
            return;
        }
        else{
            if(messageContent === 'what is my avatar'){
                //reply with users avatar
                message.reply(message.author.avatarURL);
            }
            else if(messageContent.substr(0,4) === 'play'){
                bot.user.setGame(message.content.substr(4,message.content.length));
            }
            else if(messageContent.substr(0,6) === 'volume'){
                radio.volume(message);
            }
            //gw
            else if (messageContent.startsWith('god says...')) {
                words.godSays(message);
            }
            //scotsman insults
            else if(messageContent.startsWith('scotsman'))
            {
                words.scotsman(message);
            }
        
            else if(messageContent.substr(0,5) === 'learn'){
                radio.learnSong(message);
            }
            else if(messageContent === 'start radio'){
                radio.startRadio(message,bot);
            }
            else if(messageContent.startsWith('stop')){
                radio.stop(message,bot);
            }
            else if(messageContent === 'matt'){
                Matt=!Matt;
            }
            else if(messageContent.includes('scream')){
                console.log("message:" + messageContent);
                radio.scream(message,bot);
            }
            else if(messageContent === 'set swamp'){
                radio.setSwamp(message,bot);
            }
            else if(messageContent === 'skip'){
                radio.skip(message,bot);
            }
            else if(messageContent.substr(0,3) === 'top'){
                radio.leaderboard(message);
            }
            else if(messageContent === ('tendies') || messageContent === ('tendos')){
                tendies.printTendies(message);
            }
            else if(messageContent === ('mine')){
                tendies.mineTendies(message);
            }
            else if(messageContent.substr(0,4) === ('!rtd')){
                message.reply("rolling a d" +message.content.substr(5,6) + "...");
                message.reply("I rolled a " + Math.floor(Math.random() * parseInt(message.content.substr(5,6)) + 1)); 
            }
            else if(messageContent.substr(0,7) === ('add game')){
                fs.appendFile("\games.txt", message.content.substr(8,message.content.length) + "|", function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    message.reply("added " + message.content.substr(8,message.content.length));
                });
            }
            else if(messageContent === ('pick game')){
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
}

