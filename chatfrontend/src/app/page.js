"use client";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";
import { useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function Home() {
  const route = useRouter();
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const connectWebSocket=()=>{
    if(!username.trim()){
      alert("Please enter username")
    }
    const client = new Client({
      webSocketFactory : ()=> new SockJS('https://localhost:8080/server1'),
      onConnect: ()=>{
        console.log('Connection success....')
        setConnected(true)
        client.subscribe('/topic/return-to',(message)=>{
          const receivedMessage = JSON.parse(message.body)
          setMessages((prev)=>[...prev, receivedMessage])
        });
        client.publish({
          destination : "/app/message",
          body : JSON.stringify({
            username: `${username}`,
            content : `${username} joined chat`
          })
        });
        if(connected) {
          localStorage.setItem('username', username);
          route.push('/chat');
        }
      },
      onDisconnect: ()=>{
        console.log("Disconnected From Server");
        setConnected(false)
      },
      onError:(error)=>{
        console.log(error)
        setConnected(false)
      }
    })
    client.activate();
    
  }
  return (
    <div className={styles.chatbody}>
      <div className={styles.chatCard}>
        <h3>Join Chat</h3>
        <div>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
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
