// utils/useCallSocket.js
import { useEffect } from "react";
import { useStomp } from "../contexts/StompContext";

export const useCallSocket = ({ userId, onSignalReceived }) => {
  const { client, connected, reconnectWebSocket } = useStomp();

  useEffect(() => {
    if (!client || !connected || !userId || !client.connected) return;

    let subscription;

    try {
      subscription = client.subscribe(`/user/topic/call`, (message) => {
        const signal = JSON.parse(message.body);
        onSignalReceived?.(signal);
      });
    } catch (err) {
      console.error("Subscription error:", err);
    }

    return () => {
      try {
        subscription?.unsubscribe();
      } catch (err) {
        console.warn("Unsubscribe failed:", err);
      }
    };
  }, [client, connected, userId, onSignalReceived]);

  const sendSignal = (signalObj) => {
    if (!client || !connected) {
      reconnectWebSocket();
      return;
    }
    console.log("sent signal: ", signalObj);

    client.publish({
      destination: "/app/call",
      body: JSON.stringify(signalObj),
    });
  };

  return { sendSignal };
};
