module.exports ={
    name: "warp",
    syntax: "<optional: location>",
    //useable in creative or survival
    permission: "survival",
    
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
    const warp = JSON.parse(fs.readFileSync(`config/warps.json`, "utf8"))
    let warplist =  Object.keys(warp).map((key) => [key, warp[key]]);
    if(!args[0]){
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§g----Warp Locations----"}]}`)
    for(let i = 0; i < warplist.length; i++){
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§g- ${warplist[i][0]}"}]}`)
    }
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§7§oType ${settings.prefix}warp <location>"}]}`)
    }
    if(args[0]){
    for(let i = 0; i < warplist.length; i++){
    if(args[0] == warplist[i][0]){
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§gWarped to ${warplist[i][0]}"}]}`)
    send(`tp "${msg.body.properties.Sender}" ${warplist[i][1]}`)
    return;
    }
    }
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThe warp ${args[0]} doesnt exist"}]}`)
    }        }
    }