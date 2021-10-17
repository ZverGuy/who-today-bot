import {config} from "dotenv";
import * as fs from "fs/promises";


let databaseFileName = process.env.JSON_DB_NAME;

interface User {
    firstName: string;
    lastName: string;
    id: string;
}
interface Chat {
    chatId: number,
    users: User[]
}

const chats: Chat[] = []


// @ts-ignore
// @ts-ignore
export const database = {
    addUser: (user: User, chatid: number): void => {

            let chat = chats.filter(chat => {
                return chat.chatId == chatid
            })[0];

            //superior anti crash
            if(chat == undefined) {
                chat = {chatId: chatid, users: []};
                chats.push(chat);
            }

            if(chat.users.indexOf(user) == -1) {
                chat.users.push(user);
            }
    },

    getUserById: (chatid: number, userid: string): User | undefined => {
        try {
            let chat = chats.filter(chat => {return chat.chatId == chatid})[0];

            let user = chat.users.filter(user => {return user.id == userid})[0];
            return user;
        } catch(e) {
            console.log(e);
            return undefined
        }
    },

    saveChanges: async (): Promise<void> => {
        try {
            let filepath = __dirname + databaseFileName;
            if (await checkFileExistsSync(filepath)) {
                fs.rm(filepath)
                    .then(() => fs.writeFile(filepath, JSON.stringify(chats)))
                    .then(() => console.log('Database Saved'));
            } else {
                fs.writeFile(filepath, JSON.stringify(chats))
                    .then(() => console.log('Database saved'));
            }
        } catch (e) {
            console.log(e);
        }
    },


    loadDatabase: async (): Promise<void> => {
        try {
            let dbInString = await fs.readFile(__dirname + databaseFileName);
            chats.push(JSON.parse(dbInString.toString()));

            console.log('Database loaded successfully')
            console.log('Database value:\n\n' + JSON.stringify(chats));
        } catch (e) {
            console.log( 'Database load error:\n ' + e);
        }
    },
    //@ts-ignore
    getAllUsers: (chatid: number): User[] => {
            let chat = chats.filter(x => x.chatId == chatid)[0];
            if (chat === undefined) {
                // @ts-ignore
                return chats[0][0].users;
            }
        }

}

async function checkFileExistsSync(filepath: string): Promise<boolean>{
    let itsOk = true
    try {
        await fs.readFile(filepath)
    }catch {
        itsOk = false
    }
    return itsOk;
}



