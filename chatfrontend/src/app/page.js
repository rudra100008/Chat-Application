"use client";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";
import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const client = new Client({
  webSocketFactory: () => new SockJS("http://localhost:8080/server1"),
});

export default function Home() {
  const route = useRouter();
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);

  const connectWebSocket = () => {
    if (!username.trim()) {
      alert("Please enter username");
      return;
    }

    client.onConnect = () => {
      console.log("Connected to server");
      setConnected(true);
      localStorage.setItem("username", username);  // Save username
    };

    client.onError = (error) => {
      console.error("WebSocket error:", error);
      setConnected(false);
    };

    client.activate();
  };

  useEffect(() => {
    if (connected) {
      route.push("/chat");
    }
  }, [connected, route]);

  return (
    <div className={styles.chatbody}>
      <div className={styles.chatCard}>
        <h3>Join Chat</h3>
        <div>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className={styles.field}
          />
          <button className={styles.enter} onClick={connectWebSocket}>
            Join Chat
          </button>
        </div>
      </div>
    </div>
  );
}
