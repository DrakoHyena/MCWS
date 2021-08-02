module.exports ={
    name: "function",
    syntax: "<custom function>",
    //useable in creative, survival, or adventure. adventure commands can be use in any gm, survival is survival and creative, and creative is just creative
    permission: "creative",
    //if it can be used or not
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
    if(!data[i] == ""){
    if(!data[i].startsWith("#")){
    send(`${data[i]}`)
    }
    }
    }
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§gSuccesfully ran custom function '${args[0]}'"}]}`)
    }else{
      send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThat custom function does not exist"}]}`)
    }
        }
    }