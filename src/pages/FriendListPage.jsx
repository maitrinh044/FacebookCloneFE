import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { message } from "antd";

const mockFriends = [
  {
    id: 1,
    name: "Trần Văn A",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Nguyễn Thị B",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Lê Văn C",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

export default function FriendListPage() {
  const [friends, setFriends] = useState(mockFriends);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const handleRemove = (id) => {
    setFriends(friends.filter((f) => f.id !== id));
    message.success("Đã xóa bạn thành công");
    setMenuOpenId(null);
  };

  const handleBlock = (id) => {
    setFriends(friends.filter((f) => f.id !== id));
    message.success("Đã block người dùng");
    setMenuOpenId(null);
  };

  const toggleMenu = (id) => {
    setMenuOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Danh sách bạn bè ({friends.length})
      </h2>
      <ul className="space-y-4">
        {friends.map((friend) => (
          <li
            key={friend.id}
            className="flex justify-between items-center bg-white p-4 rounded shadow relative"
          >
            <div className="flex items-center gap-4">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-gray-800 font-medium">{friend.name}</span>
            </div>

            <div className="relative">
              <button
                onClick={() => toggleMenu(friend.id)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <BsThreeDotsVertical className="text-xl" />
              </button>

              {menuOpenId === friend.id && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow z-10">
                  <button
                    onClick={() => handleRemove(friend.id)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Xóa bạn
                  </button>
                  <button
                    onClick={() => handleBlock(friend.id)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Block
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
