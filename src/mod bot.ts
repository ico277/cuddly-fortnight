import * as discord from "discord.js";
import * as fs from "fs";
import { ObjectFlags } from "typescript";

export class ModBot {
    public client: discord.Client;
    public PREFIX: string = "mod!";

    constructor(token: string) {
        this.client = new discord.Client({ disableMentions: "everyone" });

        this.client.on("ready", () => {
            console.log(`Started up as ${this.client.user.tag}!`);

            this.client.user.setPresence({
                activity: {
                    name: `for help do ${this.PREFIX}help`,
                    type: "PLAYING"
                }
            });
        })

        this.client.on("message", async (msg) => {
            if (msg.author.bot) {
                return;
            }

            let args = this.ParseArgs(msg.content);//msg.content.split(" ");
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

    public ParseArgs(input: string) {
        //Taken from https://stackoverflow.com/questions/50671649/capture-strings-in-quotes-as-single-command-argument

        var doubleDoubleQuote = '<DDQ>';
        while (input.indexOf(doubleDoubleQuote) > -1) doubleDoubleQuote += '@';

        var noDoubleDoubleQuotes = input.replace(/""/g, doubleDoubleQuote);

        var spaceMarker = '<SP>';
        while (input.indexOf(spaceMarker) > -1) spaceMarker += '@';

        var noSpacesInQuotes = noDoubleDoubleQuotes.replace(/"([^"]*)"?/g, (_fullMatch: any, capture: string) => {
            return capture.replace(/ /g, spaceMarker)
                .replace(RegExp(doubleDoubleQuote, 'g'), '"');
        });

        var mangledParamArray = noSpacesInQuotes.split(/ +/);

        var paramArray = mangledParamArray.map((mangledParam: string) => {
            return mangledParam.replace(RegExp(spaceMarker, 'g'), ' ')
                .replace(RegExp(doubleDoubleQuote, 'g'), '');
        });

        return paramArray;
    }
}