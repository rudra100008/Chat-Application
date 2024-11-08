"use client";
import { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const client = new Client({
  webSocketFactory: () => new SockJS("http://localhost:8080/server1"),
});

export default function Chat() {
  const [username, setUsername] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    client.onConnect = () => {
      console.log("Connected to Chat Room...");
      
      client.subscribe("/topic/return-to", (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, receivedMessage]);
      });

      client.subscribe("/topic/notification", (notify) => {
        const receivedNotification = notify.body;
        setMessages((prev) => [...prev, { content: receivedNotification, name: "System" }]);
      });

      client.publish({
        destination: "/app/chat.join",
        body: JSON.stringify({ name: storedUsername }),
      });
    };

    client.activate();
    
    return () => client.deactivate();  // Deactivate on unmount
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() && client) {
      const messageObject = {
        content: messageInput,
        name: username,
      };

      client.publish({
        destination: "/app/message",
        body: JSON.stringify(messageObject),
      });
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isOwnMessage = (messageUsername) => messageUsername === username;

  return (
    <div>
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <h2>Chat Room</h2>
          <span>Logged in as: {username}</span>
        </div>
        <div className={styles.chatInput}>
          <input
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.field}
          />
          <button className={styles.enter} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.allMessages} ${isOwnMessage(message.name) ? styles.ownMessages : styles.notOwnMessages}`}
          >
            <div>{message.content}</div>
            <small style={{ fontSize: "0.8em", opacity: 0.7 }}>
              {message.name || "Unknown user"}
            </small>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
}
