import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegCommentDots, FaUserLock, FaUserSlash, FaSearch } from "react-icons/fa";
import { message } from "antd";
import Sidebar from "./Sidebar";
import * as FriendlistService from "../../services/FriendlistService";
import { getUserById } from "../../services/userService";
import { getMessageList } from "../../services/MessageService";
import MessagePanel from "../Message/MessagePanel";

export default function FriendListPage() {
  const [friends, setFriends] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatPanels, setChatPanels] = useState([]);
  const menuRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  // Tải danh sách bạn bè
  useEffect(() => {
    const fetchFriends = async () => {
      if (!currentUserId || !accessToken) {
        message.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      try {
        setLoading(true);
        const friendships = await FriendlistService.getAllFriendships();
        console.log("Friendships:", friendships);

        const friendsWithDetails = await Promise.all(
          friendships
            .filter((f) => f.type === "ACCEPTED")
            .map(async (friendship) => {
              const friendId =
                friendship.user1.id === currentUserId
                  ? friendship.user2.id
                  : friendship.user1.id;
              const user = await getUserById(friendId);
              
              return {
                id: friendship.id,
                friendId,
                name: `${user.firstName} ${user.lastName}`,
                avatar: user.avatar || "/default-avatar.png",
                mutuals: user.mutualFriends || 0,
                online: user.online || false,
                firstName: user.firstName,
                lastName: user.lastName,
                friendshipData: {
                  id: friendship.id,
                  user1: friendship.user1,
                  user2: friendship.user2,
                  createdAt: friendship.createdAt,
                  activeStatus: friendship.activeStatus || "ACTIVE"
                }
              };
            })
        );
        setFriends(friendsWithDetails);
      } catch (error) {
        console.error("Không thể tải danh sách bạn bè:", error);
        if (error.response?.status === 401) {
          message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          localStorage.clear();
          window.location.href = "/login";
        } else {
          message.error("Không thể tải danh sách bạn bè. Vui lòng thử lại.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [currentUserId, accessToken]);

  // Xử lý các hành động
  const handleAction = async (id, action, friendData) => {
    if (!accessToken) {
      message.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    try {
      if (action === "unfriend") {
        const friendshipData = {
          ...friendData.friendshipData,
          type: "REJECTED"
        };
        console.log("Unfriending:", friendshipData);
        await FriendlistService.updateFriendship(friendshipData);
        setFriends(friends.filter((f) => f.id !== id));
        message.success("Đã hủy kết bạn thành công");
      } else if (action === "block") {
        const currentFriendship = await FriendlistService.getFriendshipById(id);
        console.log("Blocking Friendship:", currentFriendship);
        if (!currentFriendship) {
          message.error("Không tìm thấy mối quan hệ bạn bè!");
          return;
        }

        const blockData = {
          id: currentFriendship.id,
          type: "BLOCKED",
          user1: currentFriendship.user1,
          user2: currentFriendship.user2,
          createdAt: currentFriendship.createdAt,
          activeStatus: currentFriendship.activeStatus || "ACTIVE"
        };
        console.log("Sending Block Request:", blockData);
        await FriendlistService.updateFriendship(blockData);
        setFriends(friends.filter((f) => f.id !== id));
        message.success("Đã chặn trang cá nhân");
      } else if (action === "message") {
        // Đảm bảo friendData có cấu trúc giống với MessagePopup
        const friendForChat = {
          id: friendData.friendId,
          firstName: friendData.firstName,
          lastName: friendData.lastName,
          profilePicture: friendData.avatar,
          online: friendData.online,
          name: friendData.name
        };

        // Kiểm tra xem khung chat đã mở chưa
        if (!chatPanels.some((panel) => panel.id === friendData.friendId)) {
          // Fetch messages for the friend
          const messages = await getMessageList(currentUserId, friendData.friendId);
          setChatPanels([...chatPanels, { id: friendData.friendId, friend: friendForChat, messages }]);
        }
      }
      setMenuOpenId(null);
    } catch (error) {
      console.error(`Lỗi khi thực hiện ${action}:`, error);
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.clear();
        window.location.href = "/login";
      } else {
        message.error(`Không thể thực hiện ${action}. Vui lòng thử lại sau.`);
      }
    }
  };

  // Callback để refetch messages khi có tin nhắn mới
  const handleMessageSent = async (friendId) => {
    try {
      const messages = await getMessageList(currentUserId, friendId);
      setChatPanels((prev) =>
        prev.map((panel) =>
          panel.id === friendId ? { ...panel, messages } : panel
        )
      );
    } catch (error) {
      console.error("Lỗi khi làm mới tin nhắn:", error);
      message.error("Không thể làm mới tin nhắn. Vui lòng thử lại.");
    }
  };

  // Đóng cửa sổ chat
  const handleCloseChat = (friendId) => {
    setChatPanels((prev) => prev.filter((panel) => panel.id !== friendId));
  };

  // Lọc danh sách bạn bè
  const filteredFriends = friends.filter((friend) =>
    friend.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý đóng menu khi click bên ngoài
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
      <Sidebar />
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

      {chatPanels.map((panel, index) => (
        <MessagePanel
          key={panel.id}
          friend={panel.friend}
          initialMessages={panel.messages} // Pass the fetched messages
          onMessageSent={() => handleMessageSent(panel.id)} // Callback for new messages
          onClose={() => handleCloseChat(panel.id)}
          positionOffset={index}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

function FriendItem({ friend, menuOpenId, setMenuOpenId, handleAction, menuRef }) {
  return (
    <li className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow relative">
      <div className="flex items-center gap-4">
        <img
          src={friend.avatar}
          alt={friend.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <span className="font-medium">{friend.name}</span>
          <p className="text-gray-500 text-sm">{friend.mutuals} bạn chung</p>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpenId((prev) => (prev === friend.id ? null : friend.id))}
          className="p-2 hover:bg-gray-200 rounded-full"
        >
          <BsThreeDotsVertical className="text-xl text-gray-700" />
        </button>

        {menuOpenId === friend.id && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-2">
            <button
              onClick={() => handleAction(friend.id, "message", friend)}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-200 rounded"
            >
              <FaRegCommentDots className="mr-3" /> Nhắn tin
            </button>
            <button
              onClick={() => handleAction(friend.id, "block", friend)}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-200 rounded"
            >
              <FaUserLock className="mr-3" /> Chặn trang cá nhân
            </button>
            <button
              onClick={() => handleAction(friend.id, "unfriend", friend)}
              className="flex items-center w-full px-4 py-2 hover:bg-red-100 rounded text-red-500"
            >
              <FaUserSlash className="mr-3" /> Hủy kết bạn
            </button>
          </div>
        )}
      </div>
    </li>
  );
}