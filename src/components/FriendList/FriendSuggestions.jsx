import { useState, useEffect } from "react";
import { FaUserPlus, FaTimes, FaUserCheck } from "react-icons/fa";
import { message } from "antd";
import Sidebar from "./Sidebar";
import * as FriendlistService from "../../services/FriendlistService";
import { getUser, getUserById } from "../../services/userService";

export default function FriendSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!currentUserId) {
        console.error("fetchSuggestions: No currentUserId found");
        message.error("Vui lòng đăng nhập để xem gợi ý kết bạn");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const allUsers = await getUser();
        const friendships = await FriendlistService.getAllFriendships();
        const pendingRequests = await FriendlistService.getAllFriendshipRequests();

        const friendIds = friendships
          .filter(
            (f) =>
              f.type === "ACCEPTED" &&
              (f.user1.id === parseInt(currentUserId) || f.user2.id === parseInt(currentUserId))
          )
          .map((f) => (f.user1.id === parseInt(currentUserId) ? f.user2.id : f.user1.id));

        const sentPendingRequestsToIds = pendingRequests
          .filter((req) => req.type === "PENDING" && req.user1.id === parseInt(currentUserId))
          .map((req) => req.user2.id);

        const receivedPendingRequestsFromIds = pendingRequests
          .filter((req) => req.type === "PENDING" && req.user2.id === parseInt(currentUserId))
          .map((req) => req.user1.id);

        const suggestionsFiltered = allUsers
          .filter((user) => user.id !== parseInt(currentUserId))
          .filter((user) => !friendIds.includes(user.id))
          .filter((user) => !sentPendingRequestsToIds.includes(user.id))
          .filter((user) => !receivedPendingRequestsFromIds.includes(user.id));

        const suggestionsWithDetails = await Promise.all(
          suggestionsFiltered.map(async (user) => {
            const userDetails = await getUserById(user.id);
            const mutualFriends = friendships.filter(
              (f) =>
                f.type === "ACCEPTED" &&
                ((f.user1.id === user.id && friendIds.includes(f.user2.id)) ||
                 (f.user2.id === user.id && friendIds.includes(f.user1.id)))
            ).length;
            return {
              id: user.id,
              name: `${userDetails.firstName} ${userDetails.lastName}`,
              avatar: userDetails.avatar || "/default-avatar.png",
              mutuals: mutualFriends,
              status: null,
            };
          })
        );

        setSuggestions(suggestionsWithDetails);
      } catch (error) {
        console.error("Không thể tải gợi ý kết bạn:", error.response || error);
        message.error(`Không thể tải gợi ý kết bạn: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [currentUserId]);

  const handleAddFriend = async (id) => {
    try {
      const suggestion = suggestions.find((s) => s.id === id);
      if (!suggestion) {
        throw new Error("Không tìm thấy gợi ý kết bạn");
      }

      const userId = parseInt(currentUserId);
      const friendId = parseInt(id);
      if (isNaN(userId) || isNaN(friendId)) {
        throw new Error("ID người dùng không hợp lệ");
      }
      if (userId === friendId) {
        throw new Error("Không thể gửi lời mời kết bạn cho chính mình");
      }

      const currentUser = await getUserById(userId);
      const friendUser = await getUserById(friendId);
      if (!currentUser || !friendUser) {
        throw new Error("Không thể lấy thông tin người dùng");
      }

      const friendshipData = {
        user1: { id: currentUser.id },
        user2: { id: friendUser.id },
        type: "PENDING",
        activeStatus: "ACTIVE",
      };

      const response = await FriendlistService.addFriendship(friendshipData);

      setSuggestions(
        suggestions.map((s) => (s.id === id ? { ...s, status: "pending" } : s))
      );
      message.success("Đã gửi lời mời kết bạn thành công");
    } catch (error) {
      console.error("Lỗi khi gửi lời mời kết bạn:", error.response || error);
      const errorMessage = error.response?.data?.message || error.message || "Không thể gửi lời mời kết bạn";
      message.error(errorMessage);
    }
  };

  const handleRemove = (id) => {
    setSuggestions(suggestions.filter((s) => s.id !== id));
    message.success("Đã gỡ gợi ý");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Gợi ý kết bạn</h2>
              <p className="text-gray-600">Những người bạn có thể biết</p>
            </div>
          </div>
          {loading ? (
            <p className="text-gray-500 text-center py-4">Đang tải...</p>
          ) : suggestions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Không có gợi ý nào</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <img
                    src={suggestion.avatar}
                    alt={suggestion.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-blue-500"
                  />
                  <h3 className="text-center font-medium">{suggestion.name}</h3>
                  <p className="text-center text-sm text-gray-500 mb-3">
                    {suggestion.mutuals} bạn chung
                  </p>
                  <div className="flex flex-col gap-2">
                    {suggestion.status === "pending" ? (
                      <button
                        className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 rounded"
                        disabled
                      >
                        <FaUserCheck /> Đã gửi lời mời
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddFriend(suggestion.id)}
                        className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                      >
                        <FaUserPlus /> Thêm bạn bè
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(suggestion.id)}
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