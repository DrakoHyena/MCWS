module.exports ={
    name: "redeem",
    syntax: "<optional: kit/rank/etc>",
    //useable in creative, survival, or adventure. adventure commands can be use in any gm, survival is survival and creative, and creative is just creative
    permission: "adventure",
    //if it can be used or not
    enabled: true,
    
    execute(send, fs, msg, args, command, client, settings, permcheck){
      if(permcheck() == "stop") return;
    ///// Predone functions/vars /////
    /*
    send("<text>") - sends a comman to mc
    fs - file system
    msg - minecraft message packet
    args - an array of what the minecraft user said (doesnt include the command part (like the !help part ))
    command - the command they used (like the !help part)
    client - discordjs bot client
    settings - the settings in settings.json
    */
    /////////////////////////////////////////////    \/ Your code below \/    /////////////////////////////////////////////
    const kits = JSON.parse(fs.readFileSync(`config/redeem.json`, "utf8"))
    const cd = JSON.parse(fs.readFileSync(`${settings.dir}/cooldown.json`, "utf8"))
    if(!cd[msg.body.properties.Sender]){
        cd[msg.body.properties.Sender] = {}
      }
    let kitlist = Object.keys(kits).map((key) => [key, kits[key]])
    let time = new Date().getTime()
    if(!args[0]){
      send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§g----Redeemables----"}]}`)
      for(let i = 0; i < kitlist.length; i++){
      send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§g- ${kitlist[i][0]} §e(${kitlist[i][1].slice(1)})"}]}`)
      }
      send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§7§oType ${settings.prefix}redeem <thing>"}]}`)
    return;
    }
    for(let i = 0; i < kitlist.length; i++){
    if(kitlist[i][0]){
    if(kitlist[i][0] == args[0]){
    if(!cd[msg.body.properties.Sender][kitlist[i][0]]){
    cd[msg.body.properties.Sender][kitlist[i][0]] = 0
    fs.writeFile(`${settings.dir}/cooldown.json`, JSON.stringify(cd), (err) => {if (err) console.log(err)})
    }
    if(cd[msg.body.properties.Sender][kitlist[i][0]] < time){
    cd[msg.body.properties.Sender][kitlist[i][0]] = kitlist[i][1][0] + time
    fs.writeFile(`${settings.dir}/cooldown.json`, JSON.stringify(cd), (err) => {if (err) console.log(err)})
    for(let b = 1; b < kitlist[i][1].length; b++){
    send(`give @a[name="${msg.body.properties.Sender}",tag=${args[0]}] ${kitlist[i][1][b]}`)
    }
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§gReedemed successfully!§e If you didnt recive anything youre not able to claim that"}]}`)
    return;
    }else{
    if(cd[msg.body.properties.Sender][kitlist[i][0]]-time >= 31536000000){
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThat is still on cool down\n§o${Math.round((cd[msg.body.properties.Sender][kitlist[i][0]]-time)/31536000000)} years left"}]}`)
    }else if(cd[msg.body.properties.Sender][kitlist[i][0]]-time >= 2628000000){
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThat is still on cool down\n§o${Math.round((cd[msg.body.properties.Sender][kitlist[i][0]]-time)/2628000000)} months left"}]}`)
    }else if(cd[msg.body.properties.Sender][kitlist[i][0]]-time >= 604800000){
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThat is still on cool down\n§o${Math.round((cd[msg.body.properties.Sender][kitlist[i][0]]-time)/604800000)} weeks left"}]}`)
    }else if(cd[msg.body.properties.Sender][kitlist[i][0]]-time >= 86400000){
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThat is still on cool down\n§o${Math.round((cd[msg.body.properties.Sender][kitlist[i][0]]-time)/86400000)} days left"}]}`)
    }else if(cd[msg.body.properties.Sender][kitlist[i][0]]-time >= 3600000){
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThat is still on cool down\n§o${Math.round((cd[msg.body.properties.Sender][kitlist[i][0]]-time)/3600000)} hours left"}]}`)
    }else if(cd[msg.body.properties.Sender][kitlist[i][0]]-time >= 60000){
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThat is still on cool down\n§o${Math.round((cd[msg.body.properties.Sender][kitlist[i][0]]-time)/60000)} hours left"}]}`)
    }else if(cd[msg.body.properties.Sender][kitlist[i][0]]-time >= 1000){
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThat is still on cool down\n§o${Math.round((cd[msg.body.properties.Sender][kitlist[i][0]]-time)/1000)} seconds left"}]}`)
    }
    return;
    }
    }
    }
    }
    send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cRedeem '${args[0]}' doest exist"}]}`)
        }
    }