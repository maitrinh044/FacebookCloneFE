import { FaHome, FaUserFriends, FaUserPlus, FaUsers } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 p-4 bg-white shadow-md h-screen sticky top-0">
      <h2 className="font-bold text-xl mb-4">Bạn bè</h2>
      <ul className="space-y-2">
        <li>
          <NavLink 
            to="/friends/all" 
            className={({isActive}) => 
              `flex items-center p-3 rounded-lg hover:bg-gray-100 ${
                isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
              }`
            }
          >
            <FaUsers className="mr-3 text-lg" />
            <span>Tất cả bạn bè</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/friends/requests" 
            className={({isActive}) => 
              `flex items-center p-3 rounded-lg hover:bg-gray-100 ${
                isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
              }`
            }
          >
            <FaUserFriends className="mr-3 text-lg" />
            <span>Lời mời kết bạn</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/friends/suggestions" 
            className={({isActive}) => 
              `flex items-center p-3 rounded-lg hover:bg-gray-100 ${
                isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
              }`
            }
          >
            <FaUserPlus className="mr-3 text-lg" />
            <span>Gợi ý kết bạn</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}