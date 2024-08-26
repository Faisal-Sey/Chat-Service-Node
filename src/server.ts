import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import sequelize from './models';
import wss from './utils/websocket';
import {loadServerConfigs} from "./serverConfigs";

const app = express();
const port = process.env.PORT || 3000;

const server = createServer(app);

server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const pathname = url.pathname;
    const parts = pathname.split('/');

    if (parts[1] === 'chat') {
        const chatId = parts[2];
        if (!chatId) {
            socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
            socket.destroy();
            return;
        }

        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request, { type: 'chat', id: chatId });
        });
    } else {
        socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
        socket.destroy();
    }
});


loadServerConfigs(app);


sequelize.sync().then(() => {
    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
