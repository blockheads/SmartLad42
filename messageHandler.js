//for words.js functions
const words = require('./words.js');
//for radio.js functions
const radio = require('./radio.js');
//for tendies.js functions
const tendies = require('./tendie/tendies.js');
//write to files
const fs = require('fs');
const fetch = require('node-fetch');

var fuckMatt = false;

// tendie commands
COMMANDS = {
    'what is my avatar': tendieCommand,
    'play': tendieCommand,
    'volume': tendieCommand,
    'god says...': tendieCommand,
    'scotsman': tendieCommand,
    'learn': tendieCommand,
    'start radio': tendieCommand,
    'stop': tendieCommand,
    'matt': tendieCommand,
    'seig': tendieCommand,
    'scream': tendieCommand,
    'set swamp': tendieCommand,
    'skip': tendieCommand,
    'top': tendieCommand,
    'register': tendieCommand,
    'tendies': tendieCommand,
    'mine': tendieCommand,
    '!rtd': tendieCommand,
    'add game': tendieCommand,
    'pick game': tendieCommand,
    'translate cole': tendieCommand
}

//module.exports = "public" functions...
module.exports =
{
    //main function handles a message
    messageHandle: async function (message, bot) {
        let messageContent = (message.content).toLowerCase();
        for (var key in COMMANDS) {
            if (messageContent.startsWith(key)) {
                tendieCommand(message, bot);
            }
        }

    }

}

async function tendieCommand(message, bot) {
    let messageContent = (message.content).toLowerCase();
    if (messageContent === ('register')) {

        message.reply("Atempting to register you to tendies.net please wait...");
        try {
            tendies.initializePlayer(message);
        }
        catch (error) {
            message.reply("Failed to initialize you to the net!");
        }

        return;
    }

    tendieUser = false;

    try {
        tendieUser = await tendies.getUser(message.author.id);
    }
    finally {
        if (!tendieUser) {
            message.reply("Sorry " + message.author.username + " you aren't registered on the TendieNet™, please register with 'register'.");
            return;
        }
        else {
            if (messageContent === 'what is my avatar') {
                //reply with users avatar
                message.reply(message.author.avatarURL);
            }
            else if (messageContent.substr(0, 4) === 'play') {
                bot.user.setGame(message.content.substr(4, message.content.length));
            }
            else if (messageContent.substr(0, 6) === 'volume') {
                radio.volume(message);
            }
            //gw
            else if (messageContent.startsWith('god says...')) {
                words.godSays(message);
            }
            //scotsman insults
            else if (messageContent.startsWith('scotsman')) {
                words.scotsman(message);
            }

            else if (messageContent.substr(0, 5) === 'learn') {
                radio.learnSong(message);
            }
            else if (messageContent === 'start radio') {
                radio.startRadio(message, bot);
            }
            else if (messageContent.startsWith('stop')) {
                radio.stop(message, bot);
            }
            else if (messageContent === 'matt') {
                Matt = !Matt;
            }
            else if (messageContent.includes('scream')) {
                console.log("message:" + messageContent);
                radio.scream(message, bot);
            }
            else if (messageContent === 'set swamp') {
                radio.setSwamp(message, bot);
            }
            else if (messageContent === 'skip') {
                radio.skip(message, bot);
            }
            else if (messageContent.substr(0, 3) === 'top') {
                radio.leaderboard(message);
            }
            else if (messageContent === ('tendies') || messageContent === ('tendos')) {
                tendies.printTendies(message);
            }
            else if (messageContent === ('mine')) {
                tendies.mineTendies(message);
            }
            else if (messageContent.substr(0, 4) === ('!rtd')) {
                message.reply("rolling a d" + message.content.substr(5, 6) + "...");
                message.reply("I rolled a " + Math.floor(Math.random() * parseInt(message.content.substr(5, 6)) + 1));
            }
            else if (messageContent.substr(0, 7) === ('add game')) {
                fs.appendFile("\games.txt", message.content.substr(8, message.content.length) + "|", function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    message.reply("added " + message.content.substr(8, message.content.length));
                });
            }
            else if (messageContent === ('pick game')) {
                var games = fs.readFileSync('\games.txt', 'utf8');
                var gameArray = games.split("|");
                if (games.length > 0) {
                    var ranIndex = Math.floor(Math.random() * (gameArray.length - 1));
                    message.reply("I choose " + gameArray[ranIndex]);



                    var logger = fs.createWriteStream('\games.txt', {
                        //flags: 'a' // 'a' means appending (old data will be preserved)
                    })

                    //now writing everything to the file except the chosen game
                    for (var i = 0; i < gameArray.length - 1; i++) {

                        if (i != ranIndex) {
                            logger.write(gameArray[i] + "|");
                        }

                    }
                }
                else {
                    message.reply("no games in list!");
                }
            }
            // check if message starts w/ 'translate cole'
            else if (messageContent.startsWith('translate cole')) {
                // get the last message from user 'rhombuslover'

                // get guild member from username rhombus


                // Fetch last 100 messages from each channel, and get the first message from cole

                message.reply("Translating, note this operation takes quite some time... Please be patient :)");

                let latestMessage = null;
                const userId = '336710247928561664';
                bot.channels.forEach(channel => {
                    if (!channel || channel.type !== 'text') {
                        return;
                    }

                    channel.fetchMessages({ limit: 100 }).then(messages => {

                        const userMessages = messages.filter(msg => msg.author.id === userId);

                        if (userMessages.size > 0) {
                            const userLastMessage = userMessages.first();
                            // Compare with the currently stored latest message
                            if (!latestMessage || userLastMessage.createdTimestamp > latestMessage.createdTimestamp) {
                                latestMessage = userLastMessage;
                            }
                        }

                    });
                    // let temp_member = guild.members.find(member => member.user.id === '336710247928561664');
                    // if (temp_member) {
                    //     member = temp_member;
                    // }


                });

                setTimeout(() => {
                    if (latestMessage) {
                        var cole_speak = latestMessage.content;
                        message.reply(`Latest message from Cole: ${cole_speak} in channel ${latestMessage.channel.name}`);
                        var chat_bot_context = "Please translate this message from cole into english, he speaks in english slang, be explicit and concise in your response: '" + cole_speak + "'";

                        // query with input as remaining of message
                        query({
                            inputs: chat_bot_context
                        }).then((response) => {
                            // reply with response
                            if (response.error) {
                                message.reply("Sorry, I couldn't translate that message from cole " + response.error);
                            }

                            const context_2 = "please finish your previous response: " + response[0].generated_text;
                            query({
                                inputs: context_2
                            }).then((response2) => {
                                message.reply("Sorry you're having trouble understanding, let me help translate the cole-speak for you: " + response2[0].generated_text.substr("please finish your previous response: ".length + chat_bot_context.length));
                            });

                        });
                    } else {
                        console.log(`No messages found from <@${userId}> in any channel.`);
                        message.reply("I couldn't find any message from cole within the last 100 mesages, sorry pal.");
                        return;
                    }
                }, 5000); // Adjust timeout as needed based on your needs

            }
        }


        async function query(data) {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct",
                {
                    headers: {
                        Authorization: "Bearer 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",
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify(data),
                }
            );
            const result = await response.json();
            console.log(result);
            return result;
        }

    }
}

