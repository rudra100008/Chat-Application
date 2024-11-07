"use client"
import { useEffect, useRef, useState } from "react"
import styles from "../page.module.css"
import { Client } from "@stomp/stompjs";

export default function Chat() {
    const [username, setUsername] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);
    const clientref = useRef(null);
    const messageref = useRef(null);

    useEffect(()=>{
        setUsername(localStorage.getItem('username'))
        
        const client = new Client({
            onConnect: ()=>{
                console.log("connected to client Socket")
                client.subscribe('/topic/return-to',(message)=>{
                    const receivedMessage = JSON.parse(message.body);
                    setMessages((prev)=>[...prev,receivedMessage])

                })
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
              },
              onError: (error) => {
                console.error('WebSocket Error:', error);
              },
        })
        client.activate();
        clientref.current =client;
        return ()=>{
            if(client){
                client.deactivate();
            }
        }
    },[])

    const handleKeyPress=(e)=>{
        if(e.key === 'Enter'){
            sendMessage();
        }
    }

    const sendMessage=()=>{

    }

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <h2>Chat Room</h2>
                <span>Logged in as : {username}</span>
            </div>
            <div className={styles.chatInput}>
                <input 
                type="text"
                id="message"
                username="message"
                placeholder="Type a message......."
                value={messageInput}
                onChange={(e)=> setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className={styles.field}
                />
                <button className={styles.enter} onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    )
}