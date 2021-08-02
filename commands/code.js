module.exports ={
    name: "code",
    syntax: "<text>",
    //useable in creative, survival, or adventure. adventure commands can be use in any gm, survival is survival and creative, and creative is just creative
    permission: "adventure",
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