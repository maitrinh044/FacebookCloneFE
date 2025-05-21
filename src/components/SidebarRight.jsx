import { FaUserCircle } from "react-icons/fa";
import useFetchUserFriends from "../utils/useFetchUserFriends";
import { useState, useEffect } from "react";

export default function SidebarRight({ onOpenChat }) {
  const { friends, loading, error } = useFetchUserFriends();

  let sortedFriends = [];
  const { onlineUsers } = ["1"];


  // if (Array.isArray(friends)) {
  //   sortedFriends = friends.map(friend => ({
  //     ...friend,
  //     online: onlineUsers.has(friend.id.toString()),  // Kiểm tra xem user có trong onlineUsers không
  //   })).sort((a, b) => b.online - a.online);  // Sắp xếp bạn bè theo trạng thái online
  // }



  return (
    <div className="w-64 pt-20 px-4 bg-white min-h-screen border-l border-gray-300 rounded-[10px]">
      <h3 className="text-sm font-semibold mb-4 text-gray-500">Người liên hệ</h3>
      <ul className="space-y-3">
        {friends.map((friend, index) => (
          <li
            key={index}
            className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
            onClick={() => onOpenChat(friend)}
          >
            {/* <img
              src={friend.profilePicture || "/default-avatar.png"}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            /> */}
            {friend.profilePicture != null ? (
              <img
                src={friend.profilePicture}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="w-10 h-10 rounded-full object-cover text-gray-300"/>
            )}
            <span className="text-sm">{`${friend.firstName} ${friend.lastName}`}</span>
            <span
              className={`w-2 h-2 rounded-full ml-auto ${friend.online ? "bg-green-500" : ""
                }`}
            />

          </li>
        ))}
      </ul>
    </div>
  );
}
