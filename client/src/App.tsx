import { useState, useEffect } from 'react'
import './App.css'
import { ImageMessage } from './proto/image'

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const imageMsg: ImageMessage = {
    messageUuid: 123,
    description: "dsfdsf"
  };
  console.log(imageMsg);

  function appendMessage(message: string) {
    setMessages((prevMessages) => {
      var messages = [...prevMessages, message];
      return messages;
    });
  }

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:12345?param1=THE_VALUE_OF_PARAM1');
    ws.onopen = () => {
      console.log('Connected to server');
      appendMessage('Connected to server');
      ws.send('Hello, server!');
    };
    
    ws.onmessage = (event: any) => {
      console.log(`Received message from server: ${event.data}`);
      appendMessage(`Received message from server: ${event.data}`);
    };
    
    ws.onclose = () => {
      console.log('Disconnected from server');
      appendMessage('Disconnected from server');
    };
  }, []);

  return (
    <>
      <div>dsf {messages.join("<br>\n")}</div>
      <div><button onClick={() => {appendMessage("YAY!")}}>click</button></div>
    </>
  )
}

export default App
