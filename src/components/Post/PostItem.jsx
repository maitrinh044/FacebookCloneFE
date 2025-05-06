import { useState, useEffect } from "react";
import { FaThumbsUp, FaRegCommentDots, FaShare, FaUserCircle, FaEllipsisH, FaGlobe, FaFacebookMessenger, FaComment, FaTimes } from "react-icons/fa";
import SharePost from "./SharePost";
import ReactionPopup from "./ReactionPopup";
import { getCommentsByPost, createComment } from "../../services/CommentService";
import { toggleReaction, countReactions, getReactionTypes, getReactions, getReactionCountsByType } from "../../services/ReactionService";
import { addComment, controlReaction, getCommentByPost, getReactionByPostId, getReactionsByUserId } from "../../services/profileService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { func } from "prop-types";

export default function PostItem({ post, onShare, user, controlActiveStatusPost,users }) {
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


    const [reactionByPost, setReactionByPost] = useState([]);
    const [commentByPost, setCommentByPost] = useState([]);
    const [reactionByUser, setReactionByUser] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

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

    const userId = user?.id || 1; // Giả định userId từ currentUser, thay bằng logic auth thực tế

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

                /////////
                const tmp1 = await getReactionsByUserId(user.id); // Lấy người dùng bằng ID
                setReactionByUser(tmp1);

                const tmp2 = await getReactionByPostId(post.id);
                setReactionByPost(tmp2);

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
    function getReactionByUserIdAndPost(postid) {
        const reaction = reactionByUser.find(e=>e.targetId === postid);
        return reaction || [];
    }
    function getReaction(id) {
        const reaction = reactionTypes.find(e=>e.id === id);
        return reaction || [];
    }

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

    // let reactionTimeout;
    // const handleMouseEnter = () => {
    //     clearTimeout(reactionTimeout);
    //     setShowReactionPopup(true);
    // };

    // const handleMouseLeave = () => {
    //     reactionTimeout = setTimeout(() => setShowReactionPopup(false), 300);
    // };

    const [activeDropdown, setActiveDropdown] = useState(null);
    const handleMouseEnter = (postId) => {
        setActiveDropdown(postId);
    };

    const handleMouseLeave = () => {
        setActiveDropdown(null);
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

    ///////////////////////////////////////

    function getUserById(userId) {
    const user = users.find(e => e.id === userId);
    return user || [];
    }



    const controlReactionUser = async (userId, targetType, targetId, reactionType) => {
        try {
            const newReaction = await controlReaction(userId, targetType, targetId, reactionType);
            
            const data = await getReactionsByUserId(userId); // Lấy người dùng bằng ID
            setReactionByUser(data);
            const tmp2 = await getReactionByPostId(post.id);
            setReactionByPost(tmp2);
        } catch (error) {
            const data = await getReactionsByUserId(userId); // Lấy người dùng bằng ID
            setReactionByUser(data);
            console.error("Lỗi khi điều khiển phản ứng:", error);
        }
    };

    const addCommentByUser = async (userId, postId, content) => {
        try {
            // Gọi API để thêm bình luận
            const response = await addComment(userId, postId, content); 
            // Cập nhật danh sách bình luận nếu cần

            const updatedComments = await getCommentByPost(postId); // Lấy lại bình luận
            setCommentByPost(updatedComments);
        } catch (error) {
            console.error("Lỗi khi thêm bình luận:", error);
        }
    };

    const [commentContent, setCommentContent] = useState("");
  const [activePost, setActivePost] = useState(null);
  const [activePostDropDown, setActivePostDropDown] = useState(false);

  const handleClickActivePost = (post) => {
    // Kiểm tra xem bài viết đang hoạt động có phải là bài viết vừa nhấn không
    if (activePost === post) {
        setActivePostDropDown(!activePostDropDown); // Đổi trạng thái dropdown
    } else {
        setActivePost(post); // Cập nhật bài viết đang hoạt động
        setActivePostDropDown(true); // Mở dropdown
    }
};
    function formatDateString(dateString) {
        const date = new Date(dateString);
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }

    if (loading) return <div>Loading...</div>;

    return (
        // <div className="bg-white rounded-xl shadow p-4 mb-4">
        //     {error && <div className="text-red-500 mb-2">{error}</div>}
        //     <div className="flex items-center gap-3 mb-2">
        //         <img
        //             src={post.userAvatar || "https://via.placeholder.com/40"}
        //             alt="avatar"
        //             className="w-10 h-10 rounded-full object-cover"
        //         />
        //         <div>
        //             <p className="font-semibold text-gray-800">{post.username}</p>
        //             <p className="text-sm text-gray-500">{new Date(post.time).toLocaleString()}</p>
        //         </div>
        //     </div>

        //     <p className="text-gray-700 mb-2">{post.content}</p>
        //     {post.image && (
        //         <img
        //             src={post.image}
        //             alt="post"
        //             className="rounded-lg max-h-96 w-full object-cover mt-2"
        //         />
        //     )}

        //     {likeCount > 0 && (
        //         <div className="mt-2 text-sm text-gray-600">
        //             {renderReactionSummary()} ({likeCount} lượt thích)
        //         </div>
        //     )}

        //     <div className="mt-3 flex gap-6 text-gray-600 text-sm border-t pt-2">
        //         <div
        //             className="relative"
        //             onMouseEnter={handleMouseEnter}
        //             onMouseLeave={handleMouseLeave}
        //         >
        //             <button
        //                 className={`flex items-center gap-1 transition ${
        //                     selectedReaction ? "text-blue-500 font-semibold" : ""
        //                 }`}
        //                 onClick={handleLike}
        //             >
        //                 <span>{selectedReaction ? selectedReaction.emoji : <FaThumbsUp />}</span>
        //                 {selectedReaction ? selectedReaction.label : "Thích"}
        //             </button>

        //             {showReactionPopup && (
        //                 <div className="absolute bottom-full left-0 z-50">
        //                     <ReactionPopup onSelect={handleSelectReaction} reactions={reactionTypes} />
        //                 </div>
        //             )}
        //         </div>

        //         <button className="flex items-center gap-1 hover:text-blue-600 transition">
        //             <FaRegCommentDots />
        //             Bình luận
        //         </button>

        //         <button
        //             className="flex items-center gap-1 hover:text-blue-600 transition"
        //             onClick={() => setShowShareModal(true)}
        //         >
        //             <FaShare />
        //             Chia sẻ
        //         </button>
        //     </div>

        //     <div className="mt-4">
        //         {comments.map((comment) => (
        //             <div key={comment.id} className="flex items-center gap-2 mt-2">
        //                 <img
        //                     src={comment.userAvatar || "https://via.placeholder.com/40"}
        //                     alt="avatar"
        //                     className="w-6 h-6 rounded-full object-cover"
        //                 />
        //                 <div>
        //                     <p className="text-sm font-semibold text-gray-800">{comment.user}</p>
        //                     <p className="text-sm text-gray-700">{comment.content}</p>
        //                     <p className="text-xs text-gray-500">{new Date(comment.time).toLocaleString()}</p>
        //                 </div>
        //             </div>
        //         ))}
        //     </div>

        //     <div className="mt-4 flex items-center gap-2">
        //         <img
        //             src={currentUser?.avatar || "https://via.placeholder.com/40"}
        //             alt="avatar"
        //             className="w-6 h-6 rounded-full object-cover"
        //         />
        //         <input
        //             type="text"
        //             placeholder="Viết bình luận..."
        //             className="flex-1 bg-gray-100 p-2 rounded-full outline-none"
        //             value={newComment}
        //             onChange={(e) => setNewComment(e.target.value)}
        //             onKeyPress={(e) => {
        //                 if (e.key === "Enter") {
        //                     handleAddComment();
        //                 }
        //             }}
        //         />
        //         <button
        //             onClick={handleAddComment}
        //             className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition"
        //         >
        //             Gửi
        //         </button>
        //     </div>

        //     {showShareModal && (
        //         <SharePost
        //             post={post}
        //             onClose={() => setShowShareModal(false)}
        //             onShare={handleSharePost}
        //             currentUser={currentUser}
        //         />
        //     )}
        // </div>

        <div className="space-y-4">
                      <div  className="bg-white shadow-md p-4 rounded-md text-gray-700 mb-3 flex flex-col">
                        {/* Header */}
                        <div className="w-full h-10 flex items-center gap-2">
                          {user.profilePicture!=null?(
                            <img src={user.profilePicture} alt="avatar" className="rounded-full w-10 h-10 object-cover" />
                          ):(
                            <FaUserCircle className="rounded-full w-10 h-10 object-cover text-gray-300"/>
                          )}
                          <div>
                            <div className="font-bold text-[15px]">{user.firstName + " " + user.lastName}</div>
                            <div className="text-[13px] flex gap-1">{formatDateString(post.createdAt)} <FaGlobe className="-top-[-3px] relative"/></div>
                          </div>
                          <button className="ml-auto hover:bg-gray-200 p-2 rounded-full transition-all text-gray-300">
                            <FaEllipsisH className="w-4 h-4" onClick={() => handleClickActivePost(post)}/>
                          </button>
                          
                          {/* {activePostDropDown && activePost === post && (
                              <div className="absolute bg-white border border-gray-300 rounded-lg shadow-md p-2 ml-[570px] mt-[100px] h-[115px] w-[240px]" 
                                  id="emojiDropdown">
                                  {isOwnProfile && (
                                    <div className="flex flex-col gap-2">
                                      <button className="hover:bg-gray-100 hover:text-blue-600 font-semibold p-1 rounded w-full">Chỉnh sửa bài viết</button>
                                      <button className="hover:bg-gray-100 hover:text-blue-600 font-semibold p-1 rounded w-full" onClick={() => controlActiveStatusPost(user.id, post.id)}>Chuyển bài viết vào thùng rác</button>
                                    </div>
                                  )}
                                  
                              </div>
                          )} */}
                        </div>
        
                        {/* Nội dung bài viết */}
                        {post.content && <p className="mt-2">{post.content}</p>}
        
                        {/* Danh sách ảnh */}
                       
                        {post.imageUrl!=null&&(
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <img key={imgIndex} src={post.imageUrl} alt={`Ảnh`} className="w-full h-40 object-cover rounded-md" />
                          </div>
                        )}
        
                        {/* Lượt like, comment, share */}
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
                              {/* {post.amountOfShare} */}
                            </div>
                          </div>
                        </div>
        
                        {/* Nút tương tác */}
                        <div className="flex justify-center items-center gap-5 w-full">
                          <div className="flex-1 flex flex-col gap-4 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                            <div className="btn-reaction flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all"
                                                onMouseEnter={() => handleMouseEnter(post.id)} // Gửi ID bài viết
                                                onMouseLeave={handleMouseLeave}>
                                {/* <FaThumbsUp className="w-5 h-5" /> Thích */}
                                {getReactionByUserIdAndPost(post.id).type ? (
                                  <div>
                                    {/* {getEmojiReactionById(getReactionByUserAndPost(post.id).type).emoji}{" "}
                                    {getEmojiReactionById(getReactionByUserAndPost(post.id).type).label} */}
                                    {getReaction(getReactionByUserIdAndPost(post.id).type).emoji}{" "}{getReaction(getReactionByUserIdAndPost(post.id).type).label}
                                  </div>
                                ) : (
                                  <div className="flex flex-row gap-2">
                                    {/* {getEmojiReactionById('LIKE').emoji + " " + getEmojiReactionById('LIKE').label} */}
                                    <FaThumbsUp className="w-5 h-5" /> Thích
                                  </div>
                                )}
                            </div>
                            {activeDropdown === post.id && (
                              <div className="absolute bg-white border border-gray-300 rounded-full shadow-md mt-2 p-2 mt-[-100px]" 
                                 id="emojiDropdown" onMouseEnter={() => handleMouseEnter(post.id)} // Gửi ID bài viết
                                 onMouseLeave={handleMouseLeave}>
                                  <div className="flex space-x-2">
                                      {reactionTypes.map(e => (
                                        <span key={e.id} 
                                              id={e.id} 
                                              className="cursor-pointer p-2 rounded-full hover:bg-gray-200"
                                              onClick={() => controlReactionUser(user.id, 'POST', post.id, e.id)}>{e.emoji}</span>
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
                            <SharePost
                                post={post}
                                onClose={() => setShowShareModal(false)}
                                onShare={handleSharePost}
                                currentUser={user}
                            />
                        )}
                      {isModalOpen && selectedPost && (
                                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                    <div className="fixed relative bg-white p-5 rounded-lg shadow-lg w-[800px] max-w-full relative flex flex-col max-h-[110vh] overflow-hidden">
                                      {/* Header modal */}
                                      <div className="flex justify-between items-center border-b-2 border-gray-500 p-4">
                                        <h1 className="font-bold text-[25px] text-center flex-1">Bài viết của {user.firstName + " " + user.lastName}</h1>
                                        <button className="text-gray-600 hover:text-red-500" onClick={closeModal}>
                                          <FaTimes className="w-5 h-5" />
                                        </button>
                                      </div>
                      
                                      {/* Nội dung có scroll */}
                                      <div className="overflow-y-auto p-2 flex-1 max-h-[500px]">
                                        {/* Nội dung bài viết */}
                                        {selectedPost.content && <p className="mt-2">{selectedPost.content}</p>}
                      
                                        {/* Hình ảnh trong modal */}
                                        {selectedPost.imageUrl!=null&&(
                                          <img src={selectedPost.imageUrl} alt={`Ảnh`} className="w-full h-40 object-cover rounded-md" />
                                        )}
                                        {/* Lượt like, comment, share */}
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
                                              {/* {selectedPost.amountOfShare} */}
                                            </div>
                                          </div>
                                        </div>
                                        {/* Nút tương tác */}
                                        <div className="flex justify-center items-center gap-5 w-full">
                                          <div className="flex-1 flex flex-col gap-4 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                                            <div className="btn-reaction flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all"
                                                                onMouseEnter={() => handleMouseEnter(selectedPost.id)} // Gửi ID bài viết
                                                                onMouseLeave={handleMouseLeave}>
                                                {/* <FaThumbsUp className="w-5 h-5" /> Thích */}
                                                {getReactionByUserIdAndPost(post.id).type ? (
                                                  <div>
                                                    {getReaction(getReactionByUserIdAndPost(post.id).type).emoji}{" "}
                                                    {getReaction(getReactionByUserIdAndPost(post.id).type).label}
                                                  </div>
                                                ) : (
                                                  <div className="flex flex-row gap-2">
                                                    {/* {getEmojiReactionById('LIKE').emoji + " " + getEmojiReactionById('LIKE').label} */}
                                                    <FaThumbsUp className="w-5 h-5" /> Thích
                                                  </div>
                                                )}
                                            </div>
                                            {activeDropdown === selectedPost.id && (
                                              <div className="absolute bg-white border border-gray-300 rounded-full shadow-md mt-2 p-2 mt-[-100px]" 
                                                id="emojiDropdown" onMouseEnter={() => handleMouseEnter(selectedPost.id)} // Gửi ID bài viết
                                                onMouseLeave={handleMouseLeave}>
                                                  <div className="flex space-x-2">
                                                      {reactionTypes.map(e => (
                                                        <span id={e.id} 
                                                        className="cursor-pointer p-2 rounded-full hover:bg-gray-200"
                                                        onClick={() => controlReactionUser(user.id, 'POST', selectedPost.id, e.id)}
                                                        >{e.emoji}</span>
                                                      ))}
                                                  </div>
                                              </div>
                                            )}
                                          </div>
                                          <button className="flex-1 rounded-md  flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                                            <FaComment className="w-5 h-5" /> Bình luận
                                          </button>
                                          <button className="flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                                            <FaShare className="w-5 h-5 rounded-md " /> Chia sẻ
                                          </button>
                                        </div>
                                        {/* Bình luận */}
                                                    
                                        <div className="space-y-3">
                                          {commentByPost.length > 0 ? (
                                            commentByPost.map((cmt, cmtIndex) => (
                                              <div key={cmtIndex} className="border-b p-2">
                                                <p className="font-semibold text-gray-800">👤 {getUserById(cmt.userId.id).firstName + " " + getUserById(cmt.userId.id).lastName}</p>
                                                <p className="text-gray-700">{cmt.content}</p>
                                                <p className="text-xs text-gray-500">{formatDateString(cmt.createdAt)}</p>
                                              </div>
                                            ))
                      
                                          ) : (
                                            <p className="text-gray-500 italic text-center">Chưa có bình luận nào.</p>
                                          )}
                                          <div className="flex justify-between gap-3 absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-300">
                                            <div className="w-[40px]">
                                              {user.profilePicture != null ? (
                                                <img
                                                  src={user.profilePicture}
                                                  className="object-cover h-full w-full rounded-lg"
                                                />
                                              ) : (
                                                <FaUserCircle className="text-gray-300 h-full w-full"/>
                                              )} 
                                            </div>
                                            <div className="flex-1" >
                                              <input className="p-3 bg-gray-100 w-full rounded-full" 
                                                      value={commentContent}
                                                      onChange={(e) => setCommentContent(e.target.value)}
                                                      placeholder={`Bình luận dưới tên ${user.firstName} ${user.lastName}`} />
                                            </div>
                                            <div className="w-[20px] cursor-pointer">
                                                  <FontAwesomeIcon
                                                      className="text-blue-600 h-full w-full" 
                                                      icon={faPaperPlane} 
                                                      onClick={() => {
                                                          if (commentContent.trim()) { // Kiểm tra xem có nội dung bình luận không
                                                              addCommentByUser(user.id, selectedPost.id, commentContent);
                                                              setCommentContent(""); // Xóa nội dung input sau khi thêm bình luận
                                                          }
                                                      }} 
                                                  />
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