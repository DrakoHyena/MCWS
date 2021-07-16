'use strict';
const Discord = require('discord.js')


//SETTINGS//
const prefix = "!"
//prefix ingame and for the bot

let dir = "MinecraftWS"
//the directory (folder) for the data base DO NOT PUT A SLASH AT THE END OF THE STRING

const webhook = new Discord.WebhookClient("", "")
//VIDEO ON HOW TO CHANGE WEB HOOK SETTINGS - https://www.youtube.com/watch?v=hcWoDfsGpq8&ab_channel=CedrickAlegroso

const bottoken = ""
//the token for your discord bot

const channelid = "863885982146101248"
//the channel id of the channel the webhook is in

const port = "8000"
//the port that you connect to

const color = "#FFFFFF"
//the colors for things (like embeds)

const color2 = "§7"
//the color for discord messages in game 

const chatremove = 3000
//how long (im ms) till a persons spamming strikes get set to 0

const maxstrikes = 5
//how many spamming strikes someone can get before they get muted

const mutetime = 30000 //10000 = 10 seconds
//how long a person is muted for (in ms)

const addedtime = 10000
//the added muted time each time a person gets muted
////////////


//To change !redeem stuff look at line 164 or contact the contacts in the readme file
let examplekit = [86400000, "air 0 0"]
let examplekitset = new Set();

const fs = require('fs')
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
  fs.writeFile(`${dir}/db.json`, "{}", function (err) {
    if (err) return console.log(err);
  });
  fs.writeFile(`${dir}/codes.json`, "{}", function (err) {
    if (err) return console.log(err);
  });
  fs.writeFile(`${dir}/usedcode.json`, "{}", function (err) {
    if (err) return console.log(err);
  });
}
if (!fs.existsSync("functions")){
  fs.mkdirSync("functions");
}
const db = JSON.parse(fs.readFileSync(`${dir}/db.json`, "utf8"))
const code = JSON.parse(fs.readFileSync(`${dir}/codes.json`, "utf8"))
const usedcode = JSON.parse(fs.readFileSync(`${dir}/usedcode.json`, "utf8"))
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
  if(!db[msg.body.properties.Sender]){
    db[msg.body.properties.Sender] = {"strikes":0,"addedtime":0}
  }
      if(msg.body.properties.Sender == "External"){return;}
      if (muted.has(msg.body.properties.Sender)) {
      send(`ability "${msg.body.properties.Sender}" mute true`)
      send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cYou have been muted automatically for spamming"}]}`)
      setTimeout(() => {
      muted.delete(msg.body.properties.Sender);
      send(`ability "${msg.body.properties.Sender}" mute false`)
      send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§gYou have been unmuted"}]}`)
      db[msg.body.properties.Sender].addedtime = db[msg.body.properties.Sender].addedtime + addedtime
      fs.writeFile(`${dir}/db.json`, JSON.stringify(db), (err) => {if (err) console.log(err)})
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
if(!args[0]){
send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cWhat are you redeeming?"}]}`)
return;
}
switch(args[0]){
//copy everything and paste it below under "break;" then replace all the examplekits and examplekitsets (Read the section in readme.md if you dk what youre doing)
case "examplekit":
if(examplekitset.has(msg.body.properties.Sender)){
  send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThat is on cooldown, please wait"}]}`)
  return;
}
for(let i = 1; i < examplekit.length; i++){
send(`give @a[name="${msg.body.properties.Sender}",tag="${args[0]}"] ${examplekit[i]}`)
}
send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§gSuccessfully redeemed ${args[0]}, please wait ${mtm(examplekit[0])} to redeem this again"}]}`)
examplekitset.add(msg.body.properties.Sender);
setTimeout(() => {
  examplekitset.delete(msg.body.properties.Sender);
  fs.writeFile(`${dir}/db.json`, JSON.stringify(db), (err) => {if (err) console.log(err)})
}, examplekit[0]);
break;


}
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
fs.writeFile(`${dir}/codes.json`, JSON.stringify(code), (err) => {if (err) console.log(err)})
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
case "help":
  send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§g-----Custom Commands-----\n- help\n- redeem <kit/rank>\n- code <code>\n- function <custom function>"}]}`)
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
case "help": message.channel.send(embed("Custom discord commands", `${prefix}rawmsg - automatically formats a tellraw command for you, just type the text`)); break;
case "rawmsg": send(rawmsg(message.content.slice(2 + command.length))); break;
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
function mtm(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return hrs + ':' + mins + ':' + secs + '.' + ms;
}
