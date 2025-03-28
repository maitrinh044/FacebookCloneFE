import {
  FaFacebook,
  FaUserFriends,
  FaBell,
  FaSearch,
  FaFacebookMessenger,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import MessagePopup from "./Message/MessagePopup";
import NotificationPopup from "./Notification/NotificationPopup";

export default function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Danh sách thông báo giả lập
  const notifications = [
    {
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "An Nguyễn",
      message: "đã bình luận về bài viết của bạn.",
      time: "2 phút trước",
    },
    {
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Dũng Trần",
      message: "đã thích bài viết của bạn.",
      time: "10 phút trước",
    },
    {
      avatar: "https://randomuser.me/api/portraits/women/30.jpg",
      name: "Chi Nguyễn",
      message: "đã gửi cho bạn lời mời kết bạn.",
      time: "1 giờ trước",
      action: { accept: "Xác nhận", reject: "Xóa" },
    },
  ];
  const unreadCount = notifications.length;

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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

      {/* Icons Section */}
      <div className="flex gap-4 items-center relative">
        <button onClick={() => navigate("/friends")} className="p-2 rounded-full hover:bg-gray-100">
          <FaUserFriends className="text-xl text-gray-700" />
        </button>

        {/* Messenger Icon */}
        <div className="relative">
          <button onClick={() => setShowMessagePopup(!showMessagePopup)} className="p-2 rounded-full hover:bg-gray-100">
            <FaFacebookMessenger className="text-xl text-gray-700" />
          </button>
          {showMessagePopup && <MessagePopup onClose={() => setShowMessagePopup(false)} />}
        </div>

        {/* Notification Icon */}
        <div className="relative" ref={notificationRef}>
          <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-full hover:bg-gray-100 relative">
            <FaBell className="text-xl text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-shake">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && <NotificationPopup notifications={notifications} onClose={() => setShowNotifications(false)} />}
        </div>

        {/* Avatar Dropdown Menu */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="p-2 rounded-full hover:bg-gray-100">
            <FaUserCircle className="text-2xl text-gray-700" />
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
              <ul className="text-sm text-gray-700">
                <li onClick={() => navigate("/profile/1")} className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer">
                  <FaUserCircle /> Hồ sơ cá nhân
                </li>
                <li onClick={() => navigate("/settings")} className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer">
                  <FaCog /> Cài đặt
                </li>
                <li onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer text-red-500">
                  <FaSignOutAlt /> Đăng xuất
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
