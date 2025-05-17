import { useEffect, useState } from "react";
import { getCommentsByPost, createComment, getReplies, createReply } from "../../services/CommentService";
import { countReactions, getReactionCountsByType, getReactions, getReactionTypes } from "../../services/ReactionService";
import { addComment, controlReaction, getCommentByPost, getReactionByPostId, getReactionsByUserId } from "../../services/profileService";
import { FaComment, FaEllipsisH, FaFacebookMessenger, FaGlobe, FaShare, FaThumbsUp, FaTimes, FaUserCircle } from "react-icons/fa";
import SharePost from "./SharePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { getPostById } from "../../services/PostService";
import { useNavigate } from "react-router-dom";
import ReactionPopup from "./ReactionPopup";

export default function PostByShare({ posts, reactionByPost, reactionByUser, controlReactionUser, post, isOwnProfile, onShare, user, controlActiveStatusPost, users }) {
  const [reactionTypes, setReactionTypes] = useState([]);
  // const [reactionByPost, setReactionByPost] = useState([]);
  const [commentByPost, setCommentByPost] = useState([]);
  // const [reactionByUser, setReactionByUser] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [originalPost, setOriginalPost] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});
  const [reactionPopups, setReactionPopups] = useState({});
  const navigate = useNavigate();
  const userid = localStorage.getItem('userId');

  useEffect(() => {
    if (!post?.originalPostId) return;
    const getOriginalPost = async () => {
      try {
        setLoading(true);
        const postData = await getPostById(post.originalPostId);
        setOriginalPost(postData);
      } catch (err) {
        setError("Không thể tải dữ liệu");
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    getOriginalPost();
  }, [post?.originalPostId]);

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
        setCommentByPost(commentsWithReplies);

        // Lấy danh sách loại phản ứng
        const types = await getReactionTypes();
        setReactionTypes(types);

        // Lấy reactions
        // const userReactions = await getReactionsByUserId(userid);
        // setReactionByUser(userReactions);
        // const postReactions = await getReactionByPostId(post.id);
        // setReactionByPost(postReactions);

        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu");
        console.error("Failed to fetch data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [post.id, userid]);

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleMouseEnter = (id) => setActiveDropdown(id);
  const handleMouseLeave = () => setActiveDropdown(null);

  const getReactionByUserIdAndPost = (postId) => {
    const reaction = reactionByUser.find(e => e.targetId === postId && e.targetType === "POST");
    return reaction || {};
  };

  const getReactionByUserIdAndComment = (commentId) => {
    const reaction = reactionByUser.find(e => e.targetId === commentId && e.targetType === "COMMENT");
    return reaction || {};
  };

  const getReaction = (id) => {
    const reaction = reactionTypes.find(e => e.id === id);
    return reaction || {};
  };

    const handleSharePost = (userId, postId, caption) => {
      onShare(userId, post.originalPostId, caption);
      setShowShareModal(false);
    };

  // const controlReactionUser = async (userId, targetType, targetId, reactionType) => {
  //   try {
  //     await controlReaction(userId, targetType, targetId, reactionType);
  //     const userReactions = await getReactionsByUserId(userId);
  //     setReactionByUser(userReactions);
  //     if (targetType === "POST") {
  //       const postReactions = await getReactionByPostId(post.id);
  //       setReactionByPost(postReactions);
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi điều khiển phản ứng:", error);
  //   }
  // };

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
      setCommentByPost(commentsWithReplies);
      setReplyInputs(prev => ({ ...prev, [parentCommentId || postId]: "" }));
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

  const [activePost, setActivePost] = useState(null);
  const [activePostDropDown, setActivePostDropDown] = useState(false);

  const handleClickActivePost = (post) => {
    if (activePost === post) {
      setActivePostDropDown(!activePostDropDown);
    } else {
      setActivePost(post);
      setActivePostDropDown(true);
    }
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  const getUserById = (userId) => {
    const user = users.find(e => e.id === userId);
    return user || {};
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

  if (loading) return <div>Loading...</div>;
  console.log('reactionByPost in PostByShare: ', reactionByPost);

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-md p-4 rounded-md text-gray-700 mb-3 flex flex-col cursor-pointer">
        <div className="w-full h-10 flex items-center gap-2" onClick={() => navigate(`/profile/${post.userId.id}`)}>
          {post.userId?.profilePicture ? (
            <img src={post.userId.profilePicture} alt="avatar" className="rounded-full w-10 h-10 object-cover" />
          ) : (
            <FaUserCircle className="rounded-full w-10 h-10 object-cover text-gray-300" />
          )}
          <div>
            <div className="font-bold text-[15px]">{post.userId.firstName} {post.userId.lastName}</div>
            <div className="text-[13px] flex gap-1">{formatDateString(post.createdAt)} <FaGlobe className="-top-[-3px] relative" /></div>
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
        <div className="shadow rounded p-3">
          <div className="w-full h-10 flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/profile/${originalPost?.userId.id}`)}>
            {originalPost?.userId?.profilePicture ? (
              <img src={originalPost.userId.profilePicture} alt="avatar" className="rounded-full w-10 h-10 object-cover" />
            ) : (
              <FaUserCircle className="rounded-full w-10 h-10 object-cover text-gray-300" />
            )}
            <div>
              <div className="font-bold text-[15px]">{originalPost?.userId?.firstName} {originalPost?.userId?.lastName}</div>
              <div className="text-[13px] flex gap-1">{formatDateString(originalPost?.createdAt)} <FaGlobe className="-top-[-3px] relative" /></div>
            </div>
            <button className="ml-auto hover:bg-gray-200 p-2 rounded-full transition-all text-gray-300">
              <FaEllipsisH className="w-4 h-4" onClick={() => handleClickActivePost(originalPost)} />
            </button>
          </div>
          {originalPost?.content && <p className="mt-2">{originalPost.content}</p>}
          {originalPost?.imageUrl && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              <img src={originalPost.imageUrl} alt="Ảnh" className="w-full h-40 object-cover rounded-md" />
            </div>
          )}
        </div>
        <div className="flex justify-between items-center p-2">
          <div className="flex gap-1">
            <FaThumbsUp className="relative top-[3px]" />
            {reactionByPost.length || 0}
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              <FaFacebookMessenger className="relative top-[3px]" />
              {commentByPost.length || 0}
            </div>
            <div className="flex gap-1">
              <FaShare className="relative top-[3px]" />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-5 w-full">
          <div className="flex-1 flex flex-col gap-4 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
            <div className="btn-reaction flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all"
              onMouseEnter={() => handleMouseEnter(post.id)} onMouseLeave={handleMouseLeave}>
              {getReactionByUserIdAndPost(post.id).type ? (
                <div>{getReaction(getReactionByUserIdAndPost(post.id).type).emoji} {getReaction(getReactionByUserIdAndPost(post.id).type).label}</div>
              ) : (
                <div className="flex flex-row gap-2"><FaThumbsUp className="w-5 h-5" /> Thích</div>
              )}
            </div>
            {activeDropdown === post.id && (
              <div className="absolute bg-white border border-gray-300 rounded-full shadow-md mt-2 p-2 mt-[-100px]" id="emojiDropdown"
                onMouseEnter={() => handleMouseEnter(post.id)} onMouseLeave={handleMouseLeave}>
                <div className="flex space-x-2">
                  {reactionTypes.map(e => (
                    <span key={e.id} id={e.id} className="cursor-pointer p-2 rounded-full hover:bg-gray-200"
                      onClick={() => controlReactionUser(userid, 'POST', post.id, e.id)}>{e.emoji}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all" onClick={() => openModal(post)}>
            <FaComment className="w-5 h-5" /> Bình luận
          </button>
          <button onClick={() => setShowShareModal(true)} className="flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
            <FaShare className="w-5 h-5" /> Chia sẻ
          </button>
        </div>
      </div>
      {showShareModal && (
        <SharePost post={originalPost} onClose={() => setShowShareModal(false)} onShare={handleSharePost} currentUser={user} />
      )}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="fixed relative bg-white p-5 rounded-lg shadow-lg w-[800px] max-w-full relative flex flex-col max-h-[110vh] overflow-hidden">
            <div className="flex justify-between items-center border-b-2 border-gray-500 p-4">
              <h1 className="font-bold text-[25px] text-center flex-1">Bài viết của {user.firstName} {user.lastName}</h1>
              <button className="text-gray-600 hover:text-red-500" onClick={closeModal}>
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-2 flex-1 max-h-[500px]">
              {selectedPost.content && <p className="mt-2">{selectedPost.content}</p>}
              <div className="shadow rounded p-3">
                <div className="w-full h-10 flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/profile/${originalPost?.userId.id}`)}>
                  {originalPost?.userId?.profilePicture ? (
                    <img src={originalPost.userId.profilePicture} alt="avatar" className="rounded-full w-10 h-10 object-cover" />
                  ) : (
                    <FaUserCircle className="rounded-full w-10 h-10 object-cover text-gray-300" />
                  )}
                  <div>
                    <div className="font-bold text-[15px]">{originalPost?.userId?.firstName} {originalPost?.userId?.lastName}</div>
                    <div className="text-[13px] flex gap-1">{formatDateString(originalPost?.createdAt)} <FaGlobe className="-top-[-3px] relative" /></div>
                  </div>
                </div>
                {originalPost?.content && <p className="mt-2">{originalPost.content}</p>}
                {originalPost?.imageUrl && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <img src={originalPost.imageUrl} alt="Ảnh" className="w-full h-40 object-cover rounded-md" />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center p-2">
                <div className="flex gap-1">
                  <FaThumbsUp className="relative top-[3px]" />
                  {reactionByPost.length || 0}
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1">
                    <FaFacebookMessenger className="relative top-[3px]" />
                    {commentByPost.length || 0}
                  </div>
                  <div className="flex gap-1">
                    <FaShare className="relative top-[3px]" />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-5 w-full">
                <div className="flex-1 flex flex-col gap-4 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                  <div className="btn-reaction flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all"
                    onMouseEnter={() => handleMouseEnter(selectedPost.id)} onMouseLeave={handleMouseLeave}>
                    {getReactionByUserIdAndPost(post.id).type ? (
                      <div>{getReaction(getReactionByUserIdAndPost(post.id).type).emoji} {getReaction(getReactionByUserIdAndPost(post.id).type).label}</div>
                    ) : (
                      <div className="flex flex-row gap-2"><FaThumbsUp className="w-5 h-5" /> Thích</div>
                    )}
                  </div>
                  {activeDropdown === selectedPost.id && (
                    <div className="absolute bg-white border border-gray-300 rounded-full shadow-md mt-2 p-2 mt-[-100px]" id="emojiDropdown"
                      onMouseEnter={() => handleMouseEnter(selectedPost.id)} onMouseLeave={handleMouseLeave}>
                      <div className="flex space-x-2">
                        {reactionTypes.map(e => (
                          <span key={e.id} id={e.id} className="cursor-pointer p-2 rounded-full hover:bg-gray-200"
                            onClick={() => controlReactionUser(userid, 'POST', selectedPost.id, e.id)}>{e.emoji}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button className="flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                  <FaComment className="w-5 h-5" /> Bình luận
                </button>
                <button className="flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                  <FaShare className="w-5 h-5 rounded-md" /> Chia sẻ
                </button>
              </div>
              <div className="space-y-3 mt-4 pb-16">
                {commentByPost.length > 0 ? (
                  renderComments(commentByPost)
                ) : (
                  <p className="text-gray-500 italic text-center py-4">Chưa có bình luận nào.</p>
                )}
                <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-300">
                  <div className="flex items-center gap-3 max-w-4xl mx-auto">
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
                        value={replyInputs[post.id] || ""}
                        onChange={(e) => handleReplyInputChange(post.id, e.target.value)}
                        placeholder={`Bình luận dưới tên ${user.firstName} ${user.lastName}`}
                      />
                    </div>
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      onClick={() => {
                        if (replyInputs[post.id]?.trim()) {
                          addCommentByUser(userid, selectedPost.id, replyInputs[post.id]);
                          setReplyInputs(prev => ({ ...prev, [post.id]: "" }));
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}