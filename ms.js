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

const automessagetime = settings.automessagetime
//how often the automatic messages are sent, this can be editted in config/messages.json
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
  fs.writeFile(`config/messages.json`, '{"messages":["Make sure to followe the rules", "Donate to support the server", "Custom commands made by fluffy hyena#3238"]}', function (err) {
    if (err) return console.log(err);
  });
}
if (!fs.existsSync("functions")){
  fs.mkdirSync("functions");
}
const db = JSON.parse(fs.readFileSync(`${dir}/db.json`, "utf8"))
const automsgs = Object.keys(JSON.parse(fs.readFileSync(`config/messages.json`, "utf8"))).map((key) => [key, JSON.parse(fs.readFileSync(`config/messages.json`, "utf8"))[key]])
const chatted = new Set();
const muted = new Set();
let messagenum = 0;

const WebSocket = require('ws')
const uuid = require('uuid');
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
  //stuff for auto msgs
  setInterval(()=>{
  send(`tellraw @a {"rawtext":[{"text":"${automsgs[0][1][messagenum]}"}]}`)
  messagenum++
  if(messagenum ==  automsgs[0][1].length){
  messagenum = 0
  }
  }, automessagetime)
  //rest of the code that isnt auto msgs
  socket.on('message', packet => {
    const msg = JSON.parse(packet)
    if(!msg.body.eventName == undefined) console.log(`[EVENTS] ${msg.body.eventName} event fired`)
switch(msg.body.eventName){
case 'PlayerMessage':
  if(msg.body.properties.Sender == "External") return;
  if(!db[msg.body.properties.Sender]){
    db[msg.body.properties.Sender] = {"strikes":0,"addedtime":0}
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
//used in the commands to see the gamemode (permission level) and if its enabled or not
function permcheck(){
  let name = []
  let permission = []
  let enabled = []
  permission.push(client.commands.map(plugins => plugins.permission));
  name.push(client.commands.map(plugins => plugins.name));
  enabled.push(client.commands.map(plugins => plugins.enabled));
  for(let i  = 0; i < name[0].length; i++){
  if(enabled[0][i] == false){
  send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThis command is disabled"}]}`)
  return "stop";
  }
  if(msg.body.properties.PlayerGameMode == 0 && command == name[0][i] && permission[0][i] == "creative"){
      send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThis command is not available in survival"}]}`)
      return "stop";
      } else if(msg.body.properties.PlayerGameMode == 2 && command == name[0][i] && (permission[0][i] == "creative" || permission[0][i] == "survival")){
          send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThis command is not available in adventure"}]}`)
          return "stop";
          }
  }
}
const pluginsFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
client.commands = new Discord.Collection();
for(const file of pluginsFiles){
  if (fs.existsSync(`./commands/${file}`)) {
  let plugins = require(`./commands/${file}`);
  client.commands.set(plugins.name, plugins);
  }
}
if(client.commands.get(`${command}`)){
client.commands.get(`${command}`).execute(send, fs, msg, args, command, client, settings, permcheck); 
}else{
  send(`tellraw "${msg.body.properties.Sender}" {"rawtext":[{"text":"§cThat command doesnt exist"}]}`)
}
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