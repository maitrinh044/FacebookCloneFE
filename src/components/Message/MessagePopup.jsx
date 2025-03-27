import React, { useEffect, useRef } from "react";
import { FaTimes, FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MessagePopup = ({ onClose, chatList, onSelectFriend }) => {
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute right-4 top-14 w-80 bg-white shadow-lg rounded-2xl border border-gray-300 z-50"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-gray-100 rounded-t-2xl">
        <h4 className="font-semibold text-gray-700 text-sm">Tin nhắn</h4>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes size={16} />
        </button>
      </div>

      {/* Danh sách tin nhắn */}
      <ul className="max-h-80 overflow-y-auto">
        {chatList.map((chat, index) => (
          <li
            key={index}
            onClick={() => {
              onSelectFriend(chat.friend);
              onClose();
            }}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
          >
            {/* Ảnh đại diện với trạng thái online */}
            <div className="relative">
              <img
                src={chat.friend.profilePicture || "https://via.placeholder.com/40"}
                alt={chat.friend.name}
                className="w-10 h-10 rounded-full border border-gray-300"
              />
              {chat.friend.online && (
                <FaCircle className="absolute bottom-0 right-0 text-green-500 bg-white rounded-full p-0.5" size={10} />
              )}
            </div>

            {/* Thông tin bạn bè & tin nhắn gần nhất */}
            <div className="flex-1">
              <div className="font-semibold">{chat.friend.firstName} {chat.friend.lastName}</div>
              <div className="text-xs text-gray-500 truncate max-w-[200px]">
                {chat.lastMessage?.content || "Chưa có tin nhắn"} {/* Tin nhắn gần nhất */}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Nút "Xem tất cả" */}
      <div className="p-3 border-t bg-gray-100 rounded-b-2xl">
        <button
          onClick={() => {
            navigate("/messages");
            onClose();
          }}
          className="w-full text-sm text-blue-500 hover:underline"
        >
          Xem tất cả tin nhắn
        </button>
      </div>
    </div>
  );
};

export default MessagePopup;
