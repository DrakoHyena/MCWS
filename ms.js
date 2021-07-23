'use strict';
const fs = require('fs')
const Discord = require('discord.js')
const settings = JSON.parse(fs.readFileSync(`config/settings.json`, "utf8"))

//SETTINGS// -- EDIT THEM IN config/settings.json
const prefix = settings.prefix
//prefix ingame and for the bot

let dir = settings.dir
//the directory (folder) for the data base DO NOT PUT A SLASH AT THE END OF THE STRING

const webhook = eval(settings.webhook)
//VIDEO ON HOW TO CHANGE WEB HOOK SETTINGS - https://www.youtube.com/watch?v=hcWoDfsGpq8&ab_channel=CedrickAlegroso

const bottoken = settings.bottoken
//the token for your discord bot

const channelid = settings.channelid
//the channel id of the channel the webhook is in

const port = settings.port
//the port that you connect to

const color = settings.color
//the colors for things (like embeds)

const color2 = settings.color2
//the color for discord messages in game 

const chatremove = settings.chatremove
//how long (im ms) till a persons spamming strikes get set to 0

const maxstrikes = settings.maxstrikes
//how many spamming strikes someone can get before they get muted

const mutetime = settings.mutetime //10000 = 10 seconds
//how long a person is muted for (in ms)

const addedtime = settings.addedtime
//the added muted time each time a person gets muted
////////////




if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
  fs.writeFile(`${dir}/db.json`, "{}", function (err) {
    if (err) return console.log(err);
  });
  fs.writeFile(`${dir}/usedcode.json`, "{}", function (err) {
    if (err) return console.log(err);
  });
  fs.writeFile(`${dir}/cooldown.json`, "{}", function (err) {
    if (err) return console.log(err);
  });
}
if (!fs.existsSync("config")){
  fs.mkdirSync("config");
  fs.writeFile(`config/codes.json`, "{}", function (err) {
    if (err) return console.log(err);
  });
  fs.writeFile(`config/warps.json`, "{}", function (err) {
    if (err) return console.log(err);
  });
  fs.writeFile(`config/redeem.json`, "{}", function (err) {
    if (err) return console.log(err);
  });
}
if (!fs.existsSync("functions")){
  fs.mkdirSync("functions");
}
const db = JSON.parse(fs.readFileSync(`${dir}/db.json`, "utf8"))
const code = JSON.parse(fs.readFileSync(`config/codes.json`, "utf8"))
const usedcode = JSON.parse(fs.readFileSync(`${dir}/usedcode.json`, "utf8"))
const warp = JSON.parse(fs.readFileSync(`config/warps.json`, "utf8"))
const kits = JSON.parse(fs.readFileSync(`config/redeem.json`, "utf8"))
const cd = JSON.parse(fs.readFileSync(`${dir}/cooldown.json`, "utf8"))

const chatted = new Set();
const muted = new Set();


const WebSocket = require('ws')
const uuid = require('uuid');
const { Console } = require('console');
const { send } = require('process');
const client = new Discord.Client()
client.login(bottoken)
client.on("ready", () => {
  client.user.setPresence({
    activity: { name: " Minecraft" },
    status: "idle",
  });
});


