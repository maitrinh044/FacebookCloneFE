// src/components/ChatBox.jsx
import { useState } from "react";
import MessageInput from "./MessageInput";

export default function ChatBox({ user }) {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (msg) => {
    setMessages((prev) => [...prev, { text: msg, fromMe: true }]);
    // Mô phỏng phản hồi tự động
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: msg, fromMe: true },
        { text: "Tôi đã nhận được tin nhắn!", fromMe: false },
      ]);
    }, 1000);
  };

  return (
    <div className="bg-white border rounded-lg shadow w-72 flex flex-col overflow-hidden">
      <div className="bg-blue-500 text-white p-2 text-sm font-semibold">
        {user.name}
      </div>
      <div className="flex-1 p-2 overflow-y-auto space-y-2 text-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[70%] p-2 rounded-lg ${
              msg.fromMe
                ? "ml-auto bg-blue-100 text-right"
                : "bg-gray-100 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
