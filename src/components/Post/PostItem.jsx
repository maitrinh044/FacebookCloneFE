import { useState, useEffect } from "react";
import { FaThumbsUp, FaRegCommentDots, FaShare } from "react-icons/fa";
import SharePost from "./SharePost";
import ReactionPopup from "./ReactionPopup";
import { getCommentsByPost, createComment } from "../utils/CommentService";
import { toggleReaction, countReactions, getReactionTypes } from "../utils/ReactionService";

export default function PostItem({ post, onShare }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [showReactionPopup, setShowReactionPopup] = useState(false);
  const [reactionTypes, setReactionTypes] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getCommentsByPost(post.id);
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };

    const fetchReactions = async () => {
      try {
        const count = await countReactions("post", post.id);
        setLikeCount(count);
        // Assume API returns current user's reaction if exists
        const userReaction = await getReactions("post", post.id); // Adjust based on API response
        setSelectedReaction(userReaction || null);
        setIsLiked(!!userReaction);
      } catch (err) {
        console.error("Failed to fetch reactions:", err);
      }
    };

    const fetchReactionTypes = async () => {
      try {
        const types = await getReactionTypes();
        setReactionTypes(types);
      } catch (err) {
        console.error("Failed to fetch reaction types:", err);
      }
    };

    fetchComments();
    fetchReactions();
    fetchReactionTypes();
  }, [post.id]);

  const handleLike = async () => {
    const defaultReaction = reactionTypes.find(r => r.id === "like") || { id: "like", emoji: "👍", label: "Thích" };
    try {
      if (selectedReaction?.id === "like") {
        await toggleReaction({ targetType: "post", targetId: post.id, reactionType: "like" });
        setSelectedReaction(null);
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
      } else {
        await toggleReaction({ targetType: "post", targetId: post.id, reactionType: "like" });
        setSelectedReaction(defaultReaction);
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleSelectReaction = async (reaction) => {
    try {
      await toggleReaction({ targetType: "post", targetId: post.id, reactionType: reaction.id });
      if (!selectedReaction) setLikeCount((prev) => prev + 1);
      setSelectedReaction(reaction);
      setShowReactionPopup(false);
      setIsLiked(true);
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const comment = {
          postId: post.id,
          user: "Người dùng",
          content: newComment,
          time: new Date().toISOString(),
        };
        const createdComment = await createComment(comment);
        setComments([...comments, createdComment]);
        setNewComment("");
      } catch (err) {
        console.error("Failed to add comment:", err);
      }
    }
  };

  const handleSharePost = (sharedPost) => {
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
      <div className="flex items-center gap-3 mb-2">
        <img
          src={post.userAvatar || "https://via.placeholder.com/40"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">{post.username}</p>
          <p className="text-sm text-gray-500">{post.time}</p>
        </div>
      </div>

      <p className="text-gray-700 mb-2">{post.content}</p>
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="rounded-lg max-h-96 w-full object-cover mt-2"
        />
      )}

      {likeCount > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          {likeCount} lượt thích
        </div>
      )}

      <div className="mt-3 flex gap-6 text-gray-600 text-sm border-t pt-2">
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`flex items-center gap-1 transition ${
              selectedReaction ? "text-blue-500 font-semibold" : ""
            }`}
            onClick={handleLike}
          >
            <span>{selectedReaction ? selectedReaction.emoji : <FaThumbsUp />}</span>
            {selectedReaction ? selectedReaction.label : "Thích"}
          </button>

          {showReactionPopup && (
            <div className="absolute bottom-full left-0 z-50">
              <ReactionPopup onSelect={handleSelectReaction} reactions={reactionTypes} />
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

      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-center gap-2 mt-2">
            <img
              src={comment.userAvatar || "https://via.placeholder.com/40"}
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

      <div className="mt-4 flex items-center gap-2">
        <img
          src="https://via.placeholder.com/40"
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

      {showShareModal && (
        <SharePost
          post={post}
          onClose={() => setShowShareModal(false)}
          onShare={handleSharePost}
          currentUser={{
            avatar: "https://via.placeholder.com/40",
            name: "Người dùng hiện tại",
          }}
        />
      )}
    </div>
  );
}