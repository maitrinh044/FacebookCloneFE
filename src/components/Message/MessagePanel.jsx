import { useState, useEffect, useRef } from "react";
import { useFetchMessages } from "../../utils/useFetchMessage";
import MessageList from "./MessageList";
import SendMessageForm from "./SendMessageForm";
import { addNewMessage } from "../../services/MessageService";
import { useLocation } from "react-router-dom";
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

export default function MessagePanel({ friend, onClose, positionOffset, currentUserId = 1 }) {
  const navigate = useNavigate();
  const { messageList = [], loading, refetch } = useFetchMessages(currentUserId, friend.id); // thêm refetch để làm mới danh sách tin nhắn
  const [localMessages, setLocalMessages] = useState([]);  // Lưu tin nhắn đã gửi
  const [isMinimized, setIsMinimized] = useState(false);
  const [callType, setCallType] = useState(null);
  const [callInfo, setCallInfo] = useState(null);
  const scrollRef = useRef(null);

  const avatarUrl = "https://placehold.co/40x40";
  const inputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMinimized]);

  // Cuộn xuống khi tin nhắn mới được gửi hoặc nhận
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
        });
      }, 0);
    }
  }, [messageList, localMessages]);  // Thêm localMessages vào dependency để đảm bảo khi có tin nhắn mới sẽ cuộn xuống

  const handleCall = (type) => {
    setCallType(type);
    setCallInfo({ type, friendName: friend.firstName, avatarUrl });
  };

  const handleEndCall = () => setCallInfo(null);

  const panelWidth = 320;
  const spacing = 16;
  const rightOffset = positionOffset * (panelWidth + spacing);

  const handleSendMessage = async (msgObj) => {
    try {
      const savedMessage = await addNewMessage(msgObj);
      setLocalMessages((prev) => [...prev, savedMessage]);  // Thêm tin nhắn đã gửi vào localMessages
      await refetch();  // Đảm bảo làm mới danh sách tin nhắn từ server
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
    }
  };

  console.log("local1", localMessages);
  console.log("messageList: ", messageList);
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
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    friend.online ? "bg-green-500" : "bg-gray-400"
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
