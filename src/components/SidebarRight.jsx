import { FaUserCircle } from "react-icons/fa";

export default function SidebarRight({ onOpenChat }) {
  const onlineFriends = ["An", "Bình", "Chi", "Dũng", "Hà"];

  return (
    <div className="w-64 pt-20 px-4 bg-white min-h-screen border-l border-gray-300 rounded-[10px]">
      <h3 className="text-sm font-semibold mb-4 text-gray-500">Người liên hệ</h3>
      <ul className="space-y-3">
        {onlineFriends.map((friend, index) => (
          <li
            key={index}
            className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
            onClick={() => onOpenChat(friend)}
          >
            <FaUserCircle className="text-blue-500 text-2xl" />
            <span className="text-sm">{friend}</span>
            <span className="w-2 h-2 bg-green-500 rounded-full ml-auto" />
          </li>
        ))}
      </ul>
    </div>
  );
}
