// utils/useChatSocket.js
import { useEffect } from "react";
import { useStomp } from "../contexts/StompContext";

export const useChatSocket = ({ userId, onMessageReceived }) => {
  const { client, connected, reconnectWebSocket } = useStomp();

  useEffect(() => {
    if (!client || !connected || !userId || !client.connected) return;
  
    const subscription = client.subscribe(`/topic/messages/${userId}`, (message) => {
      const msg = JSON.parse(message.body);
      onMessageReceived?.(msg);
    });
  
    return () => subscription.unsubscribe();
  }, [client, connected, userId, onMessageReceived]);
  
  const sendMessage = (msgObj) => {
    if (!client || !connected) {
      reconnectWebSocket();
      return;
    }

    client.publish({
      destination: "/app/sendMessage",
      body: JSON.stringify(msgObj),
    });
  };

  return { sendMessage };
};
