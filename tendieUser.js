//private variables
var busy = false;
var id;
var tendies;

module.exports = {

    tendieUser : function(id,tendies){
        //intializing tendies/id values
        this.id = id;
        this.tendies = tendies;

        //object functions
        return {
            //calls mine after a period of time
            beginMine : function(message){
                //making sure the user is busy now
                busy = true;
                mine().then(function(minedTendies){
                    tendies += minedTendies;
                    message.reply("succesfully mined #" + minedTendies + " tendies!"); 
                    busy = false;
                });
            },
            //getter for tendies
            getTendies : function(){
                return tendies;
            }
        }
    }
    
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