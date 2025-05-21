import PropTypes from "prop-types";
import { useState } from "react";

export default function SharePost({ post, onClose, onShare, currentUser }) {
    const [caption, setCaption] = useState('');
    const userid = localStorage.getItem("userId");

    const handleShare = () => {
        onShare(userid, post.id, caption);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg flex flex-col">
                <h2 className="text-lg font-semibold mb-4">Chia sẻ bài viết</h2>
                <input
                    className="w-full shadow border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setCaption(e.target.value)}
                    value={caption}
                    name="caption"
                    placeholder="Bạn nghĩ gì về bài viết này..."
                />
                <p className="mb-2 text-gray-700">{post.content}</p>
                {post.imageUrl && (
                    <div className="mb-4">
                        <img
                            src={post.imageUrl}
                            alt="Ảnh"
                            className="w-full h-auto object-cover rounded-md"
                        />
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleShare}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Chia sẻ
                    </button>
                </div>
            </div>
        </div>
    );
}

SharePost.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
        avatar: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
};