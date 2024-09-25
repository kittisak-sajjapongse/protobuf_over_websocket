import * as https from "https";
import * as WebSocket from "ws";
import * as fs from "fs";
import * as url from "url";
import { ImageMessage } from "./proto/image";

// ********************* Important note: *********************
// WSS requires the server to be accessed using domain names.
// Client with WSS will fail to connect using IP addresses.

// References:
// [1] - Creating WSS - https://www.giacomovacca.com/2015/02/websockets-over-nodejs-from-plain-to.html

// dummy request processing
var processRequest = function( req:any, res:any ) {

  res.writeHead(200);
  res.end("All glory to WebSockets!\n");
};
var app = https.createServer({

  // providing server with  SSL key/cert
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')

}, processRequest ).listen(12346, '0.0.0.0');

const wss = new WebSocket.Server({ server: app });
wss.on("connection", async (ws: WebSocket, req) => {
  const query = new URLSearchParams(url.parse(req.url).query);

  ws.on("message", (message: string) => {
    const sendImage = (
      filename: string,
      messageUuid: number,
      description: string
    ) => {
      const fileData = fs.readFileSync(filename);
      const byteArray = new Uint8Array(fileData);
      const imageMsg: ImageMessage = ImageMessage.create({
        messageUuid: messageUuid,
        description: description,
        binContent: {
          data: byteArray,
        },
      });

      // Serialize the protobuf message and send it through websocket.
      const binaryData = ImageMessage.encode(imageMsg).finish();
      ws.send(binaryData);
    };

    var images = [
      { filename: "bunnies.jpg", id: 1, description: "Red Bunny" },
      { filename: "puppies.jpg", id: 2, description: "Puppy" },
      { filename: "bear_cubs.jpg", id: 3, description: "Bear" },
    ];
    var theLoop: (i: number) => void = (i: number) => {
      setTimeout(() => {
        const index: number = i % images.length;
        const { filename, id, description } = images[index];
        sendImage(filename, id, description);
        if (--i) {
          theLoop(i);
        }
      }, 3000);
    };
    theLoop(10);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});