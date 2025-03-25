import { Link } from "react-router-dom";
import {
  FaAngleDoubleDown,
  FaAngleDown,
  FaCamera,
  FaPen,
  FaPlus
} from "react-icons/fa";
import { useEffect, useState } from "react";
import ProfileEditModal from "../Profile/EditProfileModal";
export default function ProfileHeader({ user, userId, isOwnProfile, onEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (isModalOpen) { 
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isModalOpen]);
  
  
  return (
    <div className="relative w-full h-60">
      {/* Ảnh bìa */}
      <div className="relative w-full h-full bg-gradient-to-b from-gray-400 to-white">
        <div className="max-w-[1000px] mx-auto h-full relative">
          <img
            src={user.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover rounded-[10px]"
          />

          {/* Nút chỉnh sửa hồ sơ */}
          {isOwnProfile && (
            <div className="absolute bottom-4 right-4">
              <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 shadow-md">Chỉnh sửa ảnh bìa</button>
            </div>
          )}
        </div>
      </div>


      {/* Thông tin hồ sơ */}
      <div className="absolute -bottom-50 left-1/2 -translate-x-1/2 gap-4 w-full px-8 bg-white flex-none">
        <div className="max-w-[1000px] mx-auto  flex items-center gap-5">
        <div className="relative w-48 h-40">
            {/* Avatar */}
          <img
            src={"https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/454496844_479840731481859_2536333414267653734_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGwctavh29EJSB0-bkY20f0kZNUFeeeddyRk1QV55513FjqWTv8mBUs9yycAiuSMb6yl65937x7WTTl8lbNf4lC&_nc_ohc=Caqr4CMaikEQ7kNvgFQBmVY&_nc_oc=AdlSOfGsP2-Rj8HiAfLYElg3OIFw9fgfj2GeTqP3Cmfrzqf6D5jLoWDwqszDLt__r_KV9KrbLVscLHCXME2P_2ct&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=QqXenu98qzXXrqIfhDAcFQ&oh=00_AYFKhmICmlVB68VTEMjuSj6GcVKwfHbZf1GkdAs8VFBjuw&oe=67E4C377"}
            alt="Avatar"
            className="w-48 h-48 rounded-full border-4 border-white shadow-lg object-cover absolute top-[-30px]"
          />
          {isOwnProfile && (
            <div className="text-2xl absolute w-25 h-25 bottom-1 right-1 bg-gray-200 p-2 rounded-full shadow-md">
           <FaCamera/>
          </div>
          )}
        </div>

        <div className="w-64 flex-1">
          {/* Tên & Bio */}
        <div className="">
          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-600">{user.bio}</p>
          {!isOwnProfile && (
            <p className="text-gray-600">176 bạn bè</p>
          )}
          <div className="flex items-center">
          <img
            src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/454496844_479840731481859_2536333414267653734_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGwctavh29EJSB0-bkY20f0kZNUFeeeddyRk1QV55513FjqWTv8mBUs9yycAiuSMb6yl65937x7WTTl8lbNf4lC&_nc_ohc=Caqr4CMaikEQ7kNvgFQBmVY&_nc_oc=AdlSOfGsP2-Rj8HiAfLYElg3OIFw9fgfj2GeTqP3Cmfrzqf6D5jLoWDwqszDLt__r_KV9KrbLVscLHCXME2P_2ct&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=QqXenu98qzXXrqIfhDAcFQ&oh=00_AYFKhmICmlVB68VTEMjuSj6GcVKwfHbZf1GkdAs8VFBjuw&oe=67E4C377"
            className="w-10 h-10 rounded-full border-2 border-white shadow-lg object-cover"
          />
          <img
            src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/454496844_479840731481859_2536333414267653734_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGwctavh29EJSB0-bkY20f0kZNUFeeeddyRk1QV55513FjqWTv8mBUs9yycAiuSMb6yl65937x7WTTl8lbNf4lC&_nc_ohc=Caqr4CMaikEQ7kNvgFQBmVY&_nc_oc=AdlSOfGsP2-Rj8HiAfLYElg3OIFw9fgfj2GeTqP3Cmfrzqf6D5jLoWDwqszDLt__r_KV9KrbLVscLHCXME2P_2ct&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=QqXenu98qzXXrqIfhDAcFQ&oh=00_AYFKhmICmlVB68VTEMjuSj6GcVKwfHbZf1GkdAs8VFBjuw&oe=67E4C377"
            className="w-10 h-10 rounded-full border-2 border-white shadow-lg object-cover -ml-2"
          />
          <img
            src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/454496844_479840731481859_2536333414267653734_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGwctavh29EJSB0-bkY20f0kZNUFeeeddyRk1QV55513FjqWTv8mBUs9yycAiuSMb6yl65937x7WTTl8lbNf4lC&_nc_ohc=Caqr4CMaikEQ7kNvgFQBmVY&_nc_oc=AdlSOfGsP2-Rj8HiAfLYElg3OIFw9fgfj2GeTqP3Cmfrzqf6D5jLoWDwqszDLt__r_KV9KrbLVscLHCXME2P_2ct&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=QqXenu98qzXXrqIfhDAcFQ&oh=00_AYFKhmICmlVB68VTEMjuSj6GcVKwfHbZf1GkdAs8VFBjuw&oe=67E4C377"
            className="w-10 h-10 rounded-full border-2 border-white shadow-lg object-cover -ml-2"
          />
          <img
            src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/454496844_479840731481859_2536333414267653734_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGwctavh29EJSB0-bkY20f0kZNUFeeeddyRk1QV55513FjqWTv8mBUs9yycAiuSMb6yl65937x7WTTl8lbNf4lC&_nc_ohc=Caqr4CMaikEQ7kNvgFQBmVY&_nc_oc=AdlSOfGsP2-Rj8HiAfLYElg3OIFw9fgfj2GeTqP3Cmfrzqf6D5jLoWDwqszDLt__r_KV9KrbLVscLHCXME2P_2ct&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=QqXenu98qzXXrqIfhDAcFQ&oh=00_AYFKhmICmlVB68VTEMjuSj6GcVKwfHbZf1GkdAs8VFBjuw&oe=67E4C377"
            className="w-10 h-10 rounded-full border-2 border-white shadow-lg object-cover -ml-2"
          />
        </div>
        </div>
        </div>
        {/* Nút hành động (Thêm bạn bè, Nhắn tin) */}
        {!isOwnProfile && (
            <div className=" flex gap-3 ">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm shadow">
                Thêm bạn bè
              </button>
              <button className="bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 text-sm shadow">
                Nhắn tin
              </button>
            </div>
          )}
        {isOwnProfile && (
        <div className=" w-32 flex-1 flex flex-col gap-5">
          <div className="flex flex-row-reverse">
          <div className="flex gap-3 items-center">
            <button className="w-40 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 text-sm shadow flex items-center justify-center gap-2">
              <FaPlus /> Thêm thông tin
            </button>
            <button className="text-bold bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 text-sm shadow flex items-center gap-2"
              onClick={onEdit}
            >
              <FaPen /> 
              {/* <Link to={`/profile/${userId}/edit`} className="text-black">
                Chỉnh sửa trang cá nhân
              </Link> */}
              Chỉnh sửa trang cá nhân
            </button>
            {/* Hiển thị modal nếu mở */}
            <ProfileEditModal user={user} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </div>     
          </div>
          <div className="flex flex-row-reverse">
            <button className="bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 text-sm shadow">
            <FaAngleDown />
            </button>
          </div>
        </div>
      )}
        </div>
      </div>
      
    </div>
  );
}
