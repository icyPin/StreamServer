package com.example.StreamingService.Websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    @Override
    public void afterConnectionEstablished (WebSocketSession session){
        sessions.add(session);
        System.out.println("New websocket connection established"+ session.getId());
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        String payLoad = message.getPayload();
        System.out.println("Message received: "+ payLoad);

        for (WebSocketSession Session : sessions) {
            if (Session.isOpen() && !session.getId().equals(Session.getId())) {
                Session.sendMessage(new TextMessage(payLoad));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session , CloseStatus status){
        sessions.remove(session);
        System.out.println("Connection closed for id: "+ session.getId());
        System.out.println("Reason: "+ status.getReason());
    }
}
