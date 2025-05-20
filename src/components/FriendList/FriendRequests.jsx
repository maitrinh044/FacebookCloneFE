import { useState, useEffect } from "react";
import { FaUserCheck, FaTimes, FaUserCircle } from "react-icons/fa";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import * as FriendlistService from "../../services/FriendlistService";
import { getUserById } from "../../services/userService";

export default function FriendRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUserId) {
        message.error("Vui lòng đăng nhập để xem lời mời kết bạn");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const pendingRequests = await FriendlistService.getPendingRequests(currentUserId);

        const requestsWithDetails = await Promise.all(
          pendingRequests.map(async (request) => {
            const senderId = request.user1.id;
            const user = await getUserById(senderId);
            console.log(`Sender ID: ${senderId}, ProfilePicture: ${user.profilePicture}, ImageUrl: ${user.imageUrl}`); // Debug log
            return {
              id: request.id,
              senderId,
              name: `${user.firstName} ${user.lastName}`,
              profilePicture: user.profilePicture, // Use profilePicture
              mutuals: user.mutualFriends || 0,
              imgError: false, // Initialize imgError
              friendshipData: {
                id: request.id,
                user1: request.user1,
                user2: request.user2,
                type: request.type,
                createdAt: request.createdAt,
                activeStatus: request.activeStatus || "ACTIVE",
              },
            };
          })
        );

        setRequests(requestsWithDetails);
      } catch (error) {
        console.error("Không thể tải lời mời kết bạn:", error);
        message.error("Không thể tải lời mời kết bạn. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUserId]);

  const handleAccept = async (id) => {
    try {
      const request = requests.find((req) => req.id === id);
      if (!request) {
        throw new Error("Không tìm thấy lời mời kết bạn");
      }

      const friendshipData = {
        ...request.friendshipData,
        type: "ACCEPTED",
      };

      await FriendlistService.updateFriendship(friendshipData);

      setRequests((prev) => prev.filter((req) => req.id !== id));
      message.success("Đã chấp nhận lời mời kết bạn");
    } catch (error) {
      console.error("Lỗi khi chấp nhận lời mời:", error);
      message.error(error.message || "Không thể chấp nhận lời mời. Vui lòng thử lại.");
    }
  };

  const handleDecline = async (id) => {
    try {
      const request = requests.find((req) => req.id === id);
      if (!request) {
        throw new Error("Không tìm thấy lời mời kết bạn");
      }

      const friendshipData = {
        ...request.friendshipData,
        type: "REJECTED",
      };

      await FriendlistService.updateFriendship(friendshipData);

      setRequests((prev) => prev.filter((req) => req.id !== id));
      message.success("Đã từ chối lời mời kết bạn");
    } catch (error) {
      console.error("Lỗi khi từ chối lời mời:", error);
      message.error(error.message || "Không thể từ chối lời mời. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Lời mời kết bạn ({requests.length})</h2>
          {loading ? (
            <p className="text-gray-500 text-center py-4">Đang tải...</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Không có lời mời nào</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((request) => (
                <div key={request.id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <div
                    className="cursor-pointer flex flex-col items-center"
                    onClick={() => {
                      console.log(`Navigating to profile with ID: ${request.senderId}`);
                      navigate(`/profile/${request.senderId}`);
                    }}
                  >
                    {request.profilePicture && !request.imgError ? (
                      <img
                        src={request.profilePicture}
                        alt={request.name}
                        className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-blue-500 object-cover"
                        onError={() =>
                          setRequests((prev) =>
                            prev.map((req) =>
                              req.id === request.id ? { ...req, imgError: true } : req
                            )
                          )
                        }
                      />
                    ) : (
                      <FaUserCircle className="w-20 h-20 text-gray-400 mb-3" />
                    )}
                    <h3 className="text-center font-medium">{request.name}</h3>
                  </div>
                  <p className="text-center text-sm text-gray-500 mb-3">
                    {request.mutuals} bạn chung
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition flex items-center justify-center gap-2"
                    >
                      <FaUserCheck /> Xác nhận
                    </button>
                    <button
                      onClick={() => handleDecline(request.id)}
                      className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300 transition flex items-center justify-center gap-2"
                    >
                      <FaTimes /> Xóa
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