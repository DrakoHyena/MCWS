module.exports ={
name: "1ping",
syntax: "",
//useable in creative or survival
permission: "creative",

execute(send, fs, msg, args, command, client, settings){
// CODE TO CHECK IF IT CAN BE USED IN SURVIVAL --DO NOT CHANGE-- //
let name = []
let permission = []
permission.push(client.commands.map(plugins => plugins.permission));
name.push(client.commands.map(plugins => plugins.name));
for(let i  = 0; i < name[0].length; i++){
if(msg.body.properties.PlayerGameMode == 0 && command == name[0][i] && permission[0][i] == "creative"){
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThis command is not available in survival"}]}`)
    return;
    }
}
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