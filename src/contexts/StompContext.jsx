// contexts/StompContext.js
import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";

const StompContext = createContext();

export const StompProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const userIdRef = useRef(null);

  const connect = useCallback((userId) => {
    if (client && (client.active || client.connected)) return;

    userIdRef.current = userId;

    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ STOMP connected");
        setConnected(true);
        if (userIdRef.current) {
          stompClient.publish({
            destination: "/app/online",
            body: userIdRef.current,
          });
        }
      },
      onDisconnect: () => {
        console.log("❌ STOMP disconnected");
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
      },
    });

    stompClient.activate();
    setClient(stompClient);
  }, [client]);

  const disconnect = useCallback((userId) => {
    if (client && connected) {
      try {
        client.publish({
          destination: "/app/offline",
          body: userId,
        });
      } catch (err) {
        console.warn("Cannot publish offline message:", err.message);
      }
      client.deactivate();
      setConnected(false);
    }
  }, [client, connected]);

  const reconnectWebSocket = useCallback(() => {
    if (!client || !connected) {
      connect(userIdRef.current);
    }
  }, [client, connected, connect]);

  return (
    <StompContext.Provider value={{ client, connect, disconnect, connected, reconnectWebSocket }}>
      {children}
    </StompContext.Provider>
  );
};

export const useStomp = () => useContext(StompContext);
