import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { Client } from "@stomp/stompjs";

const StompContext = createContext();

export const StompProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const userIdRef = useRef(null);

  const connect = useCallback((userId) => {
    if (client && connected) return;

    userIdRef.current = userId;

    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("STOMP connected");
        setConnected(true);

        // Publish sau khi kết nối thành công
        if (userIdRef.current) {
          stompClient.publish({
            destination: "/app/online",
            body: userIdRef.current,
          });
        }
      },
      onDisconnect: () => {
        console.log("STOMP disconnected");
        setConnected(false);
      },
    });

    stompClient.activate();
    setClient(stompClient);
  }, [client, connected]);

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

  return (
    <StompContext.Provider value={{ client, connect, disconnect, connected }}>
      {children}
    </StompContext.Provider>
  );
};

export const useStomp = () => useContext(StompContext);
