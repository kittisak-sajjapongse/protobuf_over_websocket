import * as WebSocket from 'ws';
import * as url from 'url'

const wss = new WebSocket.Server({ port: 12345 });
wss.on('connection', (ws: WebSocket, req) => {
    const query = new URLSearchParams(url.parse(req.url).query)
    console.log('New client connected:');
    console.log(`   param1 presents : ${query.has("param1")}`)
    console.log(`   param1 Value    : ${query.get("param1")}`)

    ws.on('message', (message: string) => {
        console.log(`Received message: ${message}`);
        ws.send(`Server received your message: ${message}`);
    });
    
    ws.on('close', () => {
            console.log('Client disconnected');
    });
});
