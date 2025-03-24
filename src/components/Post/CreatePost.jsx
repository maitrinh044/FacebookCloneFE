import { useState, useRef } from "react";

export default function CreatePost({ onPostCreated }) {
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

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

  const handlePost = () => {
    if (postContent.trim() || selectedImage) {
      const newPost = {
        id: Date.now(),
        username: "Người dùng",
        userAvatar: "https://via.placeholder.com/40",
        time: "Vừa xong",
        content: postContent,
        image: imagePreview || "",
      };
      onPostCreated(newPost);
      setPostContent("");
      setSelectedImage(null);
      setImagePreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <img
          src="https://via.placeholder.com/40"
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

      {/* Hiển thị xem trước hình ảnh */}
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
        <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition">
          😊 <span>Cảm xúc/Hoạt động</span>
        </button>
      </div>

      <button
        onClick={handlePost}
        disabled={!postContent.trim() && !selectedImage}
        className={`mt-3 px-4 py-2 rounded-full transition ${
          postContent.trim() || selectedImage
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Đăng
      </button>
    </div>
  );
}