import React from "react";
import { FaUserCircle, FaCircle } from "react-icons/fa";

const MessagePopup = ({ onClose, friendList }) => {
  return (
    <div className="absolute right-0 top-12 w-80 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
      <div className="flex justify-between items-center p-3 border-b">
        <h4 className="font-semibold text-gray-700">Danh sách bạn bè</h4>
        <button onClick={onClose} className="text-gray-500 text-lg">
          X
        </button>
      </div>
      <ul className="max-h-64 overflow-y-auto">
        {friendList.map((friend, index) => (
          <li
            key={index}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            {/* Trạng thái online/offline */}
            <div className="relative">
              <FaCircle
                className={`absolute -top-1 -left-1 ${
                  friend.isOnline ? "text-green-500" : "text-gray-500"
                }`}
                size={12}
              />
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-10 h-10 rounded-full border-2 border-gray-300"
              />
            </div>
            <div>
              <div className="font-semibold">{friend.name}</div>
              <div className="text-xs text-gray-500">{friend.status}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagePopup;
