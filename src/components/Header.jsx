import {
  FaFacebook,
  FaUserFriends,
  FaBell,
  FaSearch,
  FaFacebookMessenger,
  FaUserCircle, 
  FaSignOutAlt, 
  FaCog 
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import MessagePopup from "./Message/MessagePopup";

export default function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const notificationRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  const iconRef = useRef(null);

  // Giả lập danh sách thông báo
  const notifications = [
    { message: "Bình luận mới từ An Nguyễn", time: "2 phút trước" },
    { message: "Dũng đã thích bài viết của bạn", time: "10 phút trước" },
    { message: "Chi đã gửi lời mời kết bạn", time: "1 giờ trước" },
  ];

  const friendList = [
    { id: 1, name: "Nguyễn An" },
    { id: 2, name: "Trần Dũng" },
    { id: 3, name: "Lê Chi" },
  ];

  
  const unreadCount = notifications.length;

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setIsRead(true); // Đánh dấu đã đọc
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Mở FriendListPopup khi click vào icon tin nhắn
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  const handleMessageIconClick = () => {
    setShowMessagePopup(!showMessagePopup);
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

      <div className="flex gap-4 items-center relative">
        <button
          onClick={() => navigate("/friends")}
          className="p-2 rounded-full hover:bg-gray-100 flex items-center justify-center"
        >
          <FaUserFriends className="text-xl text-gray-700" />
        </button>

        {/* Message Icon */}
        <div className="relative">
            <button
              onClick={handleMessageIconClick}
              className="p-2 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <FaFacebookMessenger className="text-xl text-gray-700" />
            </button>

            {/* Hiển thị MessagePopup nếu trạng thái showMessagePopup là true */}
            {showMessagePopup && (
              <MessagePopup
                onClose={() => setShowMessagePopup(false)}  // Đóng popup khi nhấn X
                friendList={friendList}  // Truyền danh sách bạn bè vào MessagePopup
              />
            )}
          </div>

        {/* Notification Icon */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleNotificationClick}
            className="p-2 rounded-full hover:bg-gray-100 flex items-center justify-center relative"
          >
            <FaBell className="text-xl text-gray-700" />
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
                    <div>{noti.message}</div>
                    <div className="text-xs text-gray-400">{noti.time}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Avatar Dropdown Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="p-2 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <FaUserCircle className="text-2xl text-gray-700" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
              <ul className="text-sm text-gray-700">
                <li
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/profile/1")}
                >
                  <FaUserCircle />
                  Hồ sơ cá nhân
                </li>
                <li
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/settings")}
                >
                  <FaCog />
                  Cài đặt
                </li>
                <li
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer text-red-500"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  Đăng xuất
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
