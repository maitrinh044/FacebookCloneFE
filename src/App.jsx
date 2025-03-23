// src/App.jsx
import { useState } from "react";
import MessagePanel from "./components/Message/MessagePanel";
import AppRouter from "./routes/AppRouter";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const [openChats, setOpenChats] = useState([]);
  const userId = 1;

  const handleOpenChat = (friend) => {
    if (!openChats.find((chat) => chat.id === friend.id)) {
      setOpenChats([...openChats, friend]);
    }
  };

  const handleCloseChat = (friend) => {
    setOpenChats(openChats.filter((chat) => chat.id !== friend.id));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <ScrollToTop />
      <AppRouter onOpenChat={handleOpenChat} />
      <div className="fixed bottom-4 right-4 flex gap-4">
        {openChats.map((chat, index) => (
          <MessagePanel
            key={chat.id}
            friend={chat}
            onClose={() => handleCloseChat(chat)}
            positionOffset={index}
          />
        ))}
      </div>
    </div>
  );
}
