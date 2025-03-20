import {
  FaFacebook,
  FaUserFriends,
  FaBell,
  FaSearch,
  FaFacebookMessenger,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRead, setIsRead] = useState(false); // ✅ Thêm state này
  const notificationRef = useRef(null);

  // Giả lập danh sách thông báo
  const notifications = [
    "Bình luận mới từ An Nguyễn",
    "Dũng đã thích bài viết của bạn",
    "Chi đã gửi lời mời kết bạn",
  ];
  const unreadCount = notifications.length;

  // ✅ Tự đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Đánh dấu đã đọc khi mở dropdown
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setIsRead(true); // Đánh dấu đã đọc
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white shadow fixed top-0 left-0 right-0 z-50 border-b border-gray-300">
      {/* Logo + Search */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-blue-600 text-3xl">
          <FaFacebook />
        </Link>
        <div className="relative">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm trên Facebook"
            className="pl-10 pr-4 py-2 rounded-full bg-gray-100 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="flex gap-4 items-center relative">
        <button
          onClick={() => navigate("/friends")}
          className="p-2 rounded-full hover:bg-gray-100 flex items-center justify-center"
        >
          <FaUserFriends className="text-xl text-gray-700" />
        </button>

        <Link
          to="/messages"
          className="p-2 rounded-full hover:bg-gray-100 flex items-center justify-center"
        >
          <FaFacebookMessenger className="text-xl text-gray-700" />
        </Link>

        {/* 🔔 Notification Icon */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleNotificationClick}
            className="p-2 rounded-full hover:bg-gray-100 flex items-center justify-center relative"
          >
            <FaBell className="text-xl text-gray-700" />
            {/* ✅ Hiển thị badge chỉ khi chưa đọc */}
            {!isRead && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-shake">
                {unreadCount}
              </span>
            )}

          </button>

          {/* Dropdown notifications */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
              <h4 className="p-3 font-semibold text-gray-700 border-b">
                Thông báo
              </h4>
              <ul className="max-h-64 overflow-y-auto">
                {notifications.map((noti, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {noti}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
