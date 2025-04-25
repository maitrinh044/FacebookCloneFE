import { useState, useEffect } from "react";
import { FaThumbsUp, FaRegCommentDots, FaShare } from "react-icons/fa";
import SharePost from "./SharePost";
import ReactionPopup from "./ReactionPopup";
import { getCommentsByPost, createComment } from "../../services/CommentService";
import { toggleReaction, countReactions, getReactionTypes, getReactions, getReactionCountsByType } from "../../services/ReactionService";

export default function PostItem({ post, onShare, currentUser }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [reactionCounts, setReactionCounts] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState(null);
    const [showReactionPopup, setShowReactionPopup] = useState(false);
    const [reactionTypes, setReactionTypes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const userId = currentUser?.id || 1; // Giả định userId từ currentUser, thay bằng logic auth thực tế

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Lấy bình luận
                const commentData = await getCommentsByPost(post.id);
                setComments(commentData);

                // Lấy số lượng phản ứng
                const count = await countReactions("post", post.id);
                setLikeCount(count);

                // Lấy phản ứng của người dùng hiện tại
                const userReaction = await getReactions("post", post.id, userId);
                setSelectedReaction(userReaction || null);
                setIsLiked(!!userReaction);

                // Lấy số lượng phản ứng theo loại
                const counts = await getReactionCountsByType("post", post.id);
                setReactionCounts(counts);

                // Lấy danh sách loại phản ứng
                const types = await getReactionTypes();
                setReactionTypes(types);

                setLoading(false);
            } catch (err) {
                setError("Không thể tải dữ liệu");
                console.error("Failed to fetch data:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, [post.id, userId]);

    const handleLike = async () => {
        const defaultReaction = reactionTypes.find(r => r.id === "LIKE") || { id: "LIKE", emoji: "👍", label: "Thích" };
        try {
            setError(null);
            const result = await toggleReaction({ targetType: "post", targetId: post.id, reactionType: "LIKE" }, userId);
            if (selectedReaction) {
                // Xóa phản ứng hiện tại
                setLikeCount(prev => prev - 1);
                setReactionCounts(prev => ({ ...prev, [selectedReaction.reactionType]: (prev[selectedReaction.reactionType] || 1) - 1 }));
                setSelectedReaction(null);
                setIsLiked(false);
            } else {
                // Thêm phản ứng LIKE
                setSelectedReaction(result);
                setLikeCount(prev => prev + 1);
                setReactionCounts(prev => ({ ...prev, LIKE: (prev.LIKE || 0) + 1 }));
                setIsLiked(true);
            }
        } catch (err) {
            setError("Không thể thực hiện phản ứng");
            console.error("Failed to toggle like:", err);
        }
    };

    const handleSelectReaction = async (reaction) => {
        try {
            setError(null);
            const result = await toggleReaction({ targetType: "post", targetId: post.id, reactionType: reaction.id }, userId);
            if (selectedReaction) {
                // Cập nhật từ phản ứng cũ sang phản ứng mới
                setReactionCounts(prev => ({
                    ...prev,
                    [selectedReaction.reactionType]: (prev[selectedReaction.reactionType] || 1) - 1,
                    [reaction.id]: (prev[reaction.id] || 0) + 1,
                }));
            } else {
                // Thêm phản ứng mới
                setLikeCount(prev => prev + 1);
                setReactionCounts(prev => ({ ...prev, [reaction.id]: (prev[reaction.id] || 0) + 1 }));
            }
            setSelectedReaction(result);
            setShowReactionPopup(false);
            setIsLiked(true);
        } catch (err) {
            setError("Không thể chọn phản ứng");
            console.error("Failed to toggle reaction:", err);
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                setError(null);
                const comment = {
                    postId: post.id,
                    content: newComment,
                    userId: userId,
                    time: new Date().toISOString(),
                };
                const createdComment = await createComment(comment);
                setComments([...comments, createdComment]);
                setNewComment("");
            } catch (err) {
                setError("Không thể thêm bình luận");
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

    // Hiển thị tóm tắt phản ứng
    const renderReactionSummary = () => {
        const activeReactions = Object.entries(reactionCounts)
            .filter(([_, count]) => count > 0)
            .map(([type, count]) => {
                const reaction = reactionTypes.find(r => r.id === type);
                return reaction ? `${reaction.emoji} ${count}` : null;
            })
            .filter(Boolean);
        return activeReactions.length > 0 ? activeReactions.join(" ") : null;
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-white rounded-xl shadow p-4 mb-4">
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div className="flex items-center gap-3 mb-2">
                <img
                    src={post.userAvatar || "https://via.placeholder.com/40"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <p className="font-semibold text-gray-800">{post.username}</p>
                    <p className="text-sm text-gray-500">{new Date(post.time).toLocaleString()}</p>
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
                    {renderReactionSummary()} ({likeCount} lượt thích)
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
                            <p className="text-xs text-gray-500">{new Date(comment.time).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center gap-2">
                <img
                    src={currentUser?.avatar || "https://via.placeholder.com/40"}
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
                    currentUser={currentUser}
                />
            )}
        </div>
    );
}