import { useState } from "react";
import { 
  FaCheck, 
  FaCog, 
  FaComment, 
  FaUserPlus, 
  FaBirthdayCake,
  FaBell
} from "react-icons/fa";

export default function NotificationPopup({
  showNotifications,
  setShowNotifications,
  unreadCount,
  markAllAsRead
}) {
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock data thông báo
  const notifications = {
    all: [
      {
        id: 1,
        type: "mention",
        title: "Saigon Uni - SGU đã nhắc đến",
        content: "bạn và những người khác ở một bình luận trong Cộng đồng Sinh...",
        time: "6 giờ",
        unread: true
      },
      {
        id: 2,
        type: "friend-request",
        title: "Ngọc Trinh đã gửi cho bạn lời mời kết bạn.",
        content: "26 bạn chung",
        time: "3 ngày",
        unread: true
      },
      {
        id: 3,
        type: "mention",
        title: "Minh Minh đã nhắc đến bạn",
        content: "và những người khác ở một bình luận trong Vựa Điện thoại cũ-m...",
        time: "1 ngày",
        unread: false
      },
      {
        id: 4,
        type: "birthday",
        title: "Hôm qua là sinh nhật",
        content: "Hàng'ss' Minh Tứ và Trần Minh Tứ",
        time: "1 ngày",
        unread: false
      }
    ],
    unread: [
      {
        id: 1,
        type: "mention",
        title: "Saigon Uni - SGU đã nhắc đến",
        content: "bạn và những người khác ở một bình luận trong Cộng đồng Sinh...",
        time: "6 giờ",
        unread: true
      },
      {
        id: 2,
        type: "friend-request",
        title: "Ngọc Trinh đã gửi cho bạn lời mời kết bạn.",
        content: "26 bạn chung",
        time: "3 ngày",
        unread: true
      }
    ]
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case "mention": return <FaComment className="text-blue-500 mr-2" />;
      case "friend-request": return <FaUserPlus className="text-blue-500 mr-2" />;
      case "birthday": return <FaBirthdayCake className="text-blue-500 mr-2" />;
      default: return <FaComment className="text-blue-500 mr-2" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 rounded-full hover:bg-gray-100 relative"
      >
        <FaBell className="text-xl text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-12 w-96 bg-white shadow-xl rounded-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="font-bold text-lg">Thông báo</h3>
            <div className="flex space-x-2">
              <button 
                onClick={markAllAsRead}
                className="flex items-center text-sm text-gray-600 hover:text-blue-500"
              >
                <FaCheck className="mr-1" /> Đánh dấu tất cả là đã đọc
              </button>
              <button className="text-sm text-gray-600 hover:text-blue-500">
                <FaCog />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "all" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "unread" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"
              }`}
            >
              Chưa đọc
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {activeTab === "all" ? (
              <>
                <div className="p-3 bg-gray-50 text-sm font-medium">Mới</div>
                {notifications.all.slice(0, 2).map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    getIcon={getNotificationIcon}
                  />
                ))}

                <div className="p-3 bg-gray-50 text-sm font-medium">Trước đó</div>
                {notifications.all.slice(2).map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    getIcon={getNotificationIcon}
                  />
                ))}

                <div className="p-3 text-center text-blue-500 text-sm hover:bg-gray-50 cursor-pointer">
                  Xem thông báo trước đó
                </div>
              </>
            ) : (
              notifications.unread.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  getIcon={getNotificationIcon}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Component con để hiển thị từng thông báo
function NotificationItem({ notification, getIcon }) {
  return (
    <div className={`flex items-start p-3 hover:bg-gray-50 cursor-pointer ${
      notification.unread ? "bg-blue-50" : ""
    }`}>
      <div className="flex-shrink-0 mt-1">
        {getIcon(notification.type)}
      </div>
      <div className="ml-2 flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium">{notification.title}</h4>
          <span className="text-xs text-gray-500">{notification.time}</span>
        </div>
        <p className="text-sm text-gray-600">{notification.content}</p>
        {notification.type === "friend-request" && (
          <div className="flex mt-2 space-x-2">
            <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
              Xác nhận
            </button>
            <button className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300">
              Xóa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}