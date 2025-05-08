import { useEffect, useState } from "react";
import { getCommentsByPost } from "../../services/CommentService";
import { addComment, controlReaction, getCommentByPost, getReactionByPostId, getReactionsByUserId } from "../../services/profileService";
import { countReactions, getReactionCountsByType, getReactions, getReactionTypes } from "../../services/ReactionService";
import { FaComment, FaEllipsisH, FaFacebookMessenger, FaGlobe, FaShare, FaShareAlt, FaThumbsUp, FaTimes, FaUserCircle } from "react-icons/fa";
import SharePost from "./SharePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function PostByShare({posts, post, onShare, user, controlActiveStatusPost,users}) {
    const [reactionTypes, setReactionTypes] = useState([]);
    const [reactionByPost, setReactionByPost] = useState([]);
    const [commentByPost, setCommentByPost] = useState([]);
    const [reactionByUser, setReactionByUser] = useState([]);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    // const [commentContent, setCommentContent] = useState("");

    const userId = user?.id || 1; // Giả định userId từ currentUser, thay bằng logic auth thực tế
    const userid = localStorage.getItem('userId');
    console.log('userId in postshare: ', user);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Lấy bình luận
                const commentData = await getCommentsByPost(post.id);
                setCommentByPost(commentData);


                // Lấy danh sách loại phản ứng
                const types = await getReactionTypes();
                console.log("types: ", types);
                setReactionTypes(types);

                /////////
                const tmp1 = await getReactionsByUserId(userid); // Lấy người dùng bằng ID
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
    const openModal = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
    };
    function getReactionByUserIdAndPost(postid) {
        const reaction = reactionByUser.find(e=>e.targetId === postid);
        return reaction || [];
    }
    function getReaction(id) {
        const reaction = reactionTypes.find(e=>e.id === id);
        return reaction || [];
    }
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
    function getPostById(postId) {
        const post = posts.find(e => e.id === postId);
        return post || [];
    }
    // console.log('getUserById: ', getUserById(getPostById(1).userId).firstName);
    // posts.forEach(element => {
    //     console.log('post: ', getUserById(getPostById(element.originalPostId).userId));
    // });
    console.log('users: ', users);
    function getUserById(userId) {
        const user = users.find(e => e.id === userId);
        return user || [];
    }
    console.log('posts: ', posts);
    // posts.forEach(element => {
    //     console.log('post: ' + element.id, getUserById(getPostById(element.originalPostId).userId).firstName);
    // });
    // console.log("reactionTypes in postshare: ", reactionTypes);getUserById(getPostById(element.originalPostId).userId
    // console.log("commentByPost: ", commentByPost);
    // console.log('reactionByUser: ', reactionByUser)
    // // user = getUserById(userid);
    // console.log('user: ', user);
    // if (loading) return <div>Loading...</div>;
    return (
        <div className="space-y-4">
                <div  className="bg-white shadow-md p-4 rounded-md text-gray-700 mb-3 flex flex-col">
                  {/* Header */}
                  <div className="w-full h-10 flex items-center gap-2">
                    {getUserById(post.userId).profilePicture!=null?(
                      <img src={getUserById(post.userId).profilePicture} alt="avatar" className="rounded-full w-10 h-10 object-cover" />
                    ):(
                      <FaUserCircle className="rounded-full w-10 h-10 object-cover text-gray-300"/>
                    )}
                    <div>
                      <div className="font-bold text-[15px]">{getUserById(post.userId).firstName + " " + getUserById(post.userId).lastName}</div>
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
                  {post.content && <p className="mt-2">{post.content}</p>}
                  <div className="shadow rounded p-3">
                    <div className="w-full h-10 flex items-center gap-2">
                      {getUserById(getPostById(post.originalPostId).userId).profilePicture!=null?(
                        <img src={getUserById(post.userId).profilePicture} alt="avatar" className="rounded-full w-10 h-10 object-cover" />
                      ):(
                        <FaUserCircle className="rounded-full w-10 h-10 object-cover text-gray-300"/>
                      )}
                      <div>
                        <div className="font-bold text-[15px]">{getUserById(getPostById(post.originalPostId).userId).firstName + " " + getUserById(getPostById(post.originalPostId).userId).lastName}</div>
                        <div className="text-[13px] flex gap-1">{formatDateString(getPostById(post.originalPostId).createdAt)} <FaGlobe className="-top-[-3px] relative"/></div>
                      </div>
                      <button className="ml-auto hover:bg-gray-200 p-2 rounded-full transition-all text-gray-300">
                        <FaEllipsisH className="w-4 h-4" onClick={() => handleClickActivePost(getPostById(post.originalPostId))}/>
                      </button>
                    </div>
                    {/* Nội dung bài viết */}
                    {getPostById(post.originalPostId).content && <p className="mt-2">{getPostById(post.originalPostId).content}</p>}
                    
                    {/* Danh sách ảnh */}
                  
                    {getPostById(post.originalPostId).imageUrl!=null&&(
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <img key={imgIndex} src={getPostById(post.originalPostId).imageUrl} alt={`Ảnh`} className="w-full h-40 object-cover rounded-md" />
                      </div>
                    )}
                  </div>
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
                    <SharePost
                    post={getPostById(post.originalPostId)}
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
                                                    addCommentByUser(userid, selectedPost.id, commentContent);
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