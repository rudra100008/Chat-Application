import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import styles from '../page.module.css';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [username, setUsername] = useState('');
  const clientRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Get the username from the previous page
    setUsername(localStorage.getItem('username'));

    // Connect to the WebSocket server
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/server1'),
      onConnect: () => {
        console.log('Connected to WebSocket');

        // Subscribe to the topic where messages will be received
        client.subscribe('/topic/return-to', (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
      },
      onError: (error) => {
        console.error('WebSocket Error:', error);
      },
    });

    client.activate();
    clientRef.current = client;

    // Cleanup on component unmount
    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() && clientRef.current) {
      const messageObject = {
        content: messageInput.trim(),
        username: username,
        timestamp: new Date().toISOString(),
        type: 'CHAT',
      };

      clientRef.current.publish({
        destination: '/app/message',
        body: JSON.stringify(messageObject),
      });

      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h2>Chat Room</h2>
        <span>Logged in as: {username}</span>
      </div>
      <div className={styles.chatMessages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.username === username ? styles.ownMessage : ''
            }`}
          >
            <div className={styles.messageContent}>
              <div className={styles.username}>{msg.username}</div>
              <div>{msg.content}</div>
              <div className={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className={styles.inputField}
        />
        <button onClick={sendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}