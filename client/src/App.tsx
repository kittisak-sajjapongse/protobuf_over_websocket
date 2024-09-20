import { ImageMessage } from "./proto/image";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:12345?param1=THE_VALUE_OF_PARAM1`);
    ws.onopen = () => {
      console.log("Connected to server");
      // Send a message to the server to trigger it
      // to stream the image through websocket.
      ws.send("Hello, server!");
    };

    ws.onmessage = (event: any) => {
      console.log("Received message from server");
      const reader = new FileReader();
      reader.readAsArrayBuffer(event.data);
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const byteArray = new Uint8Array(arrayBuffer);

        // Deserialize the binary data into an ImageMessage message.
        const imageMsg = ImageMessage.decode(byteArray);
        console.log(`messageUuid: ${imageMsg.messageUuid}`);
        console.log(`description: ${imageMsg.description}`);

        // Convert the binary content to a Blob and create a data URL.
        const blob = new Blob([imageMsg.binContent!.data], {
          type: "image/jpeg",
        });
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      };
    };

    ws.onclose = () => {
      console.log("Disconnected from server");
    };
  }, []);

  return (
    <>
      <div>
        {imageSrc ? (
          <img src={imageSrc} alt="Received" />
        ) : (
          <p>No image received yet.</p>
        )}
      </div>
    </>
  );
}

export default App;
