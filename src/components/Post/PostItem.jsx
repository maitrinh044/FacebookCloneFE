import { useState, useEffect } from "react";
import { FaThumbsUp, FaRegCommentDots, FaShare, FaUserCircle, FaEllipsisH, FaGlobe, FaFacebookMessenger, FaComment, FaTimes, FaFonticons } from "react-icons/fa";
import SharePost from "./SharePost";
import { getCommentsByPost, createComment, getReplies, createReply } from "../../services/CommentService";
import { toggleReaction, countReactions, getReactionTypes, getReactions, getReactionCountsByType } from "../../services/ReactionService";
import { addComment, controlReaction, getCommentByPost, getReactionByPostId, getReactionsByUserId, getTop3Reaction } from "../../services/profileService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIcons, faPaperPlane, faSmile } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ReactionPopup from "./ReactionPopup";
import { toast } from "react-toastify";
import React from 'react';

import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data'; 
import { getCountSharePost } from "../../services/PostService";
export default function PostItem({ post,reactionByPost, reactionByUser, controlReactionUser, isOwnProfile, onShare, user, controlActiveStatusPost, users }) {
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
  const [selectedPost, setSelectedPost] = useState(null);
  const [countShare, setCountShare] = useState(0);
  // const [reactionByPost, setReactionByPost] = useState([]);
  const [commentByPost, setCommentByPost] = useState([]);
  // const [reactionByUser, setReactionByUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [replyInputs, setReplyInputs] = useState({}); // State để quản lý input reply
  const [reactionPopups, setReactionPopups] = useState({}); // State để quản lý popup reaction
  const userid = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [top3Reaction, setTop3Reaction] = useState([]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isModalOpen) {
        if (!event.target.closest(".dropdown-container") && !event.target.closest(".toggle-dropdown")) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isModalOpen]);

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const userIdCurrent = localStorage.getItem('userId');
  const userId = user?.id || 1; // Giả định userId từ currentUser, thay bằng logic auth thực tế
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy bình luận và replies
        const commentData = await getCommentsByPost(post.id);
        const commentsWithReplies = await Promise.all(
          commentData.map(async (comment) => {
            const replies = await getReplies(comment.id);
            return { ...comment, replies };
          })
        );
        setComments(commentsWithReplies);
        setCommentByPost(commentsWithReplies);

        const data = await getTop3Reaction('POST', post.id);
        // setTop3Reaction(data);
        if (Array.isArray(data)) {
            setTop3Reaction(data);
        } else {
            setTop3Reaction([]); // Hoặc thiết lập giá trị mặc định khác
        }
        // Lấy số lượng phản ứng
        // const count = await countReactions("POST", post.id);
        // setLikeCount(count);

        // Lấy phản ứng của người dùng hiện tại
        // const userReaction = await getReactions("POST", post.id, userId);
        // setSelectedReaction(userReaction || null);
        // setIsLiked(!!userReaction);

        // Lấy số lượng phản ứng theo loại
        const counts = await getReactionCountsByType("POST", post.id);
        setReactionCounts(counts);

        // Lấy danh sách loại phản ứng
        const types = await getReactionTypes();
        setReactionTypes(types);

        const data2 = await getCountSharePost(post.id);
        setCountShare(data2);

        const tmp3 = await getCommentByPost(post.id);
        setCommentByPost(tmp3);

        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu");
        console.error("Failed to fetch data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [post.id, userId]);

  // console.log('top3Reaction in ' + post.id, top3Reaction);
  // console.log('countShare of postId = ' + post.id, countShare.count)

  function getReactionByUserIdAndPost(postid) {
    const reaction = reactionByUser.find(e => e.targetId === postid && e.targetType === "POST");
    return reaction || [];
  }

  function getReactionByUserIdAndComment(commentId) {
    const reaction = reactionByUser.find(e => e.targetId === commentId && e.targetType === "COMMENT");
    return reaction || [];
  }

  function getReaction(id) {
    const reaction = reactionTypes.find(e => e.id === id);
    return reaction || [];
  }

  const handleLike = async () => {
    const defaultReaction = reactionTypes.find(r => r.id === "LIKE") || { id: "LIKE", emoji: "👍", label: "Thích" };
    try {
      setError(null);
      const result = await toggleReaction({ targetType: "POST", targetId: post.id, reactionType: "LIKE" }, userId);
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
      const result = await toggleReaction({ targetType: "POST", targetId: post.id, reactionType: reaction.id }, userId);
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

  const handleSharePost = (userId, postId, caption) => {
    onShare(userId, postId, caption);
    setShowShareModal(false);
  };

  const [activeDropdown, setActiveDropdown] = useState(null);
  const handleMouseEnter = (postId) => {
    setActiveDropdown(postId);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

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

  function getUserById(userId) {
    const user = users.find(e => e.id === userId);
    return user || [];
  }

  const addCommentByUser = async (userId, postId, content, parentCommentId = null) => {
    try {
      const commentData = {
        userId: parseInt(userId),
        postId,
        content,
        activeStatus: "ACTIVE",
        parentCommentId
      };
      const response = parentCommentId ? await createReply(commentData) : await addComment(userId, postId, content);
      const updatedComments = await getCommentsByPost(postId);
      const commentsWithReplies = await Promise.all(
        updatedComments.map(async (comment) => {
          const replies = await getReplies(comment.id);
          return { ...comment, replies };
        })
      );
      setComments(commentsWithReplies);
      setCommentByPost(commentsWithReplies);
      setReplyInputs(prev => ({ ...prev, [parentCommentId || postId]: "" }));
      setShowPicker(false);
      setShowPickerReply(false);
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
    }
  };

  const handleReplyInputChange = (commentId, value) => {
    setReplyInputs(prev => ({ ...prev, [commentId]: value }));
  };

  const toggleReactionPopup = (commentId) => {
    setReactionPopups(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const [commentContent, setCommentContent] = useState("");
  const [activePost, setActivePost] = useState(null);
  const [activePostDropDown, setActivePostDropDown] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showPickerReply, setShowPickerReply] = useState(false);
  
  const handleEmojiSelect = (emoji) => {
    setCommentContent((prev) => prev + emoji.native);
  };
  const handleEmojiSelectReply = (cmtId, emoji) => {
    setReplyInputs(prev => ({ ...prev, [cmtId]: (prev[cmtId] || "") + emoji.native })); // Thêm emoji vào nội dung bình luận
  };

  const handleClickActivePost = (post) => {
    if (activePost === post) {
      setActivePostDropDown(!activePostDropDown);
    } else {
      setActivePost(post);
      setActivePostDropDown(true);
    }
  };

  function formatDateString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }
  const reactionMap = {
      LIKE: { emoji: "👍", label: "Thích" },
      LOVE: { emoji: "❤️", label: "Yêu thích" },
      HAHA: { emoji: "😆", label: "Haha" },
      WOW: { emoji: "😮", label: "Wow" },
      SAD: { emoji: "😢", label: "Buồn" },
      ANGRY: { emoji: "😡", label: "Phẫn nộ" },
  };
  const renderComments = (comments, level = 0) => {
    return comments.map((cmt, cmtIndex) => (
      <div key={cmtIndex} className={`flex gap-3 p-2 hover:bg-gray-50 rounded-lg ${level > 0 ? 'ml-8' : ''}`}>
        <div className="w-10 h-10 flex-shrink-0">
          {cmt.userId?.profilePicture ? (
            <img src={cmt.userId.profilePicture} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <FaUserCircle className="w-10 h-10 text-gray-300" />
          )}
        </div>
        <div className="flex-1">
          <div className="bg-gray-100 rounded-2xl px-4 py-2">
            <p className="font-semibold text-gray-800 text-sm">{cmt.userId?.firstName} {cmt.userId?.lastName}</p>
            <p className="text-gray-700 text-sm">{cmt.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-1 px-2">
            <span
              className="text-xs text-gray-500 hover:underline cursor-pointer"
              onMouseEnter={() => toggleReactionPopup(cmt.id)}
              onMouseLeave={() => toggleReactionPopup(cmt.id)}
            >
              {getReactionByUserIdAndComment(cmt.id).type ? (
                <span>{getReaction(getReactionByUserIdAndComment(cmt.id).type).emoji} {getReaction(getReactionByUserIdAndComment(cmt.id).type).label}</span>
              ) : (
                "Thích"
              )}
            </span>
            {reactionPopups[cmt.id] && (
              <div className="absolute z-10 mt-6">
                <ReactionPopup
                  reactions={reactionTypes}
                  onSelect={(reaction) => controlReactionUser(userid, 'COMMENT', cmt.id, reaction.id)}
                />
              </div>
            )}
            <span
              className="text-xs text-gray-500 hover:underline cursor-pointer"
              onClick={() => setReplyInputs(prev => ({ ...prev, [cmt.id]: prev[cmt.id] || "" }))}
            >
              Phản hồi
            </span>
            <span className="text-xs text-gray-500">{formatDateString(cmt.createdAt)}</span>
          </div>
          {replyInputs[cmt.id] !== undefined && (
            <div className="flex items-center gap-3 mt-2">
              <div className="w-8 h-8 flex-shrink-0">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <input
                className="flex-1 p-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={replyInputs[cmt.id] || ""}
                onChange={(e) => handleReplyInputChange(cmt.id, e.target.value)}
                placeholder="Viết phản hồi..."
              />
              <div className="relative">
                  <button
                    onClick={() => setShowPickerReply(!showPickerReply)}
                    className="p-2 text-yellow-300 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <FontAwesomeIcon icon={faSmile} className="w-5 h-5" />
                  </button>
                  {showPickerReply && (
                    <div className="absolute z-50" style={{ bottom: '100%', right: '0' }}>
                      <Picker data={data} onEmojiSelect={(emoji) => handleEmojiSelectReply(cmt.id, emoji)}  locale="vi" />
                    </div>
                  )}
                </div>
              <button
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                onClick={() => {
                  if (replyInputs[cmt.id]?.trim()) {
                    addCommentByUser(userid, post.id, replyInputs[cmt.id], cmt.id);
                  }
                }}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
              </button>
            </div>
          )}
          {cmt.replies?.length > 0 && (
            <div className="mt-2">
              {renderComments(cmt.replies, level + 1)}
            </div>
          )}
        </div>
      </div>
    ));
  };
  // console.log('reactionByCurrentUser in PostItem: ', reactionByUser);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-md p-4 rounded-md text-gray-700 mb-3 flex flex-col">
        <div
          className="w-full h-10 flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (!post?.userId?.id) return;
            navigate(`/profile/${post.userId.id}`);
          }}
        >
        <div  className="w-full h-10 flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/profile/${originalPost?.userId.id}`)}>
          {post.userId.profilePicture != null ? (
            <img src={post.userId.profilePicture} alt="avatar" className="rounded-full w-10 h-10 object-cover cursor-pointer" />
          ) : (
            <FaUserCircle className="rounded-full w-10 h-10 object-cover text-gray-300" />
          )}
          <div>
            <div className="font-bold text-[15px] cursor-pointer">{post.userId.firstName + " " + post.userId.lastName}</div>
            <div className="text-[13px] flex gap-1">{formatDateString(post.createdAt)} <FaGlobe className="-top-[-3px] relative" /></div>
          </div>
        </div>
          
          <button className="ml-auto hover:bg-gray-200 p-2 rounded-full transition-all text-gray-300">
            <FaEllipsisH className="w-4 h-4" onClick={() => handleClickActivePost(post)} />
          </button>
          {activePostDropDown && activePost === post && (
            <div className="absolute bg-white border border-gray-300 rounded-lg shadow-md p-2 ml-[570px] mt-[100px] h-[115px] w-[240px]">
              {isOwnProfile && (
                <div className="flex flex-col gap-2">
                  <button className="hover:bg-gray-100 hover:text-blue-600 font-semibold p-1 rounded w-full">Chỉnh sửa bài viết</button>
                  <button className="hover:bg-gray-100 hover:text-blue-600 font-semibold p-1 rounded w-full" onClick={() => controlActiveStatusPost(user.id, post.id)}>Chuyển bài viết vào thùng rác</button>
                </div>
              )}
            </div>
          )}
        </div>
        {post.content && <p className="mt-2">{post.content}</p>}
        {post.imageUrl != null && (
          <div className="flex justify-center gap-2 mt-2 h-full w-full">
            <img src={post.imageUrl} alt="Ảnh" className="w-full h-full object-cover rounded-md" />
          </div>
        )}
        <div className="flex justify-between items-center p-2">
          <div className="flex gap-1">
            {/* <FaThumbsUp className="relative top-[3px]" /> */}
            <div className="flex items-center bg-white rounded-xl">
              {top3Reaction.length === 0 ? (  // Sửa điều kiện kiểm tra
                  <div className="flex items-center">
                      {reactionMap['LIKE'].emoji}
                  </div>
              ) : (
                  <div className="flex items-center bg-white rounded-xl">
                      {top3Reaction.map(e => (
                          <div className="rounded-full border-3 border-white object-cover -ml-2 text-gray-400" key={e.reactionType}>
                              {reactionMap[e.reactionType] ? (
                                  <span>
                                      {reactionMap[e.reactionType].emoji}
                                  </span>
                              ) : (
                                  <span>Không xác định</span>
                              )}
                          </div>
                      ))}
                  </div>
              )}
              
            </div>
            {reactionByPost.length || 0}
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              <FaFacebookMessenger className="relative top-[3px] text-gray-300" />
              {commentByPost.length || 0}
            </div>
            <div className="flex gap-1">
              
              <FaShare className="relative top-[3px] text-gray-300" />
              {countShare.count || 0}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-5 w-full">
          <div className="flex-1 flex flex-col gap-4 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all cursor-pointer">
            <div className="btn-reaction flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all"
              onMouseEnter={() => handleMouseEnter(post.id)}
              onMouseLeave={handleMouseLeave}>
              {getReactionByUserIdAndPost(post.id).type ? (
                <div>
                  {getReaction(getReactionByUserIdAndPost(post.id).type).emoji}{" "}
                  {getReaction(getReactionByUserIdAndPost(post.id).type).label}
                </div>
              ) : (
                <div className="flex flex-row gap-2">
                  <FaThumbsUp className="w-5 h-5 text-gray-300" /> Thích
                </div>
              )}
            </div>
            {activeDropdown === post.id && (
              <div className="absolute bg-white border border-gray-300 rounded-full shadow-md mt-2 p-2 mt-[-90px]"
                onMouseEnter={() => handleMouseEnter(post.id)}
                onMouseLeave={handleMouseLeave}>
                <div className="flex space-x-2">
                  {reactionTypes.map(e => (
                    <span key={e.id}
                      id={e.id}
                      className="cursor-pointer p-2 rounded-full hover:bg-gray-200 hover:scale-125 transition-transform duration-200"
                      onClick={() => controlReactionUser(userIdCurrent, 'POST', post.id, e.id)}>{e.emoji}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all" onClick={() => openModal(post)}>
            <FaComment className="w-5 h-5 text-gray-300" /> Bình luận
          </button>
          <button onClick={() => setShowShareModal(true)} className="flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
            <FaShare className="w-5 h-5 text-gray-300" /> Chia sẻ
          </button>
        </div>
      </div>
      {showShareModal && (
        <SharePost
          post={post}
          onClose={() => setShowShareModal(false)}
          onShare={handleSharePost}
          currentUser={user}
        />
      )}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-5 rounded-lg shadow-lg w-[800px] max-w-full flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b-2 border-gray-500 p-4">
              <h1 className="font-bold text-[25px] text-center flex-1">Bài viết của {user.firstName + " " + user.lastName}</h1>
              <button className="text-gray-600 hover:text-red-500" onClick={closeModal}>
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung có scroll */}
            <div className="flex-1 overflow-y-auto p-2">
              {/* Nội dung post: văn bản, ảnh, like, share... */}
              {selectedPost.content && <p className="mt-2">{selectedPost.content}</p>}
              {selectedPost.imageUrl && (
                <img src={selectedPost.imageUrl} alt="Ảnh" className="w-full h-full object-cover rounded-md" />
              )}

              {/* Reactions, Comments... */}
              {/* ... */}
              <div className="flex justify-between items-center p-2">
                <div className="flex gap-1">
                  <FaThumbsUp className="relative top-[3px] text-gray-300" />
                  {reactionByPost.length || 0}
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1">
                    <FaFacebookMessenger className="relative top-[3px] text-gray-300" />
                    {commentByPost.length || 0}
                  </div>
                  <div className="flex gap-1">
                    <FaShare className="relative top-[3px] text-gray-300" />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-5 w-full">
                <div className="flex-1 flex flex-col gap-4 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                  <div className="btn-reaction flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all"
                    onMouseEnter={() => handleMouseEnter(selectedPost.id)}
                    onMouseLeave={handleMouseLeave}>
                    {getReactionByUserIdAndPost(post.id).type ? (
                      <div>
                        {getReaction(getReactionByUserIdAndPost(post.id).type).emoji}{" "}
                        {getReaction(getReactionByUserIdAndPost(post.id).type).label}
                      </div>
                    ) : (
                      <div className="flex flex-row gap-2">
                        <FaThumbsUp className="w-5 h-5 text-gray-300" /> Thích
                      </div>
                    )}
                  </div>
                  {activeDropdown === selectedPost.id && (
                    <div className="absolute bg-white border border-gray-300 rounded-full shadow-md mt-2 p-2 mt-[-100px]"
                      onMouseEnter={() => handleMouseEnter(selectedPost.id)}
                      onMouseLeave={handleMouseLeave}>
                      <div className="flex space-x-2">
                        {reactionTypes.map(e => (
                          <span key={e.id}
                            id={e.id}
                            className="cursor-pointer p-2 rounded-full hover:bg-gray-200 hover:scale-125 transition-transform duration-200"
                            onClick={() => controlReactionUser(userIdCurrent, 'POST', selectedPost.id, e.id)}
                          >{e.emoji}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button className="flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                  <FaComment className="w-5 h-5 text-gray-300" /> Bình luận
                </button>
                <button className="flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                  <FaShare className="w-5 h-5 rounded-md text-gray-300" /> Chia sẻ
                </button>
              </div>

              {/* Comment list */}
              <div className="space-y-3 mt-4 pb-10">
                {commentByPost.length > 0 ? (
                  renderComments(commentByPost)
                ) : (
                  <p className="text-gray-500 italic text-center py-4">Chưa có bình luận nào.</p>
                )}
              </div>
            </div>

            {/* 🔽 Thanh nhập bình luận luôn dính đáy modal */}
            <div className="border-t border-gray-300 p-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex-shrink-0">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    className="w-full p-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder={`Bình luận dưới tên ${user.firstName} ${user.lastName}`}
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowPicker(!showPicker)}
                    className="p-2 text-yellow-300 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <FontAwesomeIcon icon={faSmile} className="w-5 h-5" />
                  </button>
                  {showPicker && (
                    <div className="absolute z-50" style={{ bottom: '100%', right: '0' }}>
                      <Picker data={data} onEmojiSelect={handleEmojiSelect} locale="vi" />
                    </div>
                  )}
                </div>
                <button
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  onClick={() => {
                    if (commentContent.trim()) {
                      addCommentByUser(userid, selectedPost.id, commentContent);
                      setCommentContent("");
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}