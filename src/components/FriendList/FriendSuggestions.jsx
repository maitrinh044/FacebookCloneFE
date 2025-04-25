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
        message.error("Vui lòng đăng nhập để xem gợi ý kết bạn");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Lấy danh sách tất cả người dùng
        const allUsers = await getUser();
        // Lấy danh sách mối quan hệ bạn bè
        const friendships = await FriendlistService.getAllFriendships();
        // Lấy danh sách yêu cầu kết bạn
        const pendingRequests = await FriendlistService.getAllFriendshipRequests();

        // Lấy danh sách ID bạn bè hiện tại
        const friendIds = friendships
          .filter((f) => f.type === "ACCEPTED")
          .filter((f) => f.user1.id === currentUserId || f.user2.id === currentUserId)
          .map((f) => (f.user1.id === currentUserId ? f.user2.id : f.user1.id));

        // Lấy danh sách ID của các yêu cầu đã gửi
        const sentPendingRequestsToIds = pendingRequests
          .filter((req) => req.type === "PENDING" && req.user1.id === currentUserId)
          .map((req) => req.user2.id);

        // Lấy danh sách ID của các yêu cầu đã nhận
        const receivedPendingRequestsFromIds = pendingRequests
          .filter((req) => req.type === "PENDING" && req.user2.id === currentUserId)
          .map((req) => req.user1.id);

        // Lọc danh sách gợi ý
        const suggestionsFiltered = allUsers
          .filter((user) => user.id !== currentUserId)
          .filter((user) => !friendIds.includes(user.id))
          .filter((user) => !sentPendingRequestsToIds.includes(user.id))
          .filter((user) => !receivedPendingRequestsFromIds.includes(user.id));

        // Lấy chi tiết gợi ý và bạn chung
        const suggestionsWithDetails = await Promise.all(
          suggestionsFiltered.map(async (user) => {
            const userDetails = await getUserById(user.id);
            return {
              id: user.id,
              name: `${userDetails.firstName} ${userDetails.lastName}`,
              avatar: userDetails.avatar || "/default-avatar.png",
              mutuals: userDetails.mutualFriends || 0,
              status: sentPendingRequestsToIds.includes(user.id) ? "pending" : null,
            };
          })
        );

        setSuggestions(suggestionsWithDetails);
      } catch (error) {
        console.error("Không thể tải gợi ý kết bạn:", error);
        message.error("Không thể tải gợi ý kết bạn. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [currentUserId]);

  const handleAddFriend = async (id) => {
    try {
      // Tìm suggestion tương ứng để lấy thông tin
      const suggestion = suggestions.find((s) => s.id === id);
      if (!suggestion) {
        throw new Error("Không tìm thấy gợi ý kết bạn");
      }

      // Chuẩn bị dữ liệu gửi đi, đảm bảo ID là số
      const friendshipData = {
        user1: { id: parseInt(currentUserId) }, // Chuyển đổi thành số nguyên
        user2: { id: parseInt(id) }, // Chuyển đổi thành số nguyên
        type: "PENDING",
        activeStatus: "ACTIVE",
      };

      console.log("Gửi friendshipData:", friendshipData);
      await FriendlistService.addFriendship(friendshipData);

      // Cập nhật trạng thái của suggestion
      setSuggestions(
        suggestions.map((s) =>
          s.id === id
            ? {
                ...s,
                status: "pending",
              }
            : s
        )
      );

      message.success("Đã gửi lời mời kết bạn thành công");
    } catch (error) {
      console.error("Lỗi khi gửi lời mời kết bạn:", error);
      message.error(
        error.response?.data?.message ||
          "Không thể gửi lời mời kết bạn. Vui lòng thử lại."
      );
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
                <div
                  key={suggestion.id}
                  className="bg-gray-50 p-4 rounded-lg shadow"
                >
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