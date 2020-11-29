import * as discord from "discord.js"

module.exports.runCmd = async function(msg:discord.Message, args:string[]) {
    if (msg.author.id != "607196862017044491") {
        return;
    } else {
        msg.channel.send(`args: ${args.join(" ")}`);
    }
}


module.exports.help = {
    name: "test",
    usage: ".",
    desc: "It's a test command by the dev",
    note: "You can't use this"
}