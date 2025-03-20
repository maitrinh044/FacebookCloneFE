// src/components/MessageLayout.jsx
import { useState, useEffect, useRef } from "react";


export default function MessageLayout({ chatList, selectedChat, onSelectChat, onUpdateChatList }) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat?.messages]);
  

  const handleSend = () => {
    if (inputText.trim() === "") return;

    const newMessage = { text: inputText, fromMe: true };

    // ✅ Cập nhật danh sách chat
    const updatedChatList = chatList.map((chat) => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: newMessage.text,
        };
      }
      return chat;
    });

    // ✅ Truyền danh sách mới về cho MessagePage để cập nhật state
    onUpdateChatList(updatedChatList);

    // ✅ Cập nhật lại selectedChat (nếu cần giữ đồng bộ)
    onSelectChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    });

    setInputText("");
  };

  return (
    <div className="flex bg-white shadow rounded-xl overflow-hidden h-[70vh]">
      {/* Sidebar danh sách chat */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h4 className="text-gray-500 text-sm mb-3 font-semibold">Cuộc trò chuyện</h4>
        <ul className="space-y-2">
          {chatList.map((chat) => (
            <li
              key={chat.id}
              className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                chat.id === selectedChat.id ? "bg-blue-100 font-semibold" : ""
              }`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="text-base">{chat.name}</div>
              <div className="text-sm text-gray-500 truncate">
                {chat.lastMessage}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Nội dung chat */}
      <div className="w-2/3 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-2 text-sm">
          {selectedChat?.messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-3 py-2 rounded-lg ${
                msg.fromMe
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* 👈 Đây là điểm cuộn xuống cuối */}
        </div>

        <div className="border-t p-3 flex">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
            placeholder="Nhập tin nhắn..."
          />
          <button
            onClick={handleSend}
            className="ml-2 px-4 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}

