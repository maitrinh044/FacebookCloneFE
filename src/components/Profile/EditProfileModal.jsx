// src/components/EditProfileModal.jsx
import { useState } from "react";
import '../Css/EditProfileModal.css';
import { FaBook, FaPhone, FaTimes } from "react-icons/fa";
import "../Css/customSwiper.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Import Navigation từ Swiper
import "swiper/css"; // Import CSS mặc định của Swiper
import "swiper/css/navigation"; // Import CSS cho nút điều hướng

export default function EditProfileModal({ user, onClose, isOpen }) {
  console.log("user: ", user);
  const [name, setName] = useState(user.firstName);
  const [bio, setBio] = useState(user.bio);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [coverPreview, setCoverPreview] = useState(user.coverPhoto);
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [hidePrev, setHidePrev] = useState(true);
  const [hideNext, setHideNext] = useState(false);

  // Danh sách ảnh Story
  const images = [
    "https://via.placeholder.com/200x300?text=Story+1",
    "https://via.placeholder.com/200x300?text=Story+2",
    "https://via.placeholder.com/200x300?text=Story+3",
    "https://via.placeholder.com/200x300?text=Story+4",
    "https://via.placeholder.com/200x300?text=Story+5",
  ];

  if (!isOpen) return null;
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    }
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name,
      bio,
      avatar: avatarPreview,
      coverPhoto: coverPreview,
      email,
      phone,
    };
    onSave(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] ">
      <div className="relative bg-white p-5 rounded-lg shadow-lg w-[800px] max-w-full flex flex-col max-h-[90vh] overflow-y-auto z-[1001]">
        {/* header */}
        <div className="flex justify-between items-center border-b-2 border-gray-500 p-4">
          <h1 className="text-xl font-bold mb-1 flex-1 text-center">Chỉnh sửa trang cá nhân</h1>
          <button className="text-gray-600 hover:text-red-500" onClick={onClose}>
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        {/* content edit */}
        <div className="overflow-y-auto p-2 flex-1 max-h-[700px] flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <div className="flex justify-between">
              <h2 className="font-bold text-[20px]">Ảnh đại diện</h2>
              <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Chỉnh sửa</button>
            </div>
            <div className="flex justify-center">
              <div className="rounded-full object-cover">
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="rounded-full object-cover w-40 h-40"
                />
              </div>
            </div>
            {/* <label className="text-sm font-semibold">Tên</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            /> */}
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex justify-between">
              <h2 className="font-bold text-[20px]">Ảnh bìa</h2>
              <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Chỉnh sửa</button>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-[500px] mx-auto">
                <img
                  src={user.coverPhoto}
                  alt="avatar"
                  className="rounded-md object-cover w-full h-40"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex justify-between">
              <h2 className="font-bold text-[20px]">Tiểu sử</h2>
              <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Thêm</button>
            </div>
            <div className="flex justify-center">
              <div className="text-gray-800">
                {user.bio}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex justify-between">
              <h2 className="font-bold text-[20px]">Chỉnh sửa phần giới thiệu</h2>
              <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Thêm</button>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-5 mb-2">
                <div className="relative -top-[3px] mt-2 text-gray-600">
                  <FaBook />
                </div>
                <div className="text-sm">{user.email}</div>
              </div>
              <div className="flex items-center gap-5">
                <div className="relative -top-[3px] mt-2 text-gray-600">
                  <FaPhone />
                </div>
                <div className="text-sm">{user.phone}</div>
              </div>
            </div>
          </div>
          <div className="w-full relative flex flex-col gap-5">
            <div className="flex justify-between">
              <h2 className="font-bold text-[20px]">Chỉnh sửa phần giới thiệu</h2>
              <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Thêm</button>
            </div>
            <div className="w-full px-4 max-w-[500px] mx-auto p-5">
                <Swiper
                    slidesPerView={3}
                    spaceBetween={15}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }}
                    modules={[Navigation]}
                    className="mySwiper"
                    onSlideChange={(swiper) => {
                        setHidePrev(swiper.isBeginning);
                        setHideNext(swiper.isEnd);
                    }}
                >
                    {images.map((src, index) => (
                        <SwiperSlide key={index} className="rounded-lg overflow-hidden shadow-md max-w-[160px]">
                            <img
                                src={src}
                                alt={`Story ${index + 1}`}
                                className="w-full h-60 object-cover rounded-md border border-gray-300"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Next & Previous Buttons */}
                <div className={`swiper-button-prev custom-nav-btn-editprl ${hidePrev ? "hidden" : ""}`}></div>
                <div className={`swiper-button-next custom-nav-btn-editprl ${hideNext ? "hidden" : ""}`}></div>
            </div>
          </div>
          <button
            className="bg-blue-100 text-blue-700 font-semibold text-[17px] px-4 py-2 rounded-md hover:bg-blue-200"
            onClick={handleSave}
          >
            Chỉnh sửa thông tin giới thiệu
          </button>
        </div>
      </div>
    </div>
  );
}
