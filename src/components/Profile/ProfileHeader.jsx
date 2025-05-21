import { Link } from "react-router-dom";
import {
  FaAngleDoubleDown,
  FaAngleDown,
  FaCamera,
  FaPen,
  FaPlus,
  FaUserCircle,
  FaUserPlus,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import ProfileEditModal from "../Profile/EditProfileModal";
import * as FriendlistService from "../../services/FriendlistService";
import { getUserById } from "../../services/profileService";
// import { getUserById } from "../../services/userService";

export default function ProfileHeader({ user, isOwnProfile, onEdit, listFriends, onOpenChat }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState(null); // null, 'PENDING', 'ACCEPTED', 'REJECTED'
  const [friendshipId, setFriendshipId] = useState(null);
  const [isUnfriendConfirm, setIsUnfriendConfirm] = useState(false); // For two-step unfriend confirmation
  const currentUserId = parseInt(localStorage.getItem("userId"));
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isModalOpen]);

  useEffect(() => {
    const fetchFriendshipStatus = async () => {
      if (isOwnProfile || !currentUserId || !accessToken) return;

      try {
        const friendships = await FriendlistService.getAllFriendships();
        const relevantFriendship = friendships.find(
          (f) =>
            (f.user1.id === currentUserId && f.user2.id === user.id) ||
            (f.user1.id === user.id && f.user2.id === currentUserId)
        );

        if (relevantFriendship) {
          setFriendshipStatus(relevantFriendship.type);
          setFriendshipId(relevantFriendship.id);
        } else {
          setFriendshipStatus(null);
        }
      } catch (error) {
        console.error("Không thể tải trạng thái bạn bè:", error);
      }
    };

    fetchFriendshipStatus();
  }, [currentUserId, user.id, isOwnProfile, accessToken]);

  // Reset unfriend confirmation if friendship status changes
  useEffect(() => {
    setIsUnfriendConfirm(false);
  }, [friendshipStatus]);

  const handleAddFriend = async () => {
    if (!accessToken) {
      message.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    try {
      const currentUser = await getUserById(currentUserId);
      const friendUser = await getUserById(user.id);

      const friendshipData = {
        user1: { id: currentUserId },
        user2: { id: user.id },
        type: "PENDING",
        activeStatus: "ACTIVE",
      };

      const response = await FriendlistService.addFriendship(friendshipData);
      setFriendshipStatus("PENDING");
      setFriendshipId(response.id);
      message.success(`Đã gửi lời mời kết bạn đến ${friendUser.firstName} ${friendUser.lastName}`);
    } catch (error) {
      console.error("Lỗi khi gửi lời mời kết bạn:", error);
      message.error("Không thể gửi lời mời kết bạn. Vui lòng thử lại.");
    }
  };

  const handleCancelRequest = async () => {
    if (!accessToken) {
      message.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    try {
      const friendshipData = {
        id: friendshipId,
        user1: { id: currentUserId },
        user2: { id: user.id },
        type: "REJECTED",
        activeStatus: "ACTIVE",
      };

      await FriendlistService.updateFriendship(friendshipData);
      setFriendshipStatus(null);
      setFriendshipId(null);
      message.success("Đã hủy lời mời kết bạn.");
    } catch (error) {
      console.error("Lỗi khi hủy lời mời:", error);
      message.error("Không thể hủy lời mời. Vui lòng thử lại.");
    }
  };

  const handleUnfriend = async () => {
    if (!accessToken) {
      message.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    if (!isUnfriendConfirm) {
      setIsUnfriendConfirm(true);
      return;
    }

    try {
      const friendshipData = {
        id: friendshipId,
        user1: { id: currentUserId },
        user2: { id: user.id },
        type: "REJECTED",
        activeStatus: "ACTIVE",
      };

      await FriendlistService.updateFriendship(friendshipData);
      setFriendshipStatus(null);
      setFriendshipId(null);
      setIsUnfriendConfirm(false);
      message.success("Đã hủy kết bạn.");
    } catch (error) {
      console.error("Lỗi khi hủy kết bạn:", error);
      message.error("Không thể hủy kết bạn. Vui lòng thử lại.");
    }
  };

  const renderFriendButton = () => {
    if (isOwnProfile) return null;

    switch (friendshipStatus) {
      case "PENDING":
        return (
          <button
            onClick={handleCancelRequest}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 text-sm shadow flex items-center gap-2"
          >
            <FaUserTimes /> Hủy lời mời
          </button>
        );
      case "ACCEPTED":
        return (
          <button
            onClick={handleUnfriend}
            className={
              isUnfriendConfirm
                ? "bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 text-sm shadow flex items-center gap-2"
                : "bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 text-sm shadow flex items-center gap-2"
            }
          >
            {isUnfriendConfirm ? (
              <>
                <FaUserTimes /> Hủy kết bạn
              </>
            ) : (
              <>
                <FaUserCheck /> Bạn bè
              </>
            )}
          </button>
        );
      default:
        return (
          <button
            onClick={handleAddFriend}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm shadow flex items-center gap-2"
          >
            <FaUserPlus /> Thêm bạn bè
          </button>
        );
    }
  };

  // Reset unfriend confirmation on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".friend-button")) {
        setIsUnfriendConfirm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full h-60">
      {/* Ảnh bìa */}
      <div className="relative w-full h-full bg-gradient-to-b from-gray-400 to-white">
        <div className="max-w-[1000px] mx-auto h-full relative">
          {user.coverPhoto != null && (
            <img
              src={user.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover rounded-[10px]"
            />
          )}
          {user.coverPhoto == null && (
            <div className="w-full h-full object-cover rounded-[10px] bg-gray-300"></div>
          )}

          {/* Nút chỉnh sửa hồ sơ */}
          {/* {isOwnProfile && (
            <div className="absolute bottom-4 right-4">
              <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 shadow-md">Chỉnh sửa ảnh bìa</button>
            </div>
          )} */}
        </div>
      </div>

      {/* Thông tin hồ sơ */}
      <div className="absolute -bottom-50 left-1/2 -translate-x-1/2 gap-4 w-full px-8 bg-white flex-none">
        <div className="max-w-[1000px] mx-auto  flex items-center gap-5">
          <div className="relative w-48 h-40">
            {/* Avatar */}
          
            {user.profilePicture != null && (
              <img
                src={user.profilePicture}
                alt="Avatar"
                className="w-48 h-48 rounded-full border-4 border-white shadow-lg object-cover absolute top-[-30px]"
              />
            )}
            {user.profilePicture == null && (
              <FaUserCircle className="w-48 h-48 rounded-full border-4 border-white shadow-lg object-cover absolute top-[-30px] text-gray-400"/>
            )}
            {isOwnProfile && (
              <div className="text-2xl absolute w-25 h-25 bottom-1 right-1 bg-gray-200 p-2 rounded-full shadow-md">
                <FaCamera/>
              </div>
            )}
          </div>

          <div className="w-64 flex-1">
            {/* Tên & Bio */}
            <div className="">
              <h1 className="text-2xl font-bold text-gray-800">{user.firstName + " " + user.lastName}</h1>
              <p className="text-gray-600">{user.biography}</p>
              {/* {!isOwnProfile && ( */}
                <p className="text-gray-600">{listFriends.length} bạn bè</p>
              {/* )} */}
              <div className="flex items-center">
                {listFriends.slice(0, 5).map(e => (
                  <div key={e.id} className="">
                    {e.imageUrl ? (
                      <img
                        src={e.imageUrl}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-lg object-cover -ml-2"
                      />
                    ) : (
                      <FaUserCircle className="w-10 h-10 rounded-full border-2 border-white shadow-lg object-cover -ml-2 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Nút hành động (Thêm bạn bè, Nhắn tin) */}
          {!isOwnProfile && (
            <div className="flex gap-3">
              <div className="friend-button">
                {renderFriendButton()}
              </div>
              <button className="bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 text-sm shadow" onClick={() => onOpenChat(user)}>
                Nhắn tin
              </button>
            </div>
          )}
          {isOwnProfile && (
            <div className="w-32 flex-1 flex flex-col gap-5">
              <div className="flex flex-row-reverse">
                <div className="flex gap-3 items-center">
                  {/* <button className="w-40 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 text-sm shadow flex items-center justify-center gap-2">
                    <FaPlus /> Thêm thông tin
                  </button> */}
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