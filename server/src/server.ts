import * as WebSocket from 'ws';
import * as fs from 'fs';
import * as url from 'url'

import { ImageMessage } from './proto/image';

const wss = new WebSocket.Server({ port: 12345 });
wss.on('connection', (ws: WebSocket, req) => {
    const query = new URLSearchParams(url.parse(req.url).query)
    console.log('New client connected:');
    console.log(`   param1 presents : ${query.has("param1")}`)
    console.log(`   param1 Value    : ${query.get("param1")}`)

    ws.on('message', (message: string) => {
        const fileData = fs.readFileSync("src/red_bunny.jpg");
        const byteArray = new Uint8Array(fileData);
        const imageMsg: ImageMessage = ImageMessage.create({
            messageUuid: 123,
            description: "dsafjpods",
            binContent: {
                data: byteArray
            }
        });
        
        // Serialize the protobuf message to binary format
        const binaryData = ImageMessage.encode(imageMsg).finish();
        ws.send(binaryData);
    });
    
    ws.on('close', () => {
            console.log('Client disconnected');
    });
});
