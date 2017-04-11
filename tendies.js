//write to file
const fs = require('fs');

//stores guildMembers and tendies
var tendieMap = new Map();
//now calling updateMap to initialze the tendies
updateMap();

module.exports = {
    

    //finds the amount of tendies a user has, given user
    printTendies : function(message){
        console.log("printing tendies");
        //gets the users tendies if initialized
        if(isInitialized(message.member)){
            console.log(tendieMap);
            message.reply("you currently have" + "# " + tendieMap.get(message.member.displayName) + " tendies.");
        }
    },
    //initializes the player in users.txt
    initializePlayer : function(message){
    
        if(!isInitialized(message.member)){
            
            //stores username|#tendies
            fs.appendFile("tendiebox.txt", message.member.displayName + "|0|", function(err) {
                if(err) {
                    return console.log(err);
                }
                message.reply("new user registered to tendies.net!");
                //updating the tendieMap
                updateMap();
            });

        }
        else{
            message.reply("you are already registered to tendies.net");
        }
    }
}

//goes through the file to check that the user isn't registered
function isInitialized(guildmember){

   //checks if user is in tendieMap
   
   //iterate over keys in tendieMap until found or not
   for(var key of tendieMap.keys()){
       if(key === guildmember.displayName){
           return true;
       }
   }
   console.log("not registered");
   return false;

}

//gets the current file to update the map
function updateMap(){
    //nullifying tendieMap to rewrite it
    tendieMap = new Map();
    //getting the tendielist file  
    var tendieList = fs.readFileSync('tendiebox.txt', 'utf8');
    //splitting up the tendie list 
    var tendieArray = tendieList.split("|");
    
    //now storing the data in tendieMap
    for(i=0;i<tendieArray.length/2;i+=2){
        tendieMap.set(tendieArray[i],tendieArray[i+1]);
    }
}

