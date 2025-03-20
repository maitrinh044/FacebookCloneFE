// src/App.jsx
import { useState } from "react";
import MessagePanel from "./components/Message/MessagePanel";
import Header from "./components/Header";
import AppRouter from "./router/AppRouter";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const [openChats, setOpenChats] = useState([]);

  const handleOpenChat = (friendName) => {
    if (!openChats.find((chat) => chat.name === friendName)) {
      setOpenChats([...openChats, { name: friendName }]);
    }
  };

  const handleCloseChat = (friendName) => {
    setOpenChats(openChats.filter((chat) => chat.name !== friendName));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <ScrollToTop />
      <div className="pt-16">
        <AppRouter onOpenChat={handleOpenChat} />
      </div>

      <div className="fixed bottom-4 right-4 flex gap-4">
        {openChats.map((chat, index) => (
          <MessagePanel
            key={chat.name}
            friendName={chat.name}
            onClose={() => handleCloseChat(chat.name)}
            positionOffset={index}
          />
        ))}
      </div>
    </div>
  );
}
