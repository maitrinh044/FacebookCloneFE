// src/pages/MessagePage.jsx
import { useState, useEffect } from "react";
import MessageLayout from "../components/Message/MessageLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserFriends } from "../services/UserService";
import { getMessageList } from "../services/MessageService";


export default function MessagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { friend } = location.state || {};
  const currentUserId = 1;

  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState( null);

  // Load chat list
  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const friends = await getUserFriends(currentUserId);

        const updatedChatList = await Promise.all(
          friends.map(async (f) => {
            const messages = await getMessageList(currentUserId, f.id);
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : "Chưa có tin nhắn";
            return {
              user: f,
              lastMessage,
              messages,
            };
          })
        );

        setChatList(updatedChatList);
      } catch (error) {
        console.error("Lỗi khi load chat list:", error);
      }
    };

    fetchChatList();
  }, [currentUserId]);

  // Gán selectedChat theo friend truyền vào sau khi chatList load xong
  useEffect(() => {
    if (friend && chatList.length > 0) {
      const foundChat = chatList.find(chat => chat.user.id === friend.id);
      if (foundChat) {
        setSelectedChat(foundChat);
      }
    } else if (chatList.length > 0 && !selectedChat) {
      setSelectedChat(chatList[0]);
    }
  }, [friend, chatList]);


  return (
    <div className="pt-0 h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <MessageLayout
          chatList={chatList}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          onUpdateChatList={setChatList}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
  
  
}
