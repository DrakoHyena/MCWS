module.exports ={
    name: "code",
    syntax: "<text>",
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
    const code = JSON.parse(fs.readFileSync(`config/codes.json`, "utf8"))
const usedcode = JSON.parse(fs.readFileSync(`${settings.dir}/usedcode.json`, "utf8"))
    if(!args[0]){
        send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cWhat code are you redeeming"}]}`)
        return;
        }
        if(!usedcode[msg.body.properties.Sender]){
          usedcode[msg.body.properties.Sender] = {}
          fs.writeFile(`${settings.dir}/usedcode.json`, JSON.stringify(usedcode), (err) => {if (err) console.log(err)})
          }
        if(usedcode[msg.body.properties.Sender][args[0]] == "used"){
          send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cYou already used that code"}]}`)
          return;
        }
        if(code[args[0]]){
        if(code[args[0]].uses < 1){
        send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThat code ran out of uses"}]}`)
        return;
        }
        for(let i = 100; i > 0; i--){
        if(code[args[0]][`cmd${i}`]){
          send(`${code[args[0]][`cmd${i}`]}`)
        }
        if(code[args[0]][`givecmd${i}`]){
          send(`give "${msg.body.properties.Sender}" ${code[args[0]][`givecmd${i}`]}`)
        }
        if(code[args[0]][`scorecmd${i}`]){
          send(`scoreboard players add "${msg.body.properties.Sender}" ${code[args[0]][`scorecmd${i}`]}`)
        }
        }
        code[args[0]].uses = code[args[0]].uses - 1
        fs.writeFile(`config/codes.json`, JSON.stringify(code), (err) => {if (err) console.log(err)})
        usedcode[msg.body.properties.Sender][args[0]] = "used"
        fs.writeFile(`${settings.dir}/usedcode.json`, JSON.stringify(usedcode), (err) => {if (err) console.log(err)})
        send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§gSuccessfully used code ${args[0]}"}]}`)
        }else{
          send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThat code isnt valid"}]}`)
        }
        }
    }