import { Link, useLocation } from "react-router-dom";
import { 
  FaHome,
  FaUserFriends,
  FaUserPlus,
  FaUsers
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  
  // Kiểm tra path hiện tại để highlight menu
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 p-4 bg-white shadow-md h-screen sticky top-0">
      <h2 className="font-bold text-xl mb-4">Bạn bè</h2>
      <ul className="space-y-2">
        <li>
          <Link 
            to="/" 
            className={`flex items-center p-3 rounded-lg hover:bg-gray-100 ${
              isActive("/") ? "bg-blue-50 text-blue-600 font-medium" : ""
            }`}
          >
            <FaHome className="mr-3 text-lg" />
            <span>Trang chủ</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/friend-requests" 
            className={`flex items-center p-3 rounded-lg hover:bg-gray-100 ${
              isActive("/friend-requests") ? "bg-blue-50 text-blue-600 font-medium" : ""
            }`}
          >
            <FaUserFriends className="mr-3 text-lg" />
            <span>Lời mời kết bạn</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/suggestions" 
            className={`flex items-center p-3 rounded-lg hover:bg-gray-100 ${
              isActive("/suggestions") ? "bg-blue-50 text-blue-600 font-medium" : ""
            }`}
          >
            <FaUserPlus className="mr-3 text-lg" />
            <span>Gợi ý</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/friends" 
            className={`flex items-center p-3 rounded-lg hover:bg-gray-100 ${
              isActive("/friends") ? "bg-blue-50 text-blue-600 font-medium" : ""
            }`}
          >
            <FaUsers className="mr-3 text-lg" />
            <span>Tất cả bạn bè</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}