import { useState, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import SendMessageForm from "./SendMessageForm"; 
import { useChatSocket } from "../../utils/useChatSocket";
import { addNewMessage } from "../../services/MessageService";
import { useStomp } from "../../contexts/StompContext";

export default function MessageLayout({
  chatList,
  selectedChat,
  onSelectChat,
  onUpdateChatList,
  currentUserId,
}) {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  // const [localSelectedChat, setLocalSelectedChat] = useState(selectedChat);
  const { connect, connected } = useStomp();

  useEffect(() => {
    if (currentUserId) {
      connect(currentUserId);
    }
  }, [currentUserId, connect]);

  const { sendMessage } = useChatSocket({
    userId: currentUserId,
    onMessageReceived: (newMessage) => {
      const updatedMessages = [...selectedChat.messages, newMessage];
      const updatedChatList = chatList.map(chat =>
        chat.user.id === selectedChat.user.id
          ? { ...chat, messages: updatedMessages }
          : chat
      );
      onUpdateChatList(updatedChatList);
      onSelectChat(updatedChatList.find(chat => chat.user.id === selectedChat.user.id));
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  const handleSend = async (newMessage) => {
    const receiverId = selectedChat?.user?.id;
    if (!receiverId) return;

    console.log("new msg: ", newMessage);
    const savedMessage = await addNewMessage(newMessage);
    if (savedMessage != null) {
      sendMessage(newMessage);
    }
    const updatedMessages = [...selectedChat.messages, newMessage];

    const updatedChatList = chatList.map(chat =>
      chat.user.id === receiverId
        ? {
            ...chat,
            messages: updatedMessages,
            lastMessage: {
              content: newMessage.content,
              senderId: newMessage.senderId,
              senderName: "Bạn",
            },
          }
        : chat
    );

    onUpdateChatList(updatedChatList);
    onSelectChat(updatedChatList.find(chat => chat.user.id === receiverId));
  };




  console.log("selected chat: ", selectedChat);
  // console.log(chatList);
  console.log("current id: ", currentUserId);


  return (
    <div className="flex bg-white shadow overflow-hidden h-full w-full">
      {/* Sidebar danh sách chat */}
      <div className="w-1/4 border-r p-4 overflow-y-auto">
        <h4 className="text-gray-500 text-sm mb-3 font-semibold">Cuộc trò chuyện</h4>
        <ul className="space-y-2">
          {chatList.map((chat) => (
            <li
              key={chat.user.id}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${chat.user.id == selectedChat?.user.id ? "bg-blue-100 font-semibold" : ""
                }`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="relative">
                <img
                  src={chat.avatar || "https://placehold.co/40x40"}
                  alt={chat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white ${chat.user.online ? "bg-green-500" : "bg-gray-400"
                    }`}></span>
              </div>
              <div className="flex flex-col">
                <div className="text-base">{chat.user.firstName} {chat.user.lastName}</div>
                <div className="text-sm text-gray-500 truncate">
                  {chat.lastMessage.content
                    ? chat.lastMessage?.senderId.id == currentUserId
                      ? `Bạn: ${chat.lastMessage?.content}`
                      : `${chat.lastMessage.senderId?.firstName}: ${chat.lastMessage?.content}`
                    : ""}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Nội dung chat */}
      <div className="w-3/4 flex flex-col">
        {selectedChat && (
          <>
            <ChatHeader chatUser={selectedChat} />
            <div className="flex-1 p-4 overflow-y-auto space-y-2 text-sm">
              {selectedChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-xs px-3 py-2 rounded-lg transition-all duration-200 ease-in-out ${msg.senderId.id == currentUserId
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Gọi SendMessageForm */}
            <SendMessageForm
              onSend={handleSend}  // Truyền vào hàm handleSend
              senderId={currentUserId}  // Truyền ID người gửi
              receiverId={selectedChat.user.id}  // Truyền ID người nhận
              inputRef={inputRef}  // Truyền ref cho input
            />
          </>
        )}
      </div>
    </div>
  );
}
