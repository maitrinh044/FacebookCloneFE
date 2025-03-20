// src/components/MessageInput.jsx
import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() !== "") {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="p-2 flex gap-2 border-t border-gray-200">
      <input
        type="text"
        className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none"
        placeholder="Nhập tin nhắn..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm"
      >
        Gửi
      </button>
    </div>
  );
}
