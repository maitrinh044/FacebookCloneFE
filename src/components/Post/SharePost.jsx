import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function SharePost({ post, onClose, onShare, currentUser }) {
  const [sharedContent, setSharedContent] = useState("");

  const handleShare = () => {
    if (sharedContent.trim() || post.content) {
      onShare(sharedContent);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Chia sẻ bài viết</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <img
              src={currentUser.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <textarea
              placeholder="Viết gì đó về bài viết này..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows="3"
              value={sharedContent}
              onChange={(e) => setSharedContent(e.target.value)}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={post.userAvatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm">{post.username}</p>
                <p className="text-xs text-gray-500">{post.time}</p>
              </div>
            </div>
            <p className="text-gray-800 mb-2">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post content"
                className="rounded-lg w-full object-cover max-h-60"
              />
            )}
          </div>
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={handleShare}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Chia sẻ
          </button>
        </div>
      </div>
    </div>
  );
}