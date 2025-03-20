// src/pages/EditProfilePage.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Giả lập dữ liệu user ban đầu (sau này bạn có thể fetch từ API)
  const [formData, setFormData] = useState({
    name: 'Nguyễn Văn A',
    bio: 'Yêu thích lập trình, sống chậm.',
    avatar: 'https://via.placeholder.com/150',
    coverPhoto: 'https://via.placeholder.com/600x200',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const fileUrl = URL.createObjectURL(files[0]);
      setFormData((prev) => ({ ...prev, [name]: fileUrl }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gửi dữ liệu cập nhật lên server
    console.log('Cập nhật thông tin:', formData);
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Chỉnh sửa trang cá nhân</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Ảnh Cover */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Ảnh bìa</label>
          <input type="file" accept="image/*" name="coverPhoto" onChange={handleChange} />
          <img src={formData.coverPhoto} alt="Cover Preview" className="mt-2 w-full h-48 object-cover rounded" />
        </div>

        {/* Ảnh Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
          <input type="file" accept="image/*" name="avatar" onChange={handleChange} />
          <img src={formData.avatar} alt="Avatar Preview" className="mt-2 w-28 h-28 rounded-full object-cover border-2 border-gray-300" />
        </div>

        {/* Tên */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên hiển thị</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Giới thiệu / Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        {/* Nút lưu */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}
