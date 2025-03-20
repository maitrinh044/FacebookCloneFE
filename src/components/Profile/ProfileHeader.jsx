// src/components/ProfileHeader.jsx
import { Link } from "react-router-dom";

export default function ProfileHeader({ user, userId, isOwnProfile }) {
  return (
    <div className="relative w-full h-80">
      <img
        src={user.coverPhoto}
        alt="Cover"
        className="w-full h-full object-cover rounded-[10px]"
      />

      {isOwnProfile && (
        <div className="absolute top-4 right-4">
          <Link
            to={`/profile/${userId}/edit`}
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
          >
            Chỉnh sửa
          </Link>
        </div>
      )}

      <div className="absolute -bottom-28 left-8 flex items-center gap-4">
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-600">{user.bio}</p>

          {!isOwnProfile && (
            <div className="flex gap-3 mt-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm shadow">
                Thêm bạn bè
              </button>
              <button className="bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 text-sm shadow">
                Nhắn tin
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
