import { Telegraf } from "telegraf"
import * as env from "dotenv";
env.config();
import {isBotPing, getTextAfterRegexPattern} from "./RegexCheck";

import { database } from './SimpleDatabase';

// @ts-ignore
const bot: Telegraf = new Telegraf(process.env.TOKEN);

database.loadDatabase();

bot.on('new_chat_members', (ctx) => {
    try {
        ctx.message.new_chat_members.forEach(user => {
            database.addUser({
                firstName: user.first_name,
                lastName: user.last_name ?? '',
                id: user.username ?? user.first_name,
            }, ctx.message.chat.id)
            database.saveChanges();
        })
    }catch (e) {
        console.log(e);
        // @ts-ignore
        ctx.telegram.sendMessage(process.env.DEBUG_CHAT_ID, e);
    }


})

bot.command('/reguser', (ctx) => {
    try {
        if('text' in ctx.message) {
            const chatid = ctx.message.chat.id;
            const userid = ctx.message.from.username ?? ctx.message.from.first_name;
            const firstname = ctx.message.from.first_name;
            const lastname = ctx.message.from.last_name;
            const userinDb = database.getUserById(chatid, userid);

            if(userinDb === undefined) {
                database.addUser({firstName: firstname, lastName: lastname ?? "", id: userid ?? ""}, chatid);
                database.saveChanges();
            }

        }
    }catch (e) {
        console.log(e);
        // @ts-ignore
        ctx.telegram.sendMessage(process.env.DEBUG_CHAT_ID, e);
    }

});

bot.on('message', async (ctx) => {
    if ("text" in ctx.message) {

        const messageText = ctx.message.text;

        if (isBotPing(ctx.message.text)) {
            try {
                const text = getTextAfterRegexPattern(messageText);
                const users = database.getAllUsers(ctx.message.chat.id);
                const user = users[Math.floor(Math.random() * users.length)];
                await bot.telegram.sendMessage(ctx.message.chat.id, '@' + user.id + " сегодня " + text);
            }catch (e) {
                console.log(e);
                // @ts-ignore
                ctx.telegram.sendMessage(process.env.DEBUG_CHAT_ID, e);
            }

        }
    }
});





bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));