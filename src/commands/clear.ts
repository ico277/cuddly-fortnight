import * as discord from "discord.js";

module.exports.runCmd = async function(msg:discord.Message, args:string[]) {
    let member = msg.member;
    if (member.hasPermission("MANAGE_MESSAGES")) {
        if (args.length > 0) {
            let amount = args[0];
            if (!isNaN(Number(amount))) {
                if (Number(amount) < 101 && Number(amount) > 0) {
                    await msg.delete().catch(err => {});
                    msg.channel.messages.fetch({limit: Number(amount)}).then(async (FetchedMsgs) => {
                        var msgs = FetchedMsgs.filter(m => !m.pinned);
                        await (<discord.TextChannel> msg.channel).bulkDelete(msgs);
                        msg.reply(`deleted ${msgs.size} messages!`).then(a => {
                            setTimeout(() => {
                                a.delete().catch(err => {});
                            }, 5000);
                        })
                    }).catch(err => {
                        if (err instanceof discord.DiscordAPIError) {
                            msg.reply("I don't have permission to delete messages!")
                        } else {
                            msg.reply("there was an unexpected error!")
                        }
                    })
                } else {
                    msg.reply(`"${amount}" is not a valid number!`);
                }
            } else {
                msg.reply("you need to provide a valid amount!");
            }
        } else {
            msg.reply("you need to provide a valid amount!");
        }
    } else {
        msg.reply("you have insufficient permissions to use this command!");
    }
}


module.exports.help = {
    name: "clear",
    usage: "verify!clear <amount>",
    desc: "It clears an amount of messages",
    note: "You need to have the \"manage messages\" permission to use this command!\nThe amount of messages can't be higher than 100!\nThis command does not delete pinned messages!"
}