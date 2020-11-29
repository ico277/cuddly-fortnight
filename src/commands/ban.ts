import * as discord from "discord.js";

module.exports.runCmd = async function(msg:discord.Message, args:string[]) {
    if (msg.member.hasPermission("BAN_MEMBERS")) {
        let mentions = msg.mentions.members.array();
        if (mentions.length > 0) {
            let mention = mentions[0];
            if (mention) {
                let embed = new discord.MessageEmbed()
                    .setTitle("Ban command")
                    .addField("Member", `tag: "${mention.user.tag}"\nid: "${mention.user.id}"`, true)
                    .addField("Moderator", `tag: "${msg.author.tag}"\nid: "${msg.author.id}"`, true)
                    .addField("Reason", "Type a reason for the ban in the chat. (type \"cancel\" to cancel or type \"none\" for no reason)", false)
                    .setFooter("You have 20 seconds to respond with a reason!")
                    .setThumbnail(mention.user.displayAvatarURL({dynamic: true, size: 512}))
                    .setColor(0x0066FF);
                await msg.channel.send(embed);
                const collector = new discord.MessageCollector( <discord.TextChannel> msg.channel, (m) => m.author.id == msg.author.id, { time: 20000 });
                collector.on('collect', async (message) => {
                    switch(message.content.toLowerCase()) {
                        case "cancel": {
                            collector.stop("cancelled");
                            break;
                        }
                        case "none": {
                            collector.stop("none");
                            break;
                        }
                        default: {
                            collector.stop("");
                            if (mention.bannable) {
                                mention.ban({reason: message.content}).then(BannedMember => {
                                    let embed = new discord.MessageEmbed()
                                        .setTitle("Ban command")
                                        .addField("Member", `tag: "${BannedMember.user.tag}"\nid: "${BannedMember.user.id}"`, true)
                                        .addField("Moderator", `tag: "${msg.author.tag}"\nid: "${msg.author.id}"`, true)
                                        .addField("Ban Reason", message.content, false)
                                        .addField("Banned", `Successfully banned ${BannedMember.user.tag}!`)
                                        .setThumbnail(BannedMember.user.displayAvatarURL({dynamic: true, size: 512}))
                                        .setColor(0x0066FF);
                                    msg.channel.send(embed);
                                }).catch(err => {
                                    console.error(err);
                                    msg.reply("there was an unexpected error!")
                                })
                            } else {
                                msg.reply("I have insufficient permissions to ban this member!");
                            }
                            break;
                        }
                    }
                });
                collector.on("end", async (msgs, reason) => {
                    if (reason == "time") {
                        msg.reply("you were too slow, cancelled!");
                    } else if (reason == "cancelled") {
                        msg.reply("cancelled!")
                    } else if (reason == "none") {
                        if (mention.bannable) {
                            mention.ban().then(BannedMember => {
                                let embed = new discord.MessageEmbed()
                                    .setTitle("Ban command")
                                    .addField("Member", `tag: "${BannedMember.user.tag}"\nid: "${BannedMember.user.id}"`, true)
                                    .addField("Moderator", `tag: "${msg.author.tag}"\nid: "${msg.author.id}"`, true)
                                    .addField("Banned", `Successfully banned ${BannedMember.user.tag}!`)
                                    .setThumbnail(BannedMember.user.displayAvatarURL({dynamic: true, size: 512}))
                                    .setColor(0x0066FF);
                                msg.channel.send(embed);
                            }).catch(err => {
                                console.error(err);
                                msg.reply("there was an unexpected error!")
                            })
                        } else {
                            msg.reply("I have insufficient permissions to ban this member!");
                        }
                    }
                })
            } else {
                msg.reply("you need to mention a user to ban!");
            }
        } else {
            msg.reply("you need to mention a user to ban!");
        }
    } else {
        msg.reply("you have insufficient permissions to use this command!");
    }
}

module.exports.help = {
    name: "ban",
    usage: "mod!ban <@user>",
    desc: "It bans the specified user",
    note: "You need to have the \"ban members\" permission to use this command!"
}