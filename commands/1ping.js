module.exports ={
name: "1ping",
syntax: "",
//useable in creative, survival, or adventure. adventure commands can be use in any gm, survival is survival and creative, and creative is just creative
permission: "creative",
//if it can be used or not, true/false
enabled: true,

execute(send, fs, msg, args, command, client, settings, permcheck){
if(permcheck() == "stop") return;
///// Predone functions/vars /////
/*
send("<text>") - sends a command to mc
fs - file system
msg - minecraft message packet
args - an array of what the minecraft user said (doesnt include the command part (like the !help part ))
command - the command they used (like the !help part)
client - discordjs bot client
settings - the settings in settings.json
*/
/////////////////////////////////////////////    \/ Your code below \/    /////////////////////////////////////////////
send("say pong")
    }
}