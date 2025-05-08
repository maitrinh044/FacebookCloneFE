import { useState, useEffect, useRef } from "react";
import { useFetchMessages } from "../../utils/useFetchMessage";
import MessageList from "./MessageList";
import SendMessageForm from "./SendMessageForm";
import { addNewMessage } from "../../services/MessageService";
import { useLocation } from "react-router-dom";
import { getMessageList } from '../../services/MessageService';
import { useChatSocket } from "../../utils/useChatSocket";

import {
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaExpand,
  FaPhone,
  FaVideo,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CallModal from "../Message/CallModal";
import CallOverlay from "../Message/CallOverlay";

export default function MessagePanel({ friend, onClose, positionOffset, currentUserId }) {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [callType, setCallType] = useState(null);
  const [callInfo, setCallInfo] = useState(null);
  const scrollRef = useRef(null);

  const avatarUrl = "https://placehold.co/40x40";
  const inputRef = useRef(null);
  const location = useLocation();
  const [messageList, setMessageList] = useState([]);
  const [localMessages, setLocalMessages] = useState([]);

  let receiverId = friend.id;

  const { sendMessage } = useChatSocket({
    userId: currentUserId,
    onMessageReceived: (msg) => {
      console.log("Nhận được tin nhắn mới: ", msg);
      setMessageList((prevMessages) => [...prevMessages, msg]); // Cập nhật UI
    },
  });  

  const fetchMessages = async () => {
    try {
      console.log("current id: ",currentUserId);
      const data = await getMessageList(currentUserId, receiverId);
      setMessageList(data);
    } catch (e) {
      console.error("Lỗi khi fetch messages:", e);
    }
  };

  useEffect(() => {
    if (currentUserId && receiverId) {
      fetchMessages();
    }
  }, [currentUserId, receiverId]);


  const handleSendMessage = async (msgObj) => {
    try {
      setLocalMessages((prev) => [...prev, msgObj]); // Thêm tin nhắn vào UI tạm thời
      await addNewMessage(msgObj); // Gửi tin nhắn vào server
      sendMessage(msgObj); // Gửi tin nhắn qua WebSocket
      await fetchMessages(); // Cập nhật lại tin nhắn từ server
      setLocalMessages([]); // Xóa tin nhắn tạm thời
    } catch (e) {
      console.error("Gửi tin nhắn lỗi:", e);
    }
  };

  const handleEndCall = () => setCallInfo(null);

  const panelWidth = 320;
  const spacing = 16;
  const rightOffset = positionOffset * (panelWidth + spacing);

  return (
    <>
      {location.pathname !== "/messages" && (
        <div
          className="fixed bottom-4 w-80 bg-white shadow-xl rounded-2xl border border-gray-300 flex flex-col overflow-hidden"
          style={{ right: `${rightOffset}px` }}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${friend.online ? "bg-green-500" : "bg-gray-400"
                    }`}></span>
              </div>
              <span>{friend.firstName} {friend.lastName}</span>
            </div>
            <div className="flex items-center gap-2">
              <button title="Gọi thoại" className="hover:bg-blue-700 p-1 rounded-full" onClick={() => handleCall("voice")}>
                <FaPhone size={14} />
              </button>
              <button title="Gọi video" className="hover:bg-blue-700 p-1 rounded-full" onClick={() => handleCall("video")}>
                <FaVideo size={14} />
              </button>
              <button className="hover:bg-blue-700 p-1 rounded-full" onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              <button title="Mở toàn bộ đoạn chat" className="hover:bg-blue-700 p-1 rounded-full" onClick={() => navigate("/messages", { state: { friend } })}>
                <FaExpand size={14} />
              </button>
              <button className="hover:bg-blue-700 p-1 rounded-full" onClick={onClose}>
                <FaTimes size={14} />
              </button>
            </div>
          </div>

          {callType && <CallModal type={callType} friendName={friend.firstName} onClose={() => setCallType(null)} />}
          {callInfo && <CallOverlay friendName={callInfo.friendName} avatarUrl={callInfo.avatarUrl} isVideo={callInfo.type === "video"} onEndCall={handleEndCall} />}

          {!isMinimized && (
            <>
              {/* Scrollable Message Area */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto text-sm bg-gray-50 flex flex-col-reverse"
                style={{ maxHeight: "300px", minHeight: "150px" }}
              >
                <MessageList
                  currentUserId={currentUserId}
                  receiverId={friend.id}
                  messageList={messageList.concat(localMessages)}  // Kết hợp cả tin nhắn từ server và tin nhắn đã gửi
                />
              </div>
              <SendMessageForm
                senderId={currentUserId}
                receiverId={friend.id}
                inputRef={inputRef}
                onSend={handleSendMessage}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
