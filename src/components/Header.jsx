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
import useFetchUserFriends from "../utils/useFetchUserFriends";
import MessagePanel from "./Message/MessagePanel";
import { getLastMessage } from "../services/MessageService";

export default function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const notificationRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openChats, setOpenChats] = useState([]);

  const notifications = [
    { message: "Bình luận mới từ An Nguyễn", time: "2 phút trước" },
    { message: "Dũng đã thích bài viết của bạn", time: "10 phút trước" },
    { message: "Chi đã gửi lời mời kết bạn", time: "1 giờ trước" },
  ];

  const friendList = useFetchUserFriends().friends;
  const unreadCount = notifications.length;

  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const updatedChatList = await Promise.all(
        friendList.map(async (friend) => ({
          friend,
          lastMessage: await getLastMessage(1, friend.id),
        }))
      );
      setChatList(updatedChatList);
    };

    if (friendList.length > 0) {
      fetchMessages();
    }
  }, [friendList]);

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
    setIsRead(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSelectFriend = (friend) => {
    setOpenChats((prevChats) => {
      if (!prevChats.find((chat) => chat.id === friend.id)) {
        return [...prevChats, friend];
      }
      return prevChats;
    });
  };

  const handleCloseChat = (id) => {
    setOpenChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white shadow fixed top-0 left-0 right-0 z-50 border-b border-gray-300">
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
        <button onClick={() => navigate("/friends")} className="p-2 rounded-full hover:bg-gray-100">
          <FaUserFriends className="text-xl text-gray-700" />
        </button>

        {location.pathname !== "/messages" && (
          <div className="relative">
            <button onClick={() => setIsPopupOpen(!isPopupOpen)} className="p-2 rounded-full hover:bg-gray-100">
              <FaFacebookMessenger className="text-xl text-gray-700" />
            </button>
            {isPopupOpen && (
              <MessagePopup onClose={() => setIsPopupOpen(false)} chatList={chatList} onSelectFriend={handleSelectFriend} />
            )}
          </div>
        )}

        <div className="fixed bottom-0 right-2 flex flex-row-reverse gap-2 p-2">
          {openChats.map((friend, index) => (
            <div key={friend.id} className="w-[300px] shadow-lg">
              <MessagePanel friend={friend} onClose={() => handleCloseChat(friend.id)} />
            </div>
          ))}
        </div>

        <div className="relative" ref={notificationRef}>
          <button onClick={handleNotificationClick} className="p-2 rounded-full hover:bg-gray-100 relative">
            <FaBell className="text-xl text-gray-700" />
            {!isRead && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-shake">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
              <h4 className="p-3 font-semibold text-gray-700 border-b">Thông báo</h4>
              <ul className="max-h-64 overflow-y-auto">
                {notifications.map((noti, index) => (
                  <li key={index} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <div>{noti.message}</div>
                    <div className="text-xs text-gray-400">{noti.time}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="p-2 rounded-full hover:bg-gray-100">
            <FaUserCircle className="text-2xl text-gray-700" />
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
              <ul className="text-sm text-gray-700">
                <li className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/profile/1")}>
                  <FaUserCircle /> Hồ sơ cá nhân
                </li>
                <li className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/settings")}>
                  <FaCog /> Cài đặt
                </li>
                <li className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer text-red-500" onClick={handleLogout}>
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