console.log(`Ready. In Minecraft, type /connect localhost:${port}`)
const wss = new WebSocket.Server({ port: `${port}` })
wss.on('connection', socket => {
  console.log('Connected')
  const sendQueue = []        
  const awaitedQueue = {}    
/*ALL EVENTS
AgentCommand AgentCreated BlockBrocken BlockPlaced BossKilled EntitySpawned ItemAcquired ItemCrafted ItemDestroyed ItemDropped ItemUsed MobInteracted
MobKilled PlayerDied PlayerJoin PlayerLeave PlayerMessage PlayerTeleported PlayerTransform PlayerTravelled RawEvent SlashCommandExecuted
*/
let eventarray = ["PlayerMessage"]
  for(let i = 0; eventarray.length > i; i++){
  socket.send(JSON.stringify({
    "header": {
      "version": 1,                     
      "requestId": uuid.v4(),           
      "messageType": "commandRequest",  
      "messagePurpose": "subscribe"     
    },
    "body": {
      "eventName": eventarray[i]      
    },
  }))
  console.log(`[EVENTS] Loaded ${eventarray[i]} event`)
  }
  socket.send(JSON.stringify({
    "header": {
      "version": 1,                     
      "requestId": uuid.v4(),          
      "messageType": "commandRequest", 
      "messagePurpose": "unsubscribe"    
    },
    "body": {
      "eventName": "SlashCommandExecuted"    
    },
  }))
  socket.on('message', packet => {
    const msg = JSON.parse(packet)
    if(!msg.body.eventName == undefined) console.log(`[EVENTS] ${msg.body.eventName} event fired`)
switch(msg.body.eventName){
case 'PlayerMessage':
  if(msg.body.properties.Sender == "External") return;
  if(!db[msg.body.properties.Sender]){
    db[msg.body.properties.Sender] = {"strikes":0,"addedtime":0}
  }

  if(!cd[msg.body.properties.Sender]){
    cd[msg.body.properties.Sender] = {}
  }

      if(msg.body.properties.Sender == "External"){return;}
      if(!db[msg.body.properties.Sender].muted) db[msg.body.properties.Sender].muted = "false"
      fs.writeFile(`${dir}/db.json`, JSON.stringify(db), (err) => {if (err) console.log(err)})
      if (muted.has(msg.body.properties.Sender)) {
        
      if(db[msg.body.properties.Sender].muted == "false"){
      send(`ability "${msg.body.properties.Sender}" mute true`)
      send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cYou have been muted automatically for spamming"}]}`)
      db[msg.body.properties.Sender].muted = "true"
fs.writeFile(`${dir}/db.json`, JSON.stringify(db), (err) => {if (err) console.log(err)})
      }
      setTimeout(() => {
      if(db[msg.body.properties.Sender].muted == "true"){
      muted.delete(msg.body.properties.Sender);
      send(`ability "${msg.body.properties.Sender}" mute false`)
      send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§gYou have been unmuted"}]}`)
      db[msg.body.properties.Sender].addedtime = db[msg.body.properties.Sender].addedtime + addedtime
      db[msg.body.properties.Sender].muted = "false"
      fs.writeFile(`${dir}/db.json`, JSON.stringify(db), (err) => {if (err) console.log(err)})
      }
      }, mutetime+db[msg.body.properties.Sender].addedtime)
      }
      if (chatted.has(msg.body.properties.Sender)) {
db[msg.body.properties.Sender].strikes += 1
fs.writeFile(`${dir}/db.json`, JSON.stringify(db), (err) => {if (err) console.log(err)})
if(db[msg.body.properties.Sender].strikes >= maxstrikes - 1){
muted.add(msg.body.properties.Sender);
}
      } else {
        db[msg.body.properties.Sender].strikes = 0
        fs.writeFile(`${dir}/db.json`, JSON.stringify(db), (err) => {if (err) console.log(err)})

    chatted.add(msg.body.properties.Sender);
    setTimeout(() => {
      chatted.delete(msg.body.properties.Sender);
    }, chatremove);
}
      webhook.send(`${msg.body.properties.Message.replace(/@|(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)/g, '~~removed~~')}`, {username: `${msg.body.properties.Sender}`,});
      if(!msg.body.properties.Message.startsWith(prefix)){return;}
      let args = msg.body.properties.Message.slice(prefix.length).split(/ +/);
      let command = args.shift().toLowerCase();
switch(command){
  case "redeem":
let kitlist = Object.keys(kits).map((key) => [key, kits[key]])
let time = new Date().getTime()
if(!args[0]){
  send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§g----Redeemables----"}]}`)
  for(let i = 0; i < kitlist.length; i++){
  send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§g- ${kitlist[i][0]} §e(${kitlist[i][1].slice(1)})"}]}`)
  }
  send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§7§oType ${prefix}redeem <thing>"}]}`)
return;
}
for(let i = 0; i < kitlist.length; i++){
if(kitlist[i][0]){
if(kitlist[i][0] == args[0]){
if(!cd[msg.body.properties.Sender][kitlist[i][0]]){
cd[msg.body.properties.Sender][kitlist[i][0]] = 0
fs.writeFile(`${dir}/cooldown.json`, JSON.stringify(cd), (err) => {if (err) console.log(err)})
}
if(cd[msg.body.properties.Sender][kitlist[i][0]] < time){
cd[msg.body.properties.Sender][kitlist[i][0]] = kitlist[i][1][0] + time
fs.writeFile(`${dir}/cooldown.json`, JSON.stringify(cd), (err) => {if (err) console.log(err)})
for(let b = 1; b < kitlist[i][1].length; b++){
  console.log(kitlist[i][1][b])
send(`give @a[name="${msg.body.properties.Sender}",tag=${args[0]}] ${kitlist[i][1][b]}`)
}
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
}else{
i = kitlist.length + 1
send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§c${args[0]} doest exist"}]}`)
return;
}
}
send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§gReedemed successfully!§e If you didnt recive anything youre not able to claim that"}]}`)
  break;    
  case "code":
if(!args[0]){
send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cWhat code are you redeeming"}]}`)
return;
}
if(!usedcode[msg.body.properties.Sender]){
  usedcode[msg.body.properties.Sender] = {}
  fs.writeFile(`${dir}/usedcode.json`, JSON.stringify(usedcode), (err) => {if (err) console.log(err)})
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
fs.writeFile(`${dir}/usedcode.json`, JSON.stringify(usedcode), (err) => {if (err) console.log(err)})
send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§gSuccessfully used code ${args[0]}"}]}`)
}else{
  send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThat code isnt valid"}]}`)
}
    break;
case "function":
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
break;
case "warp":
let warplist =  Object.keys(warp).map((key) => [key, warp[key]]);
if(!args[0]){
send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§g----Warp Locations----"}]}`)
for(let i = 0; i < warplist.length; i++){
send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§g- ${warplist[i][0]}"}]}`)
}
send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§7§oType ${prefix}warp <location>"}]}`)
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
}
break;
case "help":
  if(msg.body.properties.PlayerGameMode == 1){
  send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§g-----Custom Commands-----\n- help\n- redeem\n- code <code>\n- function <custom function>\n- warp"}]}`)
  }else{
  send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§g-----Custom Commands-----\n- help\n- redeem\n- code <code>\n- warp"}]}`)
  }
}
break;
  }


    if (msg.header.messagePurpose == 'commandResponse') {
      if (msg.header.requestId in awaitedQueue) {
        if (msg.body.statusCode < 0)
        webhook.send((msg.body.statusMessage), {username: `COMMAND ERROR`,});
        delete awaitedQueue[msg.header.requestId]
      }
    }
    let count = Math.min(100 - Object.keys(awaitedQueue).length, sendQueue.length)
    for (let i = 0; i < count; i++) {
      // Each time, send the first command in sendQueue, and add it to the awaitedQueue
      let command = sendQueue.shift()
      socket.send(JSON.stringify(command))
      awaitedQueue[command.header.requestId] = command
    }
  })
  client.on('message', message => {
  if(message.channel.id == channelid){
  if(message.author.bot){return;}
  if (message.channel instanceof Discord.DMChannel){return;}
  let args = message.content.slice(prefix.length).split(/ +/);
  let command = args.shift().toLowerCase();
 if(message.content.startsWith(prefix) && message.member.hasPermission("ADMINISTRATOR")){
switch(command){
case "help": message.channel.send(embed("Custom discord commands", `${prefix}rawmsg - automatically formats a tellraw command for you, just type the text\n${prefix}cfunction - use one of the custom functions`)); break;
case "rawmsg": send(rawmsg(message.content.slice(2 + command.length))); break;
case "cfunction":
if(!args[0]){
message.reply(`What custom function are you running`)
  return;
}
if (fs.existsSync(`functions/${args[0]}.txt`)){
let data = fs.readFileSync(`functions/${args[0]}.txt`, "utf8")
data = data.replace(/\r/g, "").split('\n')
for (let i = 0; i < data.length; i++){
send(`${data[i]}`)
}
message.reply(`Succesfully ran custom function '${args[0]}'`)
}else{
message.reply(`That custom function does not exist`)
}
break;
default: send(message.content.slice(prefix.length)); break;
}
   return;
  }
  let msgcontent = message.content
  if(msgcontent == ""){
  msgcontent = "<image>"
  }
  if(message.member.roles.highest.name == "@everyone"){send(`tellraw @a {"rawtext":[{"text":"${color2}[Discord] <${message .author.username}> ${msgcontent.replace(/}|{|"/g, "").split("\\").join("")}"}]}`)}else{
  send(`tellraw @a {"rawtext":[{"text":"${color2}[${message.member.roles.highest.name}] <${message.author.username}> ${msgcontent.replace(/}|{|"/g, "").split("\\").join("")}"}]}`)
 }
  }
  })


  function send(cmd) {
    const msg = {
      "header": {
        "version": 1,
        "requestId": uuid.v4(),     
        "messagePurpose": "commandRequest",
        "messageType": "commandRequest"
      },
      "body": {
        "version": 1,
        "commandLine": cmd,         
        "origin": {
          "type": "player"          
        }
      }
    }
    sendQueue.push(msg)  
    let count = Math.min(100 - Object.keys(awaitedQueue).length, sendQueue.length)

    for (let i = 0; i < count; i++) {
      if(sendQueue.length > 0){
      let command = sendQueue.shift()
      socket.send(JSON.stringify(command))
      awaitedQueue[command.header.requestId] = command
      }
    }
  }
  function embed(title, text, footer){
  let embed = new Discord.MessageEmbed()
  embed.title = title
  embed.description = text
  embed.footer = footer
  embed.color = color
  return embed;
  }
})
function rawmsg(text){
return `/tellraw @a {"rawtext":[{"text":"${text}"}]}`;
}