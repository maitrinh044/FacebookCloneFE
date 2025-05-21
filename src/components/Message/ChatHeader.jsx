// src/components/ChatHeader.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaPhoneAlt, FaVideo, FaEllipsisV, FaBellSlash, FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";

const ChatHeader = ({ chatUser }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!chatUser) return null;

  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b bg-white shadow-sm rounded-t-xl relative">
      {/* Avatar + Info */}
      <div className="flex items-center gap-4">
        {chatUser.profilePicture != null ? (
          <img
            src={chatUser.profilePicture}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-10 h-10 rounded-full object-cover text-gray-300"/>
        )}
        
        <div>
          <div className="font-semibold text-lg">{chatUser.user.firstName} {chatUser.user.lastName}</div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                chatUser.user.online ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            {chatUser.user.online ? "Đang hoạt động" : "Ngoại tuyến"}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 text-gray-600 relative">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <FaPhoneAlt />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <FaVideo />
        </button>

        {/* Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaEllipsisV />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-12 w-56 bg-white shadow-lg border rounded-xl z-50 text-sm text-gray-700">
              <ul>
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <FaBellSlash className="text-gray-500" />
                  Tắt thông báo
                </li>
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <FaEdit className="text-gray-500" />
                  Đổi tên đoạn chat
                </li>
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
                  <FaTrash className="text-red-500" />
                  Xóa đoạn chat
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
