//private variables
var busy = false;
var id;
var tendies;

// avast yet what is a tendie user?


module.exports = {
    TendieUser :class {

        constructor(user){
            this.buildUser(user);
        }
    
        buildUser(user){
            this.id = user.id;
            this.username = user.username;
            this.createdTime = Date.now();
            this.avatar = user.avatar;
            this.ownedSongs = [];
        }
    },

    tendieUser : function(id,tendies){
        //intializing tendies/id values
        this.id = id;
        this.tendies = tendies;

        //object functions
        return {
            //calls mine after a period of time
            beginMine : function(message){
                if(!busy){
                    //making sure the user is busy now
                    busy = true;
                    message.reply("You begin to slave away in the mines");
                    mine().then(function(minedTendies){
                        tendies += minedTendies;
                        message.reply("succesfully mined #" + minedTendies + " tendies!"); 
                        busy = false;
                    });
                }
                else{
                    message.reply("You are already in the mines!");
                }
            },
            //getter for tendies
            getTendies : function(){
                return tendies;
            }
        }
    },
    
    
}

function mine(){
    //after a set interval returns a interval adding the tendings
    var promise = new Promise(function(resolve,reject){
        setTimeout(function(){
            //returns a random number from 0-99
            resolve(Math.random() * 100);
        },10000);
    });
    return promise; 
}