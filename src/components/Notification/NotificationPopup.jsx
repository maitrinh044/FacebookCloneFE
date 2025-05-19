import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { message } from "antd";
import * as NotificationService from "../../services/NotificationService";
import * as FriendlistService from "../../services/FriendlistService";
import { getUserById } from "../../services/userService";

// Hàm tính khoảng cách thời gian
const getTimeDifference = (createdAt) => {
  const now = new Date(); // Thời điểm hiện tại: 19/05/2025, 21:14
  const createdDate = new Date(createdAt);
  const diffInMs = now - createdDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) return `${diffInMinutes} phút`;
  if (diffInHours < 24) return `${diffInHours} giờ`;
  return `${diffInDays} ngày`;
};

export default function NotificationPopup({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // "all" hoặc "unread"
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUserId) {
        message.error("Vui lòng đăng nhập để xem thông báo");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const notificationsData = await NotificationService.getAllNotifications();

        // Lọc thông báo của người dùng hiện tại
        const userNotifications = notificationsData.filter(
          (noti) => noti.userId.id === parseInt(currentUserId)
        );

        // Lấy thông tin người gửi và định dạng thông báo
        const formattedNotifications = await Promise.all(
          userNotifications.map(async (noti) => {
            let senderName = "";
            let avatar = "/default-avatar.png";
            let messageContent = noti.content;
            let action = null;
            let mutualFriends = 0;

            if (noti.type === "FRIEND_REQUEST") {
              const friendshipId = parseInt(noti.content.split("friendshipId:")[1]) || null;
              if (friendshipId) {
                const friendship = await FriendlistService.getFriendshipById(friendshipId);
                if (friendship && friendship.user1.id !== parseInt(currentUserId)) {
                  const sender = await getUserById(friendship.user1.id);
                  senderName = `${sender.firstName} ${sender.lastName}`;
                  avatar = sender.avatar || "/default-avatar.png";
                  mutualFriends = sender.mutualFriends || 0; // Lấy số bạn chung
                  messageContent = "đã gửi bạn một lời mời kết bạn";
                  action = {
                    accept: "Xác nhận",
                    reject: "Xóa",
                    friendshipId,
                  };
                }
              }
            } else if (noti.type === "POST") {
              // Giả sử content chứa userId của người đăng bài
              const senderId = parseInt(noti.content.split("userId:")[1]) || null;
              if (senderId) {
                const sender = await getUserById(senderId);
                senderName = `${sender.firstName} ${sender.lastName}`;
                avatar = sender.avatar || "/default-avatar.png";
                messageContent = "đã đăng một bài viết mới";
              }
            } else if (noti.type === "COMMENT") {
              const senderId = parseInt(noti.content.split("userId:")[1]) || null;
              if (senderId) {
                const sender = await getUserById(senderId);
                senderName = `${sender.firstName} ${sender.lastName}`;
                avatar = sender.avatar || "/default-avatar.png";
                messageContent = "đã bình luận về bài viết của bạn";
              }
            }

            return {
              id: noti.id,
              name: senderName,
              avatar,
              message: messageContent,
              time: getTimeDifference(noti.createdAt), // Tính khoảng thời gian
              isRead: noti.isRead,
              action,
              mutualFriends, // Thêm thông tin bạn chung
            };
          })
        );

        setNotifications(formattedNotifications);
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
        message.error("Không thể tải thông báo. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUserId]);

  const handleAction = async (notificationId, actionType, friendshipId) => {
    try {
      if (actionType === "accept") {
        const friendship = await FriendlistService.getFriendshipById(friendshipId);
        if (!friendship) {
          throw new Error("Không tìm thấy lời mời kết bạn");
        }
        const updatedFriendship = {
          ...friendship,
          type: "ACCEPTED",
        };
        await FriendlistService.updateFriendship(updatedFriendship);
        message.success("Đã chấp nhận lời mời kết bạn");
      } else if (actionType === "reject") {
        const friendship = await FriendlistService.getFriendshipById(friendshipId);
        if (!friendship) {
          throw new Error("Không tìm thấy lời mời kết bạn");
        }
        const updatedFriendship = {
          ...friendship,
          type: "REJECTED",
        };
        await FriendlistService.updateFriendship(updatedFriendship);
        message.success("Đã từ chối lời mời kết bạn");
      }

      // Đánh dấu thông báo là đã đọc
      const notification = notifications.find((noti) => noti.id === notificationId);
      if (notification && !notification.isRead) {
        await NotificationService.updateNotification(notificationId, {
          ...notification,
          isRead: true,
        });
      }

      // Cập nhật danh sách thông báo
      setNotifications((prev) =>
        prev.filter((noti) => noti.id !== notificationId)
      );
    } catch (error) {
      console.error(`Lỗi khi xử lý hành động ${actionType}:`, error);
      message.error(`Không thể ${actionType === "accept" ? "chấp nhận" : "từ chối"} lời mời. Vui lòng thử lại.`);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      message.success("Đã xóa thông báo");
      setNotifications((prev) => prev.filter((noti) => noti.id !== notificationId));
    } catch (error) {
      console.error("Lỗi khi xóa thông báo:", error);
      message.error("Không thể xóa thông báo. Vui lòng thử lại.");
    }
  };

  const filteredNotifications = filter === "unread"
    ? notifications.filter((noti) => !noti.isRead)
    : notifications;

  return (
    <div className="absolute right-0 top-12 w-96 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h4 className="text-lg font-bold">Thông báo</h4>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 text-center py-2 font-medium ${filter === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-black"}`}
          onClick={() => setFilter("all")}
        >
          Tất cả
        </button>
        <button
          className={`flex-1 text-center py-2 font-medium ${filter === "unread" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-black"}`}
          onClick={() => setFilter("unread")}
        >
          Chưa đọc
        </button>
      </div>

      {/* Nội dung thông báo */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500 text-center py-4">Đang tải...</p>
        ) : filteredNotifications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Không có thông báo mới</p>
        ) : (
          filteredNotifications.map((noti) => (
            <div key={noti.id} className="p-4 flex items-start hover:bg-gray-100 cursor-pointer relative">
              <img
                src={noti.avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full mr-3"
              />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{noti.name}</span> {noti.message}
                </p>
                <p className="text-xs text-gray-400">{noti.time}</p>
                {noti.mutualFriends > 0 && (
                  <p className="text-xs text-gray-400">{noti.mutualFriends} bạn chung</p>
                )}
                {noti.action && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleAction(noti.id, "accept", noti.action.friendshipId)}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md"
                    >
                      {noti.action.accept}
                    </button>
                    <button
                      onClick={() => handleAction(noti.id, "reject", noti.action.friendshipId)}
                      className="px-3 py-1 bg-gray-300 text-xs rounded-md"
                    >
                      {noti.action.reject}
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDeleteNotification(noti.id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}