import * as discord from "discord.js"

module.exports.runCmd = async function(msg:discord.Message, args:string[]) {
    msg.channel.send("hi!");
}


module.exports.help = {
    name: "hi",
    usage: "verify!hi",
    desc: "It greets you",
    note: "You can use this command to test if the bot is online"
}