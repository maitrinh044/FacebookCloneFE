// src/pages/MessagePage.jsx
import { useState, useEffect } from "react";
import MessageLayout from "../components/Message/MessageLayout";
import { useNavigate, useLocation } from "react-router-dom";

export default function MessagePage() {
  const navigate = useNavigate(); // <-- Hook để chuyển trang
  const location = useLocation();
  const { friendName } = location.state || {};
  const [chatList, setChatList] = useState([
    {
      id: 1,
      name: "An Nguyễn",
      lastMessage: "Hẹn gặp nhé!",
      messages: [
        { text: "Chào bạn!", fromMe: false },
        { text: "Hi An!", fromMe: true },
        { text: "Hẹn gặp nhé!", fromMe: false },
      ],
    },
    {
      id: 2,
      name: "Bảo Trân",
      lastMessage: "Tối đi ăn không?",
      messages: [
        { text: "Tối đi ăn không?", fromMe: false },
      ],
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(chatList[0]);

  useEffect(() => {
    if (friendName) {
      const foundChat = chatList.find(chat => chat.name === friendName);
      if (foundChat) setSelectedChat(foundChat);
    }
  }, [friendName]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Tin nhắn</h2>
      </div>
      <MessageLayout
        chatList={chatList}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        onUpdateChatList={setChatList} // 👈 thêm dòng này
      />

    </div>
  );
}
       