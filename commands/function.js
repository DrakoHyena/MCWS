module.exports ={
    name: "function",
    syntax: "<custom function>",
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
    if(!msg.body.properties.PlayerGameMode == 1){
        send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThis command is not available in survival"}]}`)
        return;
    }
    if(!args[0]){
      send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cWhat custom function are you running"}]}`)
      return;
    }
    if (fs.existsSync(`functions/${args[0]}.txt`)){
    let data = fs.readFileSync(`functions/${args[0]}.txt`, "utf8")
    data = data.replace(/\r/g, "").split('\n')
    for (let i = 0; i < data.length; i++){
    send(`${data[i]}`)
    }
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§gSuccesfully ran custom function '${args[0]}'"}]}`)
    }else{
      send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThat custom function does not exist"}]}`)
    }
        }
    }