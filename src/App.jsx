// src/App.jsx
import { useState, useEffect } from "react";
import MessagePanel from "./components/Message/MessagePanel";
import AppRouter from "./routes/AppRouter";
import ScrollToTop from "./components/ScrollToTop";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import LoadingOverlay from "./components/common/LoadingOverlay";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStomp } from "./contexts/StompContext";

function MainApp() {

  const [openChats, setOpenChats] = useState([]);
  const { loading } = useLoading(); // ✅ Gọi useLoading trong component con

  const { connect, disconnect } = useStomp(); // Lấy hàm connect và disconnect từ context

  const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        // Kiểm tra nếu người dùng đã đăng nhập và có userId
        const userId = localStorage.getItem("userId");
        if (userId) {
            connect(userId); // Kết nối WebSocket khi ứng dụng load nếu người dùng đã đăng nhập
        }
        
        // Cleanup khi component bị unmount
        return () => {
            if (userId) {
                disconnect(userId); // Ngắt kết nối khi ứng dụng tắt hoặc logout
            }
        };
    }, [connect, disconnect]);

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
      {loading && <LoadingOverlay />} {/* ✅ Loader nằm trong UI */}
      <ScrollToTop />
      <AppRouter onOpenChat={handleOpenChat} />
      <div className="fixed bottom-4 right-4 flex gap-4">
        {openChats.map((chat, index) => (
          <MessagePanel
            key={chat.id}
            friend={chat}
            onClose={() => handleCloseChat(chat)}
            positionOffset={index}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LoadingProvider>
      <MainApp />
      <ToastContainer 
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        toastClassName="custom-toast"
      />
    </LoadingProvider>
  );
}
