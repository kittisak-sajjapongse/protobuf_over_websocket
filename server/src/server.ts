import * as WebSocket from "ws";
import * as fs from "fs";
import * as url from "url";
import { ImageMessage } from "./proto/image";

const wss = new WebSocket.Server({ port: 12345 });
wss.on("connection", (ws: WebSocket, req) => {
  const query = new URLSearchParams(url.parse(req.url).query);
  console.log("New client connected:");
  console.log(`   param1 presents : ${query.has("param1")}`);
  console.log(`   param1 Value    : ${query.get("param1")}`);

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
