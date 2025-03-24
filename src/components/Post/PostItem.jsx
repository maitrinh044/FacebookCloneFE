// src/components/PostItem.jsx

import { useState } from "react";
import { FaThumbsUp, FaRegCommentDots, FaShare } from "react-icons/fa";
import SharePost from "./SharePost";
import ReactionPopup from "./ReactionPopup";

export default function PostItem({ post, onShare }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  const [selectedReaction, setSelectedReaction] = useState(null);
  const [showReactionPopup, setShowReactionPopup] = useState(false);

  const handleLike = () => {
    const defaultReaction = { id: "like", emoji: "👍", label: "Thích" };
    if (selectedReaction?.id === "like") {
      setSelectedReaction(null);
      setLikeCount((prev) => prev - 1);
    } else {
      setSelectedReaction(defaultReaction);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleSelectReaction = (reaction) => {
    if (!selectedReaction) setLikeCount((prev) => prev + 1);
    setSelectedReaction(reaction);
    setShowReactionPopup(false);
  };
  

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: "Người dùng",
        content: newComment,
        time: "Vừa xong",
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleSharePost = (sharedContent) => {
    const sharedPost = {
      ...post,
      id: Date.now(),
      sharedBy: "Người dùng hiện tại",
      sharedContent,
      sharedTime: "Vừa xong",
      isShared: true
    };
    onShare(sharedPost);
    setShowShareModal(false);
  };

  let reactionTimeout;
  const handleMouseEnter = () => {
    clearTimeout(reactionTimeout);
    setShowReactionPopup(true);
  };

  const handleMouseLeave = () => {
    reactionTimeout = setTimeout(() => setShowReactionPopup(false), 300);
  };


  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      {/* Header bài viết */}
      <div className="flex items-center gap-3 mb-2">
        <img src={post.userAvatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-gray-800">{post.username}</p>
          <p className="text-sm text-gray-500">{post.time}</p>
        </div>
      </div>

      {/* Nội dung bài viết */}
      <p className="text-gray-700 mb-2">{post.content}</p>
      {post.image && <img src={post.image} alt="post" className="rounded-lg max-h-96 w-full object-cover mt-2" />}

      {/* Hiển thị số like */}
      {likeCount > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          {likeCount} lượt thích
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-3 flex gap-6 text-gray-600 text-sm border-t pt-2">
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Nút Like */}
          <button
            className={`flex items-center gap-1 transition ${selectedReaction ? "text-blue-500 font-semibold" : ""}`}
            onClick={handleLike}
          >
            <span>{selectedReaction ? selectedReaction.emoji : <FaThumbsUp />}</span>
            {selectedReaction ? selectedReaction.label : "Thích"}
          </button>

          {/* Popup cảm xúc */}
          {showReactionPopup && (
            <div className="absolute bottom-full left-0 z-50">
              <ReactionPopup onSelect={handleSelectReaction} />
            </div>
          )}
        </div>



        <button className="flex items-center gap-1 hover:text-blue-600 transition">
          <FaRegCommentDots />
          Bình luận
        </button>

        <button 
          className="flex items-center gap-1 hover:text-blue-600 transition"
          onClick={() => setShowShareModal(true)}
        >
          <FaShare />
          Chia sẻ
        </button>
      </div>

      {/* Hiển thị danh sách bình luận */}
      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-center gap-2 mt-2">
            <img
              src="../../../src/assets/img/facebook.jpg"
              alt="avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">{comment.user}</p>
              <p className="text-sm text-gray-700">{comment.content}</p>
              <p className="text-xs text-gray-500">{comment.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form thêm bình luận */}
      <div className="mt-4 flex items-center gap-2">
        <img
          src="../../../src/assets/img/facebook.jpg"
          alt="avatar"
          className="w-6 h-6 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder="Viết bình luận..."
          className="flex-1 bg-gray-100 p-2 rounded-full outline-none"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddComment();
            }
          }}
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition"
        >
          Gửi
        </button>
      </div>

      {/* Modal chia sẻ bài viết */}
      {showShareModal && (
        <SharePost 
          post={post} 
          onClose={() => setShowShareModal(false)}
          onShare={handleSharePost}
          currentUser={{
            avatar: "../../../src/assets/img/facebook.jpg",      
            name: "Người dùng hiện tại"
          }}
        />
      )}
    </div>
  );
}