// src/components/EditProfileModal.jsx
import { useState } from "react";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [coverPreview, setCoverPreview] = useState(user.coverPhoto);
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");

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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa trang cá nhân</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Tên</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Tiểu sử</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 mt-1"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2 mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Số điện thoại</label>
            <input
              type="tel"
              className="w-full border rounded-md px-3 py-2 mt-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Ảnh đại diện</label>
            <input
              type="file"
              accept="image/*"
              className="w-full mt-1"
              onChange={handleAvatarChange}
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="mt-2 w-24 h-24 rounded-full object-cover border"
              />
            )}
          </div>

          <div>
            <label className="text-sm font-semibold">Ảnh bìa</label>
            <input
              type="file"
              accept="image/*"
              className="w-full mt-1"
              onChange={handleCoverChange}
            />
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="mt-2 w-full h-40 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={handleSave}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
