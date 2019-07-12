//write to file
const fs = require('fs');
//for tendie actions
const user = require('./tendieUser.js');

const sqlite3 = require('sqlite3').verbose();

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
            message.reply("you currently have #" + tendieMap.get(message.member.id).getTendies() + " tendies.");
        }
    },
    //initializes the player in users.txt
    initializePlayer : async function(message){
        res = false;
        try{
            res = await this.getUser(message.author.id);
        }
        catch(error){
            return console.log("Failed to register!");
        }
        finally{
            if(!res){
            
                let db = new sqlite3.Database('smartDatabase.db');
            
                //storing our jsons
                tendieUser = new user.TendieUser(message.author);
                
                // insert one row into the langs table
                db.run(`INSERT INTO tendieNet(id, tendieUser) VALUES(?,?)`, [message.author.id,JSON.stringify(tendieUser)], function(err) {
                    if (err) {
                        console.log(err.message);
                        message.reply("Failed to register you to the TendieNet™ please ask your TendieNet™ admin about this error.");
                        return -1;
                    }
                    // get the last insert id
                    console.log(`sucesfully added user has been inserted with rowid ${this.lastID}`);
                    message.reply("Thank you user " + message.author.username + " your private data is now uploaded to the TendieNet™");
                });
                
                // close the database connection
                db.close();
    
            }
            else{
                message.reply("you are already registered to the TendieNet™!");
            }
        } 
    },
    mineTendies : function(message){
        //initializes mining
        tendieMap.get(message.author.id).beginMine(message);
        
    },
    getUser : function(id){

        return new Promise(function(resolve,reject){
        
            let sql = 'SELECT * FROM tendieNet WHERE id = ?'
            // open the database
            let db = new sqlite3.Database('smartDatabase.db');

            db.get(sql,[id],(err,row) => {
                if (err){
                    reject(console.error(err.message));
                }
                else if(!row){
                    reject(console.log("No user registered on tendie database with that user id."));
                }
                else{
                    console.log(row);
                    resolve(JSON.parse(row.tendieUser));
                }
                db.close();
                
            });

        });

    },
    update : function(){
        updateFile();
    }
}

//goes through the file to check that the user isn't registered
function isInitialized(guildmember){

   //checks if user is in tendieMap
   
   //iterate over keys in tendieMap until found or not
   for(var key of tendieMap.keys()){
       if(key === guildmember.id){
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
    var tendieList = fs.readFileSync('./tendie/tendiebox.txt', 'utf8');
    //splitting up the tendie list 
    var tendieArray = tendieList.split("|");
    
    //now storing the data in tendieMap
    for(i=0;i<tendieArray.length/2;i+=2){
        tendieMap.set(tendieArray[i],new user.tendieUser(tendieArray[i],tendieArray[i+1]));
    }
}

//updates the file given the player and information
function updateFile(){
    var logger = fs.createWriteStream('./tendie/tendiebox.txt', {
        //flags: 'a' // 'a' means appending (old data will be preserved)
    })

    //going through the tendie map and setting the file to it
    for(var key of tendieMap.keys()){
        logger.write(key + "|" + tendieMap.get(key).getTendies() + "|");
    }
}
