// useChatSocket.js
import { useEffect } from "react";
import { useStomp } from "../contexts/StompContext";

export const useChatSocket = ({ userId, onMessageReceived }) => {
  const { client, connected } = useStomp();

  useEffect(() => {
    if (!client || !connected || !userId) return;

    const sub = client.subscribe(`/topic/messages/${userId}`, (message) => {
      const msg = JSON.parse(message.body);
      onMessageReceived?.(msg);
    });

    return () => sub.unsubscribe();
  }, [client, connected, userId, onMessageReceived]);

  const sendMessage = (msgObj) => {
    if (!client || !connected) return;
    client.publish({
      destination: "/app/sendMessage",
      body: JSON.stringify(msgObj),
    });
  };

  return { sendMessage };
};
