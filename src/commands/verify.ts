import * as discord from "discord.js"

module.exports.runCmd = async function(msg:discord.Message, args:string[], client?:discord.Client) {
    if (msg.guild.id != "715519373619626107") {
        return;
    }
    if (msg.member.roles.cache.has("761984861161652225")) {
        msg.reply("you already are verified.").then(a => {
            setTimeout(async () => {
                await msg.delete();
                await a.delete();
            }, 5000);
        })
        return;
    } else if (msg.member.roles.cache.has("768473486455865424")) {
        msg.reply("you have to wait until a moderator has manually verified you!").then(a => {
            setTimeout(async () => {
                await msg.delete();
                await a.delete();
            }, 5000);
        })
        return;
    }

    var num1 = Math.floor(Math.random() * 15);
    var num2 = Math.floor(Math.random() * 15);
    var sum = num1 + num2;

    let CaptchaMsg = await msg.channel.send(`You have 20 seconds to answer:\nWhat is ${num1} + ${num2}?`);
    const collector = new discord.MessageCollector((<discord.TextChannel> msg.channel), (m) => m.author.id == msg.author.id, { time: 20000 });
    collector.on('collect', async (message) => {
        //console.log("a")
        if (message.content == sum.toString()) {
            message.react("✅");
            message.channel.send("Successfully verified you!").then((verifymsg:discord.Message) => {
                setTimeout(() => {
                    verifymsg.delete();
                }, 10000);
            });
            await message.member.roles.add("761984861161652225");
            collector.stop("success");
        } else {
            message.react("❌");
            message.channel.send("Error! Invalid captcha. You need manual verification. Feel free to ping/dm a moderator for help").then((verifymsg:discord.Message) => {
                setTimeout(() => {
                    verifymsg.delete();
                }, 10000);
            });
            await message.member.roles.add("768473486455865424");
            let NotoManualVerify = <discord.TextChannel> await client.channels.fetch("768470532722262046");
            NotoManualVerify.send(`<@&766472750709473299>, <@${message.author.id}> (id:"${message.author.id}", tag:"${message.author.tag}") needs to be manually verified!`);
            collector.stop("no success");
        }
    });
    collector.on("end", async (msgs, reason) => {
        //console.log(msg.member.roles.cache);
        if (reason == "time") {
            if (msg.member.roles.cache.has("761984861161652225")) {
                await CaptchaMsg.delete();
            } else {
                setTimeout(async () => {
                    await CaptchaMsg.delete();
                }, 10000);
                msg.channel.send("Time is up! You were too slow. Feel free to try again with verify!verify").then(verifymsg => {
                    setTimeout(async () => {
                        await verifymsg.delete();
                    }, 10000);
                });
            }
        } else {
            setTimeout(async () => {
                await CaptchaMsg.delete();
            }, 10000);
        }
        setTimeout(async () => {
            (<discord.TextChannel> msg.channel).bulkDelete(msgs);
            msg.delete().catch(() => {});
        }, 10000);
    })
}

module.exports.help = {
    name: "verify",
    usage: "verify!verify",
    desc: "The command to verify.",
    note: "You can't use this command if you're already verified!"
}