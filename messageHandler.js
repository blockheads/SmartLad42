//for words.js functions
const words = require('./words.js');
//for radio.js functions
const radio = require('./radio.js');
//for tendies.js functions
const tendies = require('./tendies.js');

var fuckMatt = false;


//module.exports = "public" functions...
module.exports = 
{
    //main function handles a message
    messageHandle: function (message,bot){
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
            radio.stop();
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
            radio.skip();
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
    }

}

