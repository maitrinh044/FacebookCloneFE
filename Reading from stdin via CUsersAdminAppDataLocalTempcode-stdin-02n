import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegCommentDots, FaUserTimes, FaUserLock, FaUserSlash, FaSearch } from "react-icons/fa";
import { message } from "antd";

const mockFriends = [
  { id: 1, name: "Mai Thị Thương", mutuals: 8, avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Trương Trí Tuệ", mutuals: 1, avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Có Hoàng", mutuals: 3, avatar: "https://i.pravatar.cc/150?img=3" },
];

export default function FriendListPage() {
  const [friends, setFriends] = useState(mockFriends);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const menuRef = useRef(null);

  const handleAction = (id, action) => {
    if (action === "unfriend") {
      setFriends(friends.filter((f) => f.id !== id));
      message.success("Đã hủy kết bạn thành công");
    } else {
      message.success(`Đã thực hiện: ${action}`);
    }
    setMenuOpenId(null);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Bạn bè ({filteredFriends.length})</h2>
        
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè..."
            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
        </div>

        <ul className="space-y-4">
          {filteredFriends.map((friend) => (
            <FriendItem 
              key={friend.id} 
              friend={friend}
              menuOpenId={menuOpenId}
              setMenuOpenId={setMenuOpenId}
              handleAction={handleAction}
              menuRef={menuRef}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function FriendItem({ friend, menuOpenId, setMenuOpenId, handleAction, menuRef }) {
  return (
    <li className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow relative">
      <div className="flex items-center gap-4">
        <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <span className="font-medium">{friend.name}</span>
          <p className="text-gray-500 text-sm">{friend.mutuals} bạn chung</p>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <button 
          onClick={() => setMenuOpenId(prev => prev === friend.id ? null : friend.id)} 
          className="p-2 hover:bg-gray-200 rounded-full"
        >
          <BsThreeDotsVertical className="text-xl text-gray-700" />
        </button>

        {menuOpenId === friend.id && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-2">
            <button onClick={() => handleAction(friend.id, "message")} className="flex items-center w-full px-4 py-2 hover:bg-gray-200 rounded">
              <FaRegCommentDots className="mr-3" /> Nhắn tin
            </button>
            <button onClick={() => handleAction(friend.id, "unfollow")} className="flex items-center w-full px-4 py-2 hover:bg-gray-200 rounded">
              <FaUserTimes className="mr-3" /> Bỏ theo dõi
            </button>
            <button onClick={() => handleAction(friend.id, "block")} className="flex items-center w-full px-4 py-2 hover:bg-gray-200 rounded">
              <FaUserLock className="mr-3" /> Chặn trang cá nhân
            </button>
            <button onClick={() => handleAction(friend.id, "unfriend")} className="flex items-center w-full px-4 py-2 hover:bg-red-100 rounded text-red-500">
              <FaUserSlash className="mr-3" /> Hủy kết bạn
            </button>
          </div>
        )}
      </div>
    </li>
  );
}