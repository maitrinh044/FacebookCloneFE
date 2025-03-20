import { FaUser, FaUsers, FaStore, FaVideo } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function SidebarLeft() {
  const navigate = useNavigate();

  return (
    <div className="w-64 p-4 bg-white shadow-md min-h-screen border-r border-gray-200 rounded-[10px]">
      {/* Avatar + Tên người dùng */}
      <Link
        to="/profile/1"
        className="flex items-center gap-3 mb-6 hover:bg-gray-100 p-2 rounded-md transition"
      >
        <img
          src="https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-6/458161522_2243394162660512_7913931544320209269_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFE4H0KfJHUauSeB90nsw9jIBJwHuSktOAgEnAe5KS04F5KUxSkb8DlPyoPUcf2mlb9fV6MzqCuAtSLoc7Ay6-A&_nc_ohc=kqOz0D6i-YsQ7kNvgE4uLAK&_nc_oc=AdjLbeTvbqDpEf3PqOnXcGRJiflSyeVdVRHl3wj4WjlTjjDT9UrOc2T8xm-qtT1jjpRruk1l4INGD5vQifX-sHr0&_nc_zt=23&_nc_ht=scontent.fsgn2-5.fna&_nc_gid=AYszchcaBEzZ-DAYZzyEWyT&oh=00_AYHAhvAo71MOCC2cgl3wW0W092jaDfz81AjX8y_Xvqipiw&oe=67D4B119"
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-medium text-gray-800">Nguyễn Mai Trinh</span>
      </Link>

      {/* Menu bên dưới */}
      <ul className="space-y-4 text-gray-700">
        <li>
          <Link
            to="/profile/1"
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
          <div className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md transition cursor-pointer">
            <FaVideo className="text-blue-600" />
            <span>Watch</span>
          </div>
        </li>
        <li>
          <div className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md transition cursor-pointer">
            <FaStore className="text-blue-600" />
            <span>Marketplace</span>
          </div>
        </li>
      </ul>
    </div>
  );
}
