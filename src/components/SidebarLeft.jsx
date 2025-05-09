import { FaUser, FaUsers, FaStore, FaVideo } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getUserById } from "../services/UserService";
import { useState, useEffect } from "react";

export default function SidebarLeft() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const user = await getUserById(userId);
        setCurrentUser(user);
      } catch (error) {
        console.error("Lỗi khi lấy người dùng:", error);
      }
    };

    fetchUser();
  }, []);

  if (!currentUser) {
    return <div className="p-4">Đang tải người dùng...</div>;
  }

  return (
    <div className="w-64 p-4 bg-white shadow-md min-h-screen border-r border-gray-200 rounded-[10px]">
      {/* Avatar + Tên người dùng */}
      <Link
        to={`/profile/${currentUser.id}`}
        className="flex items-center gap-3 mb-6 hover:bg-gray-100 p-2 rounded-md transition"
      >
        <img
          src={currentUser.profilePicture || "/default-avatar.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-medium text-gray-800">
          {currentUser.lastName} {currentUser.firstName}
        </span>
      </Link>

      {/* Menu bên dưới */}
      <ul className="space-y-4 text-gray-700">
        <li>
          <Link
            to={`/profile/${currentUser.id}`}
            className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md transition"
          >
            <FaUser className="text-blue-600" />
            <span>Trang cá nhân</span>
          </Link>
        </li>
        <li>
          <div
            onClick={() => navigate("/friends")}
            className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md transition cursor-pointer"
          >
            <FaUsers className="text-blue-600" />
            <span>Bạn bè</span>
          </div>
        </li>
        <li>
          <div onClick={() => navigate("/watch")}
               className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md transition cursor-pointer">
            <FaVideo className="text-blue-600" />
            <span>Watch</span>
          </div>
        </li>
        <li>
          <div onClick={() => navigate("/marketplace")}
              className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md transition cursor-pointer">
            <FaStore className="text-blue-600" />
            <span>Marketplace</span>
          </div>
        </li>
      </ul>
    </div>
  );
}
