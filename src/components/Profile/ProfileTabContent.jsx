import { FaComment, FaEllipsisH, FaFacebookMessenger, FaGlobe, FaShare, FaThumbsUp, FaTimes, FaChevronDown, FaPlusCircle, FaPencilAlt, FaLock, FaPlug, FaPlus, FaUserCircle, FaPalette, FaPlay } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import PersonalInformation from "./PersonalInformation";
import AboutProfileTabContent from "./AboutProfileTabContent";
import AboutProfileTabFriendContent from "./AboutProfileFriendTabContent";
import { div, img } from "framer-motion/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { addComment } from "../../services/profileService";

export default function ProfileTabContent({ isOwnProfile, currentUser, activeTab, user, listPost, listFriends, commentByPost, reactionByPost, reactionTypes, users, reactionByCurrentUser, controlReactionUser,addCommentByUser,controlActiveStatusPost }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeAboutTab, setActiveAboutTab] = useState('tongquan');
  const [activeAbout_FriendTab, setActiveAbout_FriendTab] = useState('tatcabanbe');
  const [activePhotoTab, setActivePhotoTab] = useState('album');
  const tabsOfPhoto = [
    { key: "album", label: 'Album'}
  ];
  const tabsOfAbout = [
    { key: "tongquan", label: "Tổng quan" },
    { key: "congviec", label: "Công việc và học vấn" },
    { key: "noitungsong", label: "Nơi từng sống" },
    { key: "thongtinlienhe", label: "Thông tin liên hệ và cơ bản" },
    { key: "giadinh", label: "Gia đình và các mối quan hệ" },
    { key: "chitiet", label: "Chi tiết về bạn" },
    { key: "sukientrongdoi", label: "Sự kiện trong đời" }
  ];
  const tabsOfAbout_Friend = [
    { key: "tatcabanbe", label: "Tất cả bạn bè"},
    { key: "dathemganday", label: "Đã thêm gần đây"},
    { key: "sinhnhat", label: "Sinh nhật"},
    { key: "tinh", label: "Tỉnh/thành phố hiện tại"},
    { key: "dangtheodoi", label: "Đang theo dõi"}
  ]; 
  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };
  const optionsReadCmt = [
    { label: "Phù hợp nhất", description: "Hiển thị bình luận của bạn bè và những bình luận có nhiều lượt tương tác nhất trước tiên." },
    { label: "Mới nhất", description: "Hiển thị tất cả bình luận, theo thứ tự là các bình luận mới nhất trước tiên." },
    { label: "Tất cả bình luận", description: "Hiển thị tất cả các bình luận, bao gồm cả nội dung có thể là spam." },
  ];
  const [selected, setSelected] = useState(optionsReadCmt[0].label);
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
  function getReactionByPostId(postId) {
    const post = reactionByPost.find(e => e.postId === postId);
    return post.reactions || [];
  }
  function getCommentByPostId(postId) {
    const post = commentByPost.find(e => e.postId === postId);
    return post.comments || [];
  }
  function getUserById(userId) {
    const user = users.find(e => e.id === userId);
    return user || [];
  }
  function getReactionByUserAndPost(postId) {
    const reaction = reactionByCurrentUser.find(e=> (e.targetType === 'POST' && e.targetId === postId));
    return reaction || [];
  }
  function getEmojiReactionById(reactionId) {
    const reaction = reactionTypes.find(e=> e.id == reactionId);
    return reaction || [];
  }
