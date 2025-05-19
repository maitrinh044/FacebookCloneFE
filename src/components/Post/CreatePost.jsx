import { useState, useRef } from "react";
import axiosClient from "../../utils/axiosClient";
import { uploadMedia } from "../../services/MediaService";
import { toast } from "react-toastify";
import React from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data'; 


export default function CreatePost({ onPostCreated, currentUser }) {
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false); // Khởi tạo biến loading
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiSelect = (emoji) => {
    setPostContent((prev) => prev + emoji.native);
  };
  console.log('data: ', data);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePost = async () => {
    if (!postContent.trim() && !selectedImage) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Không tìm thấy userId. Vui lòng đăng nhập lại!");
      return;
    }
    setLoading(true); // Bắt đầu quá trình gửi bài viết
    try {
      let imageUrl = null;
      if (selectedImage) {
        // Giả sử bạn đã upload ảnh lên một dịch vụ lưu trữ, và lấy được URL ảnh.
        imageUrl = await uploadMedia(selectedImage, userId);
        setSelectedImage(imageUrl.url);
      }

      const post = {
        userId: {id: parseInt(userId)},
        content: postContent.trim(),
        imageUrl: imageUrl ? imageUrl.url : null,
        activeStatus: "ACTIVE",  // Bạn có thể thay đổi trạng thái tùy theo nhu cầu
      };

      console.log("send post: ", post);
      // Gửi dữ liệu bài viết, bao gồm content và imageUrl (nếu có)
      // const response = await axiosClient.post("/posts/createPost", post);

      // console.log("Kết quả từ API:", response.data);

      // if (response.data?.statusCode === 200) {
        onPostCreated(post);
        setPostContent("");
        setSelectedImage(null);
        setImagePreview("");
        toast.success("Bài viết đã được đăng thành công!");
        if (fileInputRef.current) fileInputRef.current.value = "";
      // } else {
        // alert(`Lỗi khi tạo bài viết: ${response.data.message}`);
      // }
        setShowPicker(false);
    } catch (error) {
      console.error("❌ Lỗi khi gửi bài viết:", error.response?.data || error);
      toast.error("Đã có lỗi xảy ra khi đăng bài viết. Vui lòng thử lại!");
    }finally {
      setLoading(false); // Kết thúc quá trình gửi bài viết
    }
  };

  return (
    <div className="bg-white rounded shadow-md p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={currentUser?.profilePicture || "https://via.placeholder.com/40"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder="Bạn đang nghĩ gì thế?"
          className="flex-1 bg-gray-100 p-3 rounded-full outline-none hover:bg-gray-200 transition"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
      </div>

      {imagePreview && (
        <div className="relative mb-3">
          <img
            src={imagePreview}
            alt="Preview"
            className="rounded-lg max-h-96 w-full object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex justify-between border-t pt-3 text-sm text-gray-600">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition cursor-pointer"
        >
          🖼️ <span>Ảnh/Video</span>
        </label>
        <div className="relative inline-block">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
          >
            😊 <span>Cảm xúc/Hoạt động</span>
          </button>
          {showPicker && (
            <div className="absolute top-full left-0 z-50 mt-2">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} locale="vi" />
            </div>
          )}
        </div>

        
      </div>

      <button
        onClick={handlePost}
        disabled={!postContent.trim() && !selectedImage || loading} // Thêm biến loading
        className={`mt-3 px-4 py-2 rounded-full transition ${
          (postContent.trim() || selectedImage) && !loading
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Đăng
      </button>

    </div>
  );
}
