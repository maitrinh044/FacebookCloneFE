// src/components/MessagePanel.jsx
import { useState } from "react";
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

export default function MessagePanel({ friendName, onClose, positionOffset }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { from: friendName, text: "Chào bạn!" },
    { from: "Bạn", text: `Chào ${friendName}!` },
  ]);
  const [inputText, setInputText] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [callType, setCallType] = useState(null); // 'voice' hoặc 'video'
  const [callInfo, setCallInfo] = useState(null);

  const handleSend = () => {
    if (inputText.trim() !== "") {
      setMessages([...messages, { from: "Bạn", text: inputText }]);
      setInputText("");
    }
  };

  const avatarUrl = "https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-6/458161522_2243394162660512_7913931544320209269_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFE4H0KfJHUauSeB90nsw9jIBJwHuSktOAgEnAe5KS04F5KUxSkb8DlPyoPUcf2mlb9fV6MzqCuAtSLoc7Ay6-A&_nc_ohc=CXoMMnzvULoQ7kNvgEh0ypF&_nc_oc=Adhd1HcZH8ihnu0nOpaHQL9P6zFJqIzADQy2tSGyfmQKeSJV_6Hkf7Xvt4OoxnzJG3Y&_nc_zt=23&_nc_ht=scontent.fsgn5-6.fna&_nc_gid=AQR7ZI_aDJOrecOKCXIigMN&oh=00_AYGQ7t7qCRDcZNQEIHRWgbCoYPYdNv04Mz2JyaDNxAK61w&oe=67D6AB59"; // dùng avatar tạm theo tên

  const handleCall = (type) => {
    setCallInfo({
      type,
      friendName,
      avatarUrl,
    });
  };
  
  
  const handleEndCall = () => setCallInfo(null);

  const panelWidth = 320;
  const spacing = 16;
  const rightOffset = positionOffset * (panelWidth + spacing);

  return (
    <div
      className="fixed bottom-4 w-80 bg-white shadow-lg rounded-xl border border-gray-300 flex flex-col"
      style={{ right: `${rightOffset}px` }}
    >
      {/* Header */}
      <div className="bg-blue-600 text-white p-3 rounded-t-xl font-semibold flex justify-between items-center">
        <span>{friendName}</span>
        <div className="flex items-center gap-2">
          <button title="Gọi thoại" onClick={() => handleCall("voice")}>
            <FaPhone />
          </button>
          <button title="Gọi video" onClick={() => handleCall("video")}>
            <FaVideo />
          </button>
          <button onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <button
            onClick={() => navigate("/messages", { state: { friendName } })}
            title="Mở toàn bộ đoạn chat"
          >
            <FaExpand />
          </button>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>
      </div>

      {callType && (
        <CallModal
          type={callType}
          friendName={friendName}
          onClose={() => setCallType(null)}
        />
      )}

      {callInfo && (
        <CallOverlay
          friendName={callInfo.friendName}
          avatarUrl={callInfo.avatarUrl}
          isVideo={callInfo.type === "video"}
          onEndCall={() => setCallInfo(null)}
        />
      )}

      {!isMinimized && (
        <>
          <div className="flex-1 p-3 h-64 overflow-y-auto text-sm">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="font-semibold">{msg.from}:</span> {msg.text}
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={handleSend}
              className="ml-2 px-4 bg-blue-500 text-white rounded-full text-sm"
            >
              Gửi
            </button>
          </div>
        </>
      )}
    </div>
  );
}
