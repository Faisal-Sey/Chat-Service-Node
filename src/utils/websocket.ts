import { WebSocket, WebSocketServer } from 'ws';
import Chat from "../models/chat";
import User from "../models/user";
import Message from "../models/message";
import {extractAuthorizationToken} from "./jwtService";

const wss = new WebSocketServer({ noServer: true });
const USER_KEY_STRING: string | undefined = process.env.USER_KEY_STRING;

wss.on('connection', async (ws, request) => {
    const url = new URL(request.url!, `https://${request.headers.host}`);
    const chatId = url.pathname.split('/')[2];

    const userInfo = await extractAuthorizationToken(ws, request);

    if (userInfo === null) {
        ws.close(4000, 'Unauthorized');
        return;
    }

    if (!USER_KEY_STRING) {
        ws.close(4000, 'User key string not set');
        return;
    }

    try {
        if (!(await isUserAuthorizedToChat(userInfo[USER_KEY_STRING], chatId))) {
            ws.close(4000, 'Forbidden');
            return;
        }

        // Retrieve and send all pending messages to the user
        const messages = await Message.findAll({ where: { chatId } });
        messages.forEach((message) => {
            ws.send(message.content);
        });

        // Handle chat connection logic
        ws.on('message', async (message: string) => {
            const messageString = message.toString();
            const parsedMessage = JSON.parse(messageString);
            const chatId = parsedMessage.chatId;
            const senderId = parsedMessage.senderId;
            const content = parsedMessage.content;

            // Save the message to the database
            await Message.create({ chatId, senderId, content });

            // Broadcast message to all clients in the chat
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(parsedMessage.content);
                }
            });
        });

    } catch (error) {
        ws.close(4000, 'Unauthorized');
    }
});

async function isUserAuthorizedToChat(userKey: string, chatId: string): Promise<boolean> {
    const chat = await Chat.findByPk(chatId, {
        include: [{
            model: User,
            as: 'users',
            where: { userKey: userKey },
        }],
    });

    if (chat && chat.users) {
        return chat.users?.length > 0;
    }
    return false;

}

export default wss;
