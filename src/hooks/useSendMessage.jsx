// src/hooks/useSendMessage.js
import { useState } from 'react';
import { addNewMessage } from '../services/MessageService';

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (message) => {
    setLoading(true);
    setError(null);  // Reset lỗi trước khi gửi

    try {
      const savedMessage = await addNewMessage(message);  // Gọi hàm addNewMessage để gửi tin nhắn
      console.log("Tin nhắn đã được gửi:", savedMessage);
      return savedMessage;
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
      setError("Lỗi khi gửi tin nhắn");
      throw err;
    } finally {
      setLoading(false);  // Reset loading sau khi hoàn tất
    }
  };

  return {
    sendMessage,
    loading,
    error,
  };
};

export default useSendMessage;

