import { useState } from "react";
import { FaUserPlus, FaTimes, FaUserCheck } from "react-icons/fa";
import { message } from "antd";
import Sidebar from "../components/FriendList/Sidebar";

const mockSuggestions = [
  { id: 1, name: "Nguyễn Văn A", mutualFriends: 4, avatar: "https://i.pravatar.cc/150?img=1", status: "suggested" },
  { id: 2, name: "Trần Thị B", mutualFriends: 2, avatar: "https://i.pravatar.cc/150?img=2", status: "suggested" },
  { id: 3, name: "Lê Văn C", mutualFriends: 5, avatar: "https://i.pravatar.cc/150?img=3", status: "suggested" },
];

export default function FriendSuggestions() {
  const [suggestions, setSuggestions] = useState(mockSuggestions);

  const handleAddFriend = (id) => {
    setSuggestions(suggestions.map(friend => 
      friend.id === id ? { ...friend, status: "pending" } : friend
    ));
    message.success("Đã gửi lời mời kết bạn");
  };

  const handleRemove = (id) => {
    setSuggestions(suggestions.filter(friend => friend.id !== id));
    message.success("Đã gỡ gợi ý");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Gợi ý kết bạn</h2>
              <p className="text-gray-600">Những người bạn có thể biết</p>
            </div>
            <button className="text-blue-500 hover:underline">Xem tất cả</button>
          </div>

          {suggestions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Không có gợi ý nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map(friend => (
                <div key={friend.id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <div className="flex flex-col items-center">
                    <img 
                      src={friend.avatar} 
                      alt={friend.name}
                      className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-blue-500"
                    />
                    <h3 className="font-medium">{friend.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">
                      {friend.mutualFriends} bạn chung
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {friend.status === "pending" ? (
                      <button
                        className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 rounded"
                        disabled
                      >
                        <FaUserCheck /> Đã gửi lời mời
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddFriend(friend.id)}
                        className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                      >
                        <FaUserPlus /> Thêm bạn bè
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(friend.id)}
                      className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
                    >
                      <FaTimes /> Gỡ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}