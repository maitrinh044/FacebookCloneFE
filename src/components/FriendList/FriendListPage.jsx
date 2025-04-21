import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegCommentDots, FaUserTimes, FaUserLock, FaUserSlash, FaSearch } from "react-icons/fa";
import { message } from "antd";
import Sidebar from "./Sidebar";

import FriendlistService from "../services/FriendlistService";

export default function FriendListPage() {
  const [friends, setFriends] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);

  // Fetch danh sách bạn bè khi component mount
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const data = await FriendlistService.getFriends();
        setFriends(data);
      } catch (error) {
        message.error("Không thể tải danh sách bạn bè");
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  // Xử lý các hành động như nhắn tin, bỏ theo dõi, chặn, hủy kết bạn
  const handleAction = async (id, action) => {
    try {
      if (action === "unfriend") {
        await FriendlistService.unfriend(id);
        setFriends(friends.filter((f) => f.id !== id));
        message.success("Đã hủy kết bạn thành công");
      } else {
        message.success(`Đã thực hiện: ${action}`);
      }
      setMenuOpenId(null);
    } catch (error) {
      message.error(`Lỗi khi thực hiện ${action}`);
    }
  };

  // Lọc danh sách bạn bè theo tên

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // Đóng menu khi click bên ngoài
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

    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
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


          {loading ? (
            <p className="text-gray-500 text-center py-4">Đang tải...</p>
          ) : filteredFriends.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Không có bạn bè nào</p>
          ) : (
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
          )}

        </div>
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