// Inside your ProfileTabContent component
  const [activeDropdown, setActiveDropdown] = useState(null);
  const handleMouseEnter = (postId) => {
    setActiveDropdown(postId);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
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
  if (activeTab === "posts") {
    return (
      <div className="bg-gray rounded-xl max-w-[1000px] mx-auto mb-4 flex flex-row">
        <div className="w-[400px] flex-shrink-0">
          <PersonalInformation isOwnProfile={isOwnProfile} user={user} listFriends={listFriends} />
        </div>
        <div className="w-[600px] flex-shrink-0">
          {/* <ProfileTabContent activeTab={activeTab} user={user} /> */}
          <div className="space-y-4">
          {listPost && listPost.length > 0 ? (
            listPost.map((posts, index) => (
              <div key={index} className="bg-white shadow-md p-4 rounded-md text-gray-700 mb-3 flex flex-col">
                {/* Header */}
                <div className="w-full h-10 flex items-center gap-2">
                  {user.profilePicture!=null?(
                    <img src={user.profilePicture} alt="avatar" className="rounded-full w-10 h-10 object-cover" />
                  ):(
                    <FaUserCircle className="rounded-full w-10 h-10 object-cover text-gray-300"/>
                  )}
                  <div>
                    <div className="font-bold text-[15px]">{user.firstName + " " + user.lastName}</div>
                    <div className="text-[13px] flex gap-1">{formatDateString(posts.createdAt)} <FaGlobe className="-top-[-3px] relative"/></div>
                  </div>
                  <button className="ml-auto hover:bg-gray-200 p-2 rounded-full transition-all text-gray-300">
                    <FaEllipsisH className="w-4 h-4" onClick={() => handleClickActivePost(posts)}/>
                  </button>
                  
                  {activePostDropDown && activePost === posts && (
                      <div className="absolute bg-white border border-gray-300 rounded-lg shadow-md p-2 ml-[570px] mt-[100px] h-[115px] w-[240px]" 
                          id="emojiDropdown">
                          {isOwnProfile && (
                            <div className="flex flex-col gap-2">
                              <button className="hover:bg-gray-100 hover:text-blue-600 font-semibold p-1 rounded w-full">Chỉnh sửa bài viết</button>
                              <button className="hover:bg-gray-100 hover:text-blue-600 font-semibold p-1 rounded w-full" onClick={() => controlActiveStatusPost(user.id, posts.id)}>Chuyển bài viết vào thùng rác</button>
                            </div>
                          )}
                          
                      </div>
                  )}
                </div>

                {/* Nội dung bài viết */}
                {posts.content && <p className="mt-2">{posts.content}</p>}

                {/* Danh sách ảnh */}
               
                {posts.imageUrl!=null&&(
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <img key={imgIndex} src={posts.imageUrl} alt={`Ảnh`} className="w-full h-40 object-cover rounded-md" />
                  </div>
                )}

                {/* Lượt like, comment, share */}
                <div className="flex justify-between items-center p-2">
                  <div className="flex gap-1">
                    <FaThumbsUp className="relative top-[3px]" />
                      {getReactionByPostId(posts.id).length || 0}
                  </div>
                  <div className="flex gap-2">
                    <div className="flex gap-1">
                      <FaFacebookMessenger className="relative top-[3px]" />
                      {getCommentByPostId(posts.id).length || 0}
                    </div>
                    <div className="flex gap-1">
                      <FaShare className="relative top-[3px]" />
                      {/* {posts.amountOfShare} */}
                    </div>
                  </div>
                </div>

                {/* Nút tương tác */}
                <div className="flex justify-center items-center gap-5 w-full">
                  <div className="flex-1 flex flex-col gap-4 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                    <div className="btn-reaction flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all"
                                        onMouseEnter={() => handleMouseEnter(posts.id)} // Gửi ID bài viết
                                        onMouseLeave={handleMouseLeave}>
                        {/* <FaThumbsUp className="w-5 h-5" /> Thích */}
                        {getReactionByUserAndPost(posts.id).type ? (
                          <div>
                            {getEmojiReactionById(getReactionByUserAndPost(posts.id).type).emoji}{" "}
                            {getEmojiReactionById(getReactionByUserAndPost(posts.id).type).label}
                          </div>
                        ) : (
                          <div className="flex flex-row gap-2">
                            {/* {getEmojiReactionById('LIKE').emoji + " " + getEmojiReactionById('LIKE').label} */}
                            <FaThumbsUp className="w-5 h-5" /> Thích
                          </div>
                        )}
                    </div>
                    {activeDropdown === posts.id && (
                      <div className="absolute bg-white border border-gray-300 rounded-full shadow-md mt-2 p-2 mt-[-100px]" 
                         id="emojiDropdown" onMouseEnter={() => handleMouseEnter(posts.id)} // Gửi ID bài viết
                         onMouseLeave={handleMouseLeave}>
                          <div className="flex space-x-2">
                              {reactionTypes.map(e => (
                                <span key={e.id} 
                                      id={e.id} 
                                      className="cursor-pointer p-2 rounded-full hover:bg-gray-200"
                                      onClick={() => controlReactionUser(currentUser.id, 'POST', posts.id, e.id)}>{e.emoji}</span>
                              ))}
                          </div>
                      </div>
                    )}
                  </div>
                  <button className="flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all" onClick={() => openModal(posts)}>
                    <FaComment className="w-5 h-5" /> Bình luận
                  </button>
                  <button className="flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                    <FaShare className="w-5 h-5" /> Chia sẻ
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Chưa có bài viết nào.</p>
          )}

          {/* Modal bình luận */}
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
                      {getReactionByPostId(selectedPost.id).length || 0}
                    </div>
                    <div className="flex gap-2">
                      <div className="flex gap-1">
                        <FaFacebookMessenger className="relative top-[3px]" />
                        {getCommentByPostId(selectedPost.id).length || 0}
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
                          {getReactionByUserAndPost(selectedPost.id).type ? (
                            <div>
                              {getEmojiReactionById(getReactionByUserAndPost(selectedPost.id).type).emoji}{" "}
                              {getEmojiReactionById(getReactionByUserAndPost(selectedPost.id).type).label}
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
                                  onClick={() => controlReactionUser(currentUser.id, 'POST', posts.id, e.id)}
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
                              
                  <div className="space-y-3 mb-[50px]">
                    {getCommentByPostId(selectedPost.id).length > 0 ? (
                      getCommentByPostId(selectedPost.id).map((cmt, cmtIndex) => (
                        <div key={cmtIndex} className="border-b p-2">
                          <p className="font-semibold text-gray-800">👤 {getUserById(cmt.userId.id).firstName + " " + getUserById(cmt.userId.id).lastName}</p>
                          <p className="text-gray-700">{cmt.content}</p>
                          <p className="text-xs text-gray-500">{formatDateString(cmt.createdAt)}</p>
                        </div>
                      ))

                    ) : (
                      <p className="text-gray-500 italic text-center">Chưa có bình luận nào.</p>
                    )}
                    
                  </div>
                  <div className="flex justify-between gap-3 absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-300">
                      <div className="w-[40px]">
                        {currentUser.profilePicture != null ? (
                          <img
                            src={currentUser.profilePicture}
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
                                placeholder={`Bình luận dưới tên ${currentUser.firstName} ${currentUser.lastName}`} />
                      </div>
                      <div className="w-[20px] cursor-pointer">
                            <FontAwesomeIcon 
                                className="text-blue-600 h-full w-full" 
                                icon={faPaperPlane} 
                                onClick={() => {
                                    if (commentContent.trim()) { // Kiểm tra xem có nội dung bình luận không
                                        addCommentByUser(currentUser.id, selectedPost.id, commentContent);
                                        setCommentContent(""); // Xóa nội dung input sau khi thêm bình luận
                                    }
                                }} 
                            />
                      </div>
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    );
  } else if(activeTab === 'about') {
    return (
      <div className="flex flex-col">
        <div className="bg-white rounded-xl w-full mx-auto mb-4 flex flex-row shadow rounded-lg">
          <div className="max-w-[300px] flex-shrink-0 flex flex-col rounded-l-lg p-2">
            <h1 className="flex justify-start items-center font-bold text-2xl p-2">Giới thiệu</h1>
            {tabsOfAbout.map((tab) => (
              <button
                  key={tab.key}
                  className={`p-3 flex justify-start items-center mt-1 mb-1 rounded-lg font-semibold transition-colors duration-200 hover:bg-gray-300 ${
                      activeAboutTab === tab.key
                          ? "bg-blue-200 text-blue-600"
                          : "text-gray-600 hover:text-blue-500"
                  }`}
                  onClick={() => setActiveAboutTab(tab.key)}
              >
                  {tab.label}
              </button>
            ))}
          </div>
          <div className="max-w-[800px] flex-1 rounded-r-lg p-2">
            <AboutProfileTabContent activeAboutTab={activeAboutTab} user={user}/>
          </div>
        </div>
        <div className="flex flex-col shadow rounded-lg p-2 bg-white p-4">
          <div className="flex justify-between gap-3">
            <div className="font-bold text-[18px]">Bạn bè</div>
            <div className="flex justify-end gap-2">
              <button className="text-blue-500 hover:bg-gray-300 p-2 rounded-lg">Lời mời kết bạn</button>
              <button className="text-blue-500 hover:bg-gray-300 p-2 rounded-lg">Tìm bạn bè</button>
              <button className="text-blue-500 hover:bg-gray-300 p-2 rounded-lg">Mời bạn bè</button>
              <button className="bg-gray-100 hover:bg-gray-300 text-gray-700 p-2 rounded-md shadow-md transition-all duration-200 relative">
                    <FaEllipsisH className="w-6 h-4 text-gray-300" />
              </button>
            </div>
          </div>
          <div className="flex justify-start gap-3">
            {tabsOfAbout_Friend.map(tab => (
              <button
                  key={tab.key}
                  className={`p-3 flex justify-start items-center mt-1 mb-1 rounded-t-lg font-semibold transition-colors duration-200 hover:bg-gray-300 ${
                      activeAbout_FriendTab === tab.key
                          ? "border-b-4 border-blue-500 text-blue-600"
                          : "text-gray-600 hover:text-gray-500"
                  }`}
                  onClick={() => setActiveAbout_FriendTab(tab.key)}
              >
                  {tab.label}
              </button>
            ))}
          </div>
          <AboutProfileTabFriendContent user = {user} activeAbout_FriendTab={activeAbout_FriendTab} listFriends={listFriends}/>
          <div className="w-full flex justify-center">
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-[18px] h-10 font-semibold rounded-lg">
              Xem tất cả
            </button>
          </div>
        </div>
      </div>
      
    );
  } else {
    return (
      <div className="flex flex-col p-5">
        <div className="bg-white rounded-xl w-full mx-auto mb-4 flex flex-col shadow rounded-lg p-3">
          <h1 className="flex justify-start items-center font-bold text-2xl p-2">Ảnh</h1>
          <div className=" flex-shrink-0 flex justify-start items-center gap-4 rounded-l-lg p-2">
            {tabsOfPhoto.map((tab) => (
              <button
                  key={tab.key}
                  className={`p-3 flex justify-start items-center mt-1 mb-1 rounded-t-lg font-semibold transition-colors duration-200 hover:bg-gray-300 ${
                      activePhotoTab === tab.key
                          ? "border-b-4 border-blue-500 text-blue-600"
                          : "text-gray-600 hover:text-gray-500"
                  }`}
                  onClick={() => setActivePhotoTab(tab.key)}
              >
                  {tab.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-4">
            {/* div thêm ảnh */}
            <div className="flex flex-col gap-1">
                <div className="h-40 w-full flex justify-center items-center bg-gray-300 rounded-lg">
                    <FaPlus className="text-5xl text-gray-600" />
                </div>
                <div className="h-10 flex justify-start items-center text-center">Tạo album</div>
            </div>

            {/* div ảnh */}
            <div className="flex flex-col gap-2">
                <div className="h-40 w-full flex justify-center items-center rounded-lg">
                    
                    {user.profilePicture!=null? (
                      <img
                          src={user.profilePicture}
                          alt="avatar"
                          className="object-cover h-full w-full rounded-lg"
                      />
                    ) : (
                      <FaUserCircle className="object-cover h-full w-full rounded-lg text-gray-300"/>
                    )}
                </div>
                <div className="h-10 flex flex-col">
                    <p className="">Ảnh đại diện</p>
                    
                    {user.profilePicture!=null ? (
                      <p className="text-[10px]">1 mục</p>
                    ) : (
                      <p className="text-[10px]">0 mục</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="h-40 w-full flex justify-center items-center bg-gray-300 rounded-lg">
                {user.coverPhoto!=null? (
                      <img
                          src={user.coverPhoto}
                          alt="avatar"
                          className="object-cover h-full w-full rounded-lg"
                      />
                    ) : (
                      <div className="h-full w-full rounded-lg bg-gray-300"/>
                    )}

                </div>
                <div className="h-10 flex flex-col">
                    <p>Ảnh bìa</p>
                    {user.coverPhoto!=null ? (
                      <p className="text-[10px]">1 mục</p>
                    ) : (
                      <p className="text-[10px]">0 mục</p>
                    )}
                </div>
            </div>
        </div>
        </div>
        
      </div>
    );
  }

  return null;
}
