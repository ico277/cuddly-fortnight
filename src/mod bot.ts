import * as discord from "discord.js";
import * as fs from "fs";

export class ModBot {
    public client:discord.Client;
    public PREFIX:string = "verify!";

    constructor(token:string) {
        this.client = new discord.Client({disableMentions: "everyone"});

        this.client.on("ready", () => {
            console.log(`Started up as ${this.client.user.tag}!`);
        })
        
        this.client.on("message", async (msg) => {
            if (msg.author.bot) {
                return;
            }

            let args = msg.content.split(" ");
            let cmd = args[0].substr(this.PREFIX.length);
            args.shift();

            // This is to verify in the #verify channel on my discord server without prefix
            if (msg.channel.id == "767920018549506089" && msg.content == "verify") {
                var path = `./commands/verify.js`;
                if (fs.existsSync(path)) {
                    var run = await require(path);
                    if (run != null || run != undefined) {
                        try {
                            run.runCmd(msg, [], this.client);
                        } catch (ex) {
                            msg.channel.send(`There was an unexpected error!`);
                            console.error(ex);
                        }
                    } else {
                        msg.channel.send(`Could not find command "${cmd}"!`);
                    }
                } else {
                    msg.channel.send(`Could not find command "${cmd}"!`);
                }
                return;
            }
            
            if (!msg.content.toLowerCase().startsWith(this.PREFIX)) {
                return;
            }
        
            var path = `./commands/${cmd}.js`.toLowerCase();
            if (fs.existsSync(path)) {
                var run = await require(path);
                if (run != null || run != undefined) {
                    try {
                        run.runCmd(msg, args, this.client);
                    } catch (ex) {
                        msg.channel.send(`There was an unexpected error!`);
                        console.error(ex);
                    }
                } else {
                    msg.channel.send(`Could not find command "${cmd}"! 2`);
                }
            } else {
                msg.channel.send(`Could not find command "${cmd}"! 1`);
            }
        })
  
        this.client.login(token);
    }
}