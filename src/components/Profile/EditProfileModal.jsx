// src/components/EditProfileModal.jsx
import { useState } from "react";
import '../Css/EditProfileModal.css';
import { FaBirthdayCake, FaBook, FaFemale, FaGenderless, FaMale, FaPhone, FaTimes, FaUserCircle } from "react-icons/fa";
import "../Css/customSwiper.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Import Navigation từ Swiper
import "swiper/css"; // Import CSS mặc định của Swiper
import "swiper/css/navigation"; // Import CSS cho nút điều hướng
import { use } from "react";

export default function EditProfileModal({ user, onClose, isOpen, updateUser }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName)
  const [bio, setBio] = useState(user.biography);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [coverPhoto, setCoverPhoto] = useState(user.coverPhoto);
  const [birthday, setBirthDay] = useState(user.birthday);
  const [gender, setGender] = useState(user.gender)
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [hidePrev, setHidePrev] = useState(true);
  const [hideNext, setHideNext] = useState(false);


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

  // const handleSave = () => {
  //   const updatedUser = {
  //     ...user,
  //     firstName, 
  //     lastName,
  //     birthday,
  //     gender,
  //     bio,
  //     profilePicture,
  //     coverPhoto,
  //     email,
  //     phone,
  //   };
  //   updateUser(updateUser);
  //   onClose();
  // };
  const handleSave = () => {
    const updatedUser = {
        id: user.id, // Đảm bảo rằng bạn có ID của người dùng
        firstName : firstName, 
        lastName: lastName,
        birthday: birthday,
        gender: gender,
        biography: bio, // Sử dụng biến bio đã cập nhật
        profilePicture: profilePicture,
        coverPhoto: coverPhoto,
        email: email,
        phone: phone,
        password: user.password,
        role: user.role,
        createdAt: user.createdAt,
        activeStatus: user.activeStatus,
        online: user.online
    };

    updateUser(updatedUser); // Gọi hàm cập nhật với đối tượng đã chỉnh sửa
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
              {/* <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Chỉnh sửa</button> */}
              {profilePicture != null ? (
                <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Chỉnh sửa</button>
              ) : (
                <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Thêm</button>
              )}
            </div>
            <div className="flex justify-center">
              <div className="rounded-full object-cover">
                {/* <img
                  src={user.}
                  alt="avatar"
                  className="rounded-full object-cover w-40 h-40"
                /> */}
                {profilePicture != null ? (
                  <img
                    src={profilePicture}
                    alt="avatar"
                    className="rounded-full object-cover w-40 h-40"
                  />
                ) : (
                  <FaUserCircle className="rounded-full object-cover w-40 h-40 text-gray-300" />
                )}
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
              {/* <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Chỉnh sửa</button> */}
              {coverPhoto != null ? (
                <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Chỉnh sửa</button>
              ) : (
                <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Thêm</button>
              )}
            </div>
            <div className="flex justify-center">
              {/* <div className="w-full max-w-[500px] mx-auto">
                <img
                  src={user.coverPhoto}
                  alt="avatar"
                  className="rounded-md object-cover w-full h-40"
                />
              </div> */}
              {coverPhoto != null ? (
                <div className="w-full max-w-[500px] mx-auto">
                  <img
                    src={coverPhoto}
                    alt="avatar"
                    className="rounded-md object-cover w-full h-40"
                  />
                </div>
              ) : (
                <div className="rounded-md object-cover w-full h-40 bg-gray-300"></div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex justify-between">
              <h2 className="font-bold text-[20px]">Tiểu sử</h2>
            </div>
            <div className="flex justify-center">
              <textarea
                className="text-gray-800 w-full h-[100px] p-1 resize-none overflow-y-auto text-start"
                value={bio}
                placeholder="Nhập tiểu sử của bạn..."
                onChange={(e)=>setBio(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex justify-between">
              <h2 className="font-bold text-[20px]">Chỉnh sửa phần giới thiệu</h2>
              {/* <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Thêm</button>
              {user.biography != null ? (
                <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Chỉnh sửa</button>
              ) : (
                <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Thêm</button>
              )} */}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-5 mb-2">
                <div className="relative -top-[3px] mt-2 text-gray-600">
                  Họ
                </div>
                {/* <div className="text-sm">{user.firstName + " " + user.lastName}</div> */}
                <input className="rounded p-1 flex-1" value={firstName} onChange={(e) => setFirstName(e.target.value)}></input>
              </div>
              <div className="flex items-center gap-5 mb-2">
                <div className="relative -top-[3px] mt-2 text-gray-600">
                  Tên
                </div>
                {/* <div className="text-sm">{user.firstName + " " + user.lastName}</div> */}
                <input className="rounded p-1 flex-1" value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
              </div>
              <div className="flex items-center gap-5 mb-2">
                <div className="relative -top-[3px] mt-2 text-gray-600">
                  {gender == 'MALE' ? (
                    <FaMale/>
                  ) : (
                    <FaFemale/>
                  )}
                </div>
                {/* <div className="text-sm">{user.gender == 'MALE' ? "Nam" : "Nữ"}</div> */}
                {/* <input className="rounded p-1 flex-1" value={user.gender == 'MALE' ? "Nam" : "Nữ"}  onChange={(e) => setFirstName(e.target.value)}></input> */}
                <select className="rounded p-1 flex-1" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value='MALE'>Nam</option>
                  <option value='FEMALE'>Nữ</option>
                  <option value='UNDEFINED'>Khác</option>
                </select>
              </div>
              <div className="flex items-center gap-5 mb-2">
                <div className="relative -top-[3px] mt-2 text-gray-600">
                  <FaBook />
                </div>
                {/* <div className="text-sm">{user.email}</div> */}
                <input className="rounded p-1 flex-1" value={email} onChange={(e) => setEmail(e.target.value)}></input>
              </div>
              <div className="flex items-center gap-5 mb-2">
                <div className="relative -top-[3px] mt-2 text-gray-600">
                  <FaPhone />
                </div>
                {/* <div className="text-sm">{user.phone}</div> */}
                <input className="rounded p-1 flex-1" value={phone} onChange={(e) => setPhone(e.target.value)}></input>
              </div>
              <div className="flex items-center gap-5 mb-2">
                <div className="relative -top-[3px] mt-2 text-gray-600">
                  <FaBirthdayCake/>
                </div>
                {/* <div className="text-sm">{user.phone}</div> */}
                <input className="rounded p-1 flex-1" value={birthday} onChange={(e) => setBirthDay(e.target.value)}></input>
              </div>
            </div>
          </div>
          {/*  */}
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
