module.exports ={
name: "help",
syntax: "",
//creative or survival - wont appear in the survival help menu in set to creative will appear in both in bot if in survival
permission: "survival",

execute(send, fs, msg, args, commmand, client, settings){
//    \/ Your code below \/    //

/*
send("<text>") - sends a command to mc
fs - file system
msg - minecraft message packet
args - an array of what the minecraft user said (doesnt include the command part (like the !help part ))
command - the command they used (like the !help part)
client - discordjs bot client
settings - the settings in settings,json
*/
let names = [] //make an array to store the names of commands
let syntax = [] //same as names but for the syntax
let permission = [] //same as names but for permissions
names.push(client.commands.map(plugins => plugins.name)); //store name data
syntax.push(client.commands.map(plugins => plugins.syntax)); //store syntax data
permission.push(client.commands.map(plugins => plugins.permission)); //store permissions data
send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§g-----Custom Commands-----"}]}`) //sends the header to the help command
for(let i  = 0; i < names[0].length; i++){ //loop through all the names
if(permission[0][i] == "survival" && msg.body.properties.PlayerGameMode == 0){ //if it can be used in survival send it
send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§g- ${settings.prefix}${names[0][i]} ${syntax[0][i]}"}]}`)//send the messages
}else if(msg.body.properties.PlayerGameMode == 1){
send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§g- ${settings.prefix}${names[0][i]} ${syntax[0][i]}"}]}`)//send the messages
}
}
        }
    }