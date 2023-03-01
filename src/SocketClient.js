import io from 'socket.io-client';
import fs from 'fs';
import { pathToFileURL } from 'url';
import ChatGPTClient from '../src/ChatGPTClient.js';

const socket_url = "ws://localhost:3000";
const arg = process.argv.find((arg) => arg.startsWith('--settings'));
let path;
if (arg) {
    path = arg.split('=')[1];
} else {
    path = './settings.js';
}

let settings;
if (fs.existsSync(path)) {
    // get the full path
    const fullPath = fs.realpathSync(path);
    settings = (await import(pathToFileURL(fullPath).toString())).default;
} else {
    if (arg) {
        console.error(`Error: the file specified by the --settings parameter does not exist.`);
    } else {
        console.error(`Error: the settings.js file does not exist.`);
    }
    process.exit(1);
}

if (settings.storageFilePath && !settings.cacheOptions.store) {
    // make the directory and file if they don't exist
    const dir = settings.storageFilePath.split('/').slice(0, -1).join('/');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(settings.storageFilePath)) {
        fs.writeFileSync(settings.storageFilePath, '');
    }
}
export default class SocketClient {
    constructor(
    ) {}
    async socketConnection() {
        const socket = io(socket_url);
        socket.on('connect', function () {
            console.log('connect thành công');
        });
        socket.on('broadcastMessage', function (mes) {
            let obj = mes.data;
            if (obj && obj.bot != true) {
                handleChatAi(mes);
            }
        });
    }
}
async function handleChatAi(mes) {
    let obj = mes.data;
    const socket = io(socket_url);
    socket.on('connect', function () {
        console.log('connect thành công');
    });
    let conversationData = {};
    //console.log(obj);
    let client = new ChatGPTClient(
        settings.openaiApiKey,
        settings.chatGptClient,
        settings.cacheOptions,
    );
    let reply;
    const response = await client.sendMessage(obj.content, {
        ...conversationData,
        onProgress: (token) => {
            reply += token;
        },
    });
    let responseText = response.response;
    console.log(responseText);
    socket.emit('groupMessage', {
        "content": responseText,
        "groupId": obj.groupId,
        "messageType": "text",
        "userId": "6f0d1003-88f2-4394-886a-f6738edcfe07",
        "bot": true
    });
}
