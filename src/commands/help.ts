import * as discord from "discord.js";
import * as fs from "fs";

module.exports.runCmd = async function(msg:discord.Message, args:string[]) {
    if (args.length > 0) {
        let cmd = args[0].toLowerCase();
        var path = `./${cmd}.js`.toLowerCase();
        if (fs.existsSync(`./commands/${cmd}.js`.toLowerCase())) {
            var CmdHelp = await require(path).help;
            if (CmdHelp != null || CmdHelp != undefined) {
                let embed = new discord.MessageEmbed()
                    .setTitle(`${CmdHelp.name} help menu`)
                    .addField("Usage", CmdHelp.usage)
                    .addField("Description", CmdHelp.desc)
                    .setColor(0x0066FF);
                if (CmdHelp.note) {
                    embed.addField("Note", CmdHelp.note);
                }
                msg.channel.send(embed);
            } else {
                msg.channel.send(`Could not find command "${cmd}"!`);
            }
        } else {
            msg.channel.send(`Could not find command "${cmd}"!`);
        }
    } else {
        let cmds:string[] = [];
        fs.readdirSync("./commands").forEach(a => {
            cmds.push(a.split(".")[0]);
        })
        cmds.sort();
        let embed = new discord.MessageEmbed()
            .setTitle("Help menu")
            .addField("All commands", cmds.join(", "))
            .addField("Note", "For for information about a command do mod!help <command name>")
            .setFooter("<arg> means required argument\n[arg] means optional argument")
            .setColor(0x0066FF);
        msg.channel.send(embed);
    }
}

module.exports.help = {
    name: "help",
    usage: "mod!help [command]",
    desc: "It shows this help menu",
    note: null
}