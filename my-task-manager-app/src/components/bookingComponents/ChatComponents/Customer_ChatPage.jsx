/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { MessageBox, Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const CustomerChatPage = ({ customerId, driverId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,   
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket");
  
        client.subscribe(`/topic/customer/${customerId}/messageForCustomer`, (message) => {
          setMessages((prev) => [...prev, { sender: "other", text: message.body,time:Date.now() }]); 
        });
      },
      onDisconnect: () => console.log("Disconnected from WebSocket"),
    });
  
    client.activate();
    return () => {
      client.deactivate();
    };
  }, [customerId]);
  
  const sendMessage = async () => {
    if (text.trim()) {
      setMessages([...messages, { sender: "me", text , time:Date.now()}]); 
  
      await fetch(`http://localhost:8080/api/chat/forDriver?driverId=${driverId}&textMessage=${text}`, {
        method: "POST",
      });
  
      setText("");
    }
  };
  

  return (
    <div className="shadow-gray-500 shadow-md p-2 bg-gray-100">
    <div className=" h-80 overflow-y-auto">
      {messages.map((msg, index) => (
        <MessageBox key={index} date={msg.time}  position={msg.sender === "me" ? "right" : "left"} type="text" text={msg.text} />
      ))}
    </div>
      <Input
      className="border-2  p-0.5 mt-1"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        rightButtons={<button className="customeApplicationButton" onClick={sendMessage}>Send</button>}
      />
    </div>
  );
};

export default CustomerChatPage;
