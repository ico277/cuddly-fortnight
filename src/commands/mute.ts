import * as discord from "discord.js"

module.exports.runCmd = async function(msg:discord.Message, args:string[]) {
    if (msg.member.hasPermission("KICK_MEMBERS")) {

    } else {
        msg.reply("you have insufficient permissions to use this command!");
    }
}

module.exports.help = {
    name: "mute",
    usage: "mod!mute <@user>",
    desc: "It mutes the specified user",
    note: "You need to have the \"manage members\" permission to use this command!"
}