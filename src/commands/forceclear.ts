import * as discord from "discord.js";

module.exports.runCmd = async function(msg:discord.Message, args:string[]) {
    let member = msg.member;
    if (member.hasPermission("MANAGE_MESSAGES")) {
        if (args.length > 0) {
            let amount = args[0];
            if (!isNaN(Number(amount))) {
                if (Number(amount) < 101) {
                    await msg.delete();
                    msg.channel.messages.fetch({limit: Number(amount)}).then(async (FetchedMsgs) => {
                        var msgs = FetchedMsgs.filter(m => !m.pinned);
                        await (<discord.TextChannel> msg.channel).bulkDelete(msgs);
                        msg.reply(`deleted ${msgs.size} messages!`).then(a => {
                            setTimeout(() => {
                                a.delete();
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
        msg.reply("you don't have enough permission to use this command!");
    }
}


module.exports.help = {
    name: "force clear",
    usage: "mod!force clear <amount>",
    desc: "It clears an amount of messages",
    note: "It's the same as the clear command except that it does delete pinned messages"
}