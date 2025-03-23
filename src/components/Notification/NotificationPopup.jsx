import {
    FaFacebook,
    FaUserFriends,
    FaSearch,
    FaFacebookMessenger,
    FaUserCircle,
    FaSignOutAlt,
    FaCog
  } from "react-icons/fa";
  import { Link, useNavigate } from "react-router-dom";
  import { useState, useRef, useEffect } from "react";
  import MessagePopup from "./Message/MessagePopup";
  import NotificationPopup from "./Notification/NotificationPopup";  // Import component NotificationPopup
  
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
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/login");
    };
  
    // Mở FriendListPopup khi click vào icon tin nhắn
    const [showFriendListPopup, setShowFriendListPopup] = useState(false);
    const handleMessageIconClick = () => {
      setShowFriendListPopup(true);
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
  
          <button
            ref={iconRef}
            onClick={handleMessageIconClick}  // Mở FriendListPopup khi click vào icon tin nhắn
            className="p-2 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <FaFacebookMessenger className="text-xl text-gray-700" />
          </button>
  
          {/* Notification Icon */}
          <div className="relative" ref={notificationRef}>
            {/* Sử dụng component NotificationPopup */}
            <NotificationPopup
              notifications={notifications}
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
              isRead={isRead}
              setIsRead={setIsRead}
            />
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
  
        {/* Friend List Popup */}
        {showFriendListPopup && (
          <MessagePopup onClose={() => setShowFriendListPopup(false)} iconRef={iconRef} />
        )}
      </div>
    );
  }
  