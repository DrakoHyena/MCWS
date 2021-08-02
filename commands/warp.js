module.exports ={
    name: "warp",
    syntax: "<optional: location>",
    //useable in creative, survival, or adventure. adventure commands can be use in any gm, survival is survival and creative, and creative is just creative
    permission: "adventure",
    
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