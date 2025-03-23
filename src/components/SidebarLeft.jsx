import { FaUser, FaUsers, FaStore, FaVideo } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function SidebarLeft() {
  const navigate = useNavigate();

  const friends = [];

  return (
    <div className="w-64 p-4 bg-white shadow-md min-h-screen border-r border-gray-200 rounded-[10px]">
      {/* Avatar + Tên người dùng */}
      <Link
        to="/profile/1"
        className="flex items-center gap-3 mb-6 hover:bg-gray-100 p-2 rounded-md transition"
      >
        <img
          src="https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/458161522_2243394162660512_7913931544320209269_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFE4H0KfJHUauSeB90nsw9jIBJwHuSktOAgEnAe5KS04F5KUxSkb8DlPyoPUcf2mlb9fV6MzqCuAtSLoc7Ay6-A&_nc_ohc=iQ1tx_TxP1wQ7kNvgEsi-8q&_nc_oc=Adl7a3TL-zADKRet04rIUkN5YGnAppZNAejwZqaFDN5p9iDJSDeQtBSNmFpPrZxpRYwZgVihbsaV4VUAC8Hqi4vW&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=GLdi76HG6Fi9sQ2kcxc3XA&oh=00_AYFuq-gT_PkH4GCHcNvxKn4njYAN4dKrHlA42kRRUEgG6A&oe=67E1E019"
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
