// src/contexts/StompContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";

const StompContext = createContext();

export const StompProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);

  const connect = (userId) => {
    if (client && connected) return;  // Nếu đã kết nối, tránh kết nối lại

    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("STOMP connected");
        stompClient.publish({
          destination: "/app/online",
          body: userId,
        });
        setConnected(true);
      },
      onDisconnect: () => {
        console.log("STOMP disconnected");
        setConnected(false);
      },
    });

    stompClient.activate();
    setClient(stompClient);
  };

  const disconnect = (userId) => {
    if (client && connected) {
      client.publish({
        destination: "/app/offline",
        body: userId,
      });
  
      // Ngắt kết nối STOMP client
      client.deactivate();
  
      // Cập nhật trạng thái "không kết nối"
      setConnected(false);
  
      // Gọi sự kiện onDisconnect của STOMP Client
      if (client.onDisconnect) {
        client.onDisconnect();  // Bạn có thể thêm callback ở đây nếu cần xử lý thêm.
      }
  
      console.log(`User ${userId} has been logged out.`);
    }
  };
  

  return (
    <StompContext.Provider value={{ client, connect, disconnect, connected }}>
      {children}
    </StompContext.Provider>
  );
};

export const useStomp = () => useContext(StompContext);
