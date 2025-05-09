
import { caption } from "framer-motion/client";
import PropTypes from "prop-types";
import { useState } from "react";

export default function SharePost({ post, onClose, onShare, currentUser }) {
    const [caption, setCaption] = useState('');
    const userid = localStorage.getItem("userId");
    const handleShare = () => {
        // const sharedPost = {
        //     ...post,
        //     sharedBy: currentUser.name,
        //     sharedAt: new Date().toISOString(),
        // };
        // onShare(sharedPost);
        onShare(userid, post.id, caption);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-96">
                <h2 className="text-lg font-semibold mb-4">Chia sẻ bài viết</h2>
                <input onChange={(e) => setCaption(e.target.value)} value={caption} name="caption"></input>
                <p className="mb-4">{post.content}</p>
                {post.imageUrl!=null&&(
                    <div className="grid grid-cols-3 gap-2 mt-2">
                    <img key={imgIndex} src={post.imageUrl} alt={`Ảnh`} className="w-full h-40 object-cover rounded-md" />
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleShare}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
        avatar: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
};
