// src/components/CallOverlay.jsx
import { FaPhoneSlash } from "react-icons/fa";

export default function CallOverlay({ friendName, avatarUrl, onEndCall, isVideo = false }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center text-white">
      {/* Avatar người nhận cuộc gọi */}
      <img
        src={avatarUrl || "https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-6/458161522_2243394162660512_7913931544320209269_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFE4H0KfJHUauSeB90nsw9jIBJwHuSktOAgEnAe5KS04F5KUxSkb8DlPyoPUcf2mlb9fV6MzqCuAtSLoc7Ay6-A&_nc_ohc=CXoMMnzvULoQ7kNvgEh0ypF&_nc_oc=Adhd1HcZH8ihnu0nOpaHQL9P6zFJqIzADQy2tSGyfmQKeSJV_6Hkf7Xvt4OoxnzJG3Y&_nc_zt=23&_nc_ht=scontent.fsgn5-6.fna&_nc_gid=AQR7ZI_aDJOrecOKCXIigMN&oh=00_AYGQ7t7qCRDcZNQEIHRWgbCoYPYdNv04Mz2JyaDNxAK61w&oe=67D6AB59"}
        alt="Avatar"
        className="w-28 h-28 rounded-full border-4 border-white mb-4 animate-pulse"
      />

      {/* Tên và trạng thái */}
      <h2 className="text-2xl font-bold">{friendName}</h2>
      <p className="text-sm text-gray-300 mb-6">
        {isVideo ? "Đang gọi video..." : "Đang gọi thoại..."}
      </p>

      {/* Nút kết thúc cuộc gọi */}
      <button
        onClick={onEndCall}
        className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 rounded-full transition"
      >
        <FaPhoneSlash />
        Kết thúc cuộc gọi
      </button>
    </div>
  );
}
