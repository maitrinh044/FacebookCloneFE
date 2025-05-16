import {
  FaFacebook,
  FaUserFriends,
  FaBell,
  FaSearch,
  FaFacebookMessenger,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,

  FaHome,
  FaUsers,
  FaTv,
  FaStore,
  FaMagento,

} from "react-icons/fa";

import { handleLogout } from "../utils/auth";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import MessagePopup from "./Message/MessagePopup";

import useFetchUserFriends from "../utils/useFetchUserFriends";
import MessagePanel from "./Message/MessagePanel";
import { getLastMessage } from "../services/MessageService";
import { useStomp } from "../contexts/StompContext";
import { useFetchUserById } from "../utils/useFetchUser";

export default function Header() {
  const navigate = useNavigate();
  const { disconnect } = useStomp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openChats, setOpenChats] = useState([]);
  const location = useLocation();

  const userId = localStorage.getItem("userId");
  const { user, loading, error } = useFetchUserById(userId);

  // console.log(user);
  const notifications = [
    
  ];


  const friendList = useFetchUserFriends().friends || [];
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


  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setIsRead(true);
  };

  const onLogout = () => {
    handleLogout(disconnect, navigate);
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
      {/* Left: Logo + Search */}
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


      {/* Middle: Navigation icons */}
      <div className="flex gap-8 items-center">
        <Link
          to="/"
          className={`p-2 rounded-md ${location.pathname === "/" ? "text-blue-600 border-b-4 border-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <FaHome className="text-2xl" />
        </Link>
        <Link
          to="/groups"
          className={`p-2 rounded-md ${location.pathname.startsWith("/groups") ? "text-blue-600 border-b-4 border-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <FaUsers className="text-2xl" />
        </Link>
        <Link
          to="/watch"
          className={`p-2 rounded-md ${location.pathname === "/watch" ? "text-blue-600 border-b-4 border-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <FaTv className="text-2xl" />
        </Link>
        <Link
          to="/marketplace"
          className={`p-2 rounded-md ${location.pathname === "/marketplace" ? "text-blue-600 border-b-4 border-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <FaStore className="text-2xl" />
        </Link>
        <Link
          to="/admin"
          className={`p-2 rounded-md ${location.pathname === "/admin" ? "text-blue-600 border-b-4 border-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <FaMagento className="text-2xl" />
        </Link>
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
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-shake">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
              <h4 className="p-3 font-semibold text-gray-700 border-b">Thông báo</h4>
              <ul className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? notifications.map((noti, index) => (
                  <li key={index} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <div>{noti.message}</div>
                    <div className="text-xs text-gray-400">{noti.time}</div>
                  </li>
                )) : <li><div className="text-s text-gray-400">Không có thông báo</div> </li>}
              </ul>
            </div>
          )}

        </div>

        <div className="relative" ref={profileRef}>
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="p-2 rounded-full hover:bg-gray-100">
            <img
              src={user?.profilePicture || "/default-avatar.png"}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
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
                <li className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer text-red-500" onClick={onLogout}>

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