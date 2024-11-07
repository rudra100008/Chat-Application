package com.chatApp.Controller;

import com.chatApp.Entity.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

// to connect to server -> sever1
// to pass message from frontend -> /app/message
// to receive/subscribe the message -> /topic/return-to
@RestController
public class MessageController {

    // Clients who are subscribed to the url "/topic/return-to" can see the messages of the other users
    // subscribed is like YouTube channel where only those who have subscribed to the channel can get notify if a video is uploaded
    @MessageMapping("/message")
    @SendTo("/topic/return-to")
    public Message getContent(@RequestBody Message message){
        try{
            Thread.sleep(2000); //2000 millisecond == 2 second
        }catch (InterruptedException e){
            e.printStackTrace();
        }
        return  message;
    }
}
