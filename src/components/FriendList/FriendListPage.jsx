import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegCommentDots, FaUserLock, FaUserSlash, FaSearch } from "react-icons/fa";
import { message } from "antd";
import Sidebar from "./Sidebar";
import * as FriendlistService from "../../services/FriendlistService";
import { getUserById } from "../../services/userService";
import { getMessageList, getLastMessage } from "../../services/MessageService";
import MessagePanel from "../Message/MessagePanel";

export default function FriendListPage() {
  const [friends, setFriends] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatPanels, setChatPanels] = useState([]);

  const currentUserId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

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

        const relevantFriendships = friendships.filter(
          (f) =>
            f.type === "ACCEPTED" &&
            (f.user1.id === parseInt(currentUserId) || f.user2.id === parseInt(currentUserId))
        );

        const friendsWithDetails = await Promise.all(
          relevantFriendships.map(async (friendship) => {
            const friendId =
              friendship.user1.id === parseInt(currentUserId)
                ? friendship.user2.id
                : friendship.user1.id;
            const user = await getUserById(friendId);
            const lastMessage = await getLastMessage(currentUserId, friendId);

            return {
              id: friendship.id,
              friendId,
              name: `${user.firstName} ${user.lastName}`,
              avatar: user.avatar || "/default-avatar.png",
              mutuals: user.mutualFriends || 0,
              online: user.online || false,
              firstName: user.firstName,
              lastName: user.lastName,
              lastMessage: lastMessage || null,
              friendshipData: {
                id: friendship.id,
                user1: friendship.user1,
                user2: friendship.user2,
                type: friendship.type,
                createdAt: friendship.createdAt,
                activeStatus: friendship.activeStatus || "ACTIVE",
              },
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
          type: "REJECTED",
        };
        await FriendlistService.updateFriendship(friendshipData);
        setFriends(friends.filter((f) => f.id !== id));
        message.success("Đã hủy kết bạn thành công");
      } else if (action === "block") {
        const friendshipData = {
          ...friendData.friendshipData,
          type: "BLOCKED",
        };
        await FriendlistService.updateFriendship(friendshipData);
        setFriends(friends.filter((f) => f.id !== id));
        message.success("Đã chặn trang cá nhân");
      } else if (action === "message") {
        const friendForChat = {
          id: friendData.friendId,
          firstName: friendData.firstName,
          lastName: friendData.lastName,
          name: friendData.name,
          profilePicture: friendData.avatar,
          online: friendData.online,
        };

        if (!chatPanels.some((panel) => panel.id === friendData.friendId)) {
          const messages = await getMessageList(currentUserId, friendData.friendId);
          setChatPanels([
            ...chatPanels,
            { id: friendData.friendId, friend: friendForChat, messages },
          ]);
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

  const handleCloseChat = (friendId) => {
    setChatPanels((prev) => prev.filter((panel) => panel.id !== friendId));
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
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
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {chatPanels.length > 0 && chatPanels.map((panel, index) => (
        <MessagePanel
          key={panel.id}
          friend={panel.friend}
          initialMessages={panel.messages}
          onMessageSent={() => handleMessageSent(panel.id)}
          onClose={() => handleCloseChat(panel.id)}
          positionOffset={index}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

function FriendItem({ friend, menuOpenId, setMenuOpenId, handleAction }) {
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

      <div className="menu-container relative">
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