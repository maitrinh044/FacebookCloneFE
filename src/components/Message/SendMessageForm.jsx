import React, { useRef, useState } from 'react';
import useSendMessage from '../../hooks/useSendMessage';
import { FaPaperPlane } from 'react-icons/fa';
import { getLocalISOStringWithoutMs } from "../../utils/dateUtil";

const SendMessageForm = ({ senderId, receiverId, onSend, inputRef }) => {
  const { sendMessage, loading, error } = useSendMessage();
  const [inputText, setInputText] = useState("");  // Sử dụng useState để quản lý giá trị input

  const handleSend = async () => {
    const messageContent = inputText.trim();

    if (!messageContent) {
      return; // Nếu không có tin nhắn, không gửi
    }

    const newMessage = {
      senderId: { id: senderId },
      receiverId: { id: receiverId },
      content: messageContent,
      type: "TEXT",
      sendAt: getLocalISOStringWithoutMs(),
      activeStatus: "ACTIVE"
    };

    try {
      await onSend(newMessage);
      setInputText("");
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();  // Ngăn không cho dòng mới
      handleSend();
    }
  };

  return (
    <div className="p-3 border-t flex items-center gap-2 bg-white">
      <input
        ref={inputRef}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}  // Cập nhật giá trị inputText
        onKeyDown={handleKeyDown}  // Xử lý khi nhấn Enter
        className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none"
        placeholder="Nhập tin nhắn..."
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
        disabled={loading}  // Disable button khi đang gửi tin nhắn
      >
        <FaPaperPlane size={16} />
      </button>
    </div>
  );
};

export default SendMessageForm;
