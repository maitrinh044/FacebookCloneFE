import { FaComment, FaEllipsisH, FaFacebookMessenger, FaGlobe, FaShare, FaThumbsUp, FaTimes, FaChevronDown, FaPlusCircle, FaPencilAlt, FaLock, FaPlug, FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import PersonalInformation from "./PersonalInformation";
import AboutProfileTabContent from "./AboutProfileTabContent";
import AboutProfileTabFriendContent from "./AboutProfileFriendTabContent";

export default function ProfileTabContent({ isOwnProfile, activeTab, user }) {
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
  
  if (activeTab === "posts") {
    return (
      <div className="bg-gray rounded-xl max-w-[1000px] mx-auto mb-4 flex flex-row">
        <div className="w-[400px] flex-shrink-0">
          <PersonalInformation isOwnProfile={isOwnProfile} />
        </div>
        <div className="w-[600px] flex-shrink-0">
          {/* <ProfileTabContent activeTab={activeTab} user={user} /> */}
          <div className="space-y-4">
          {user.posts && user.posts.length > 0 ? (
            user.posts.map((posts, index) => (
              <div key={index} className="bg-white shadow-md p-4 rounded-md text-gray-700 mb-3 flex flex-col">
                {/* Header */}
                <div className="w-full h-10 flex items-center gap-2">
                  <img src={user.avatar} alt="avatar" className="rounded-full w-10 h-10 object-cover" />
                  <div>
                    <div className="font-bold text-[15px]">{user.name}</div>
                    <div className="text-[13px] flex gap-1">{posts.createdAt} <FaGlobe className="-top-[-3px] relative"/></div>
                  </div>
                  <button className="ml-auto hover:bg-gray-200 p-2 rounded-full transition-all">
                    <FaEllipsisH className="w-4 h-4" />
                  </button>
                </div>

                {/* Nội dung bài viết */}
                {posts.content && <p className="mt-2">{posts.content}</p>}

                {/* Danh sách ảnh */}
                {posts.listImage?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {posts.listImage.map((img, imgIndex) => (
                      <img key={imgIndex} src={img} alt={`Ảnh ${imgIndex + 1}`} className="w-full h-40 object-cover rounded-md" />
                    ))}
                  </div>
                )}

                {/* Lượt like, comment, share */}
                <div className="flex justify-between items-center p-2">
                  <div className="flex gap-1">
                    <FaThumbsUp className="relative top-[3px]" />
                    {posts.amountOfLike}
                  </div>
                  <div className="flex gap-2">
                    <div className="flex gap-1">
                      <FaFacebookMessenger className="relative top-[3px]" />
                      {posts.listCmt?.length || 0}
                    </div>
                    <div className="flex gap-1">
                      <FaShare className="relative top-[3px]" />
                      {posts.amountOfShare}
                    </div>
                  </div>
                </div>

                {/* Nút tương tác */}
                <div className="flex justify-center items-center gap-5 w-full">
                  <button className="flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                    <FaThumbsUp className="w-5 h-5" /> Thích
                  </button>
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
              <div className="relative bg-white p-5 rounded-lg shadow-lg w-[800px] max-w-full relative flex flex-col max-h-[110vh] overflow-hidden">
                {/* Header modal */}
                <div className="flex justify-between items-center border-b-2 border-gray-500 p-4">
                  <h1 className="font-bold text-[25px] text-center flex-1">Bài viết của {user.name}</h1>
                  <button className="text-gray-600 hover:text-red-500" onClick={closeModal}>
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                {/* Nội dung có scroll */}
                <div className="overflow-y-auto p-2 flex-1 max-h-[500px]">
                  {/* Nội dung bài viết */}
                  {selectedPost.content && <p className="mt-2">{selectedPost.content}</p>}

                  {/* Hình ảnh trong modal */}
                  {selectedPost.listImage?.length > 0 && (
                    <div className="mt-2">
                      {selectedPost.listImage.length >= 3 ? (
                        <div className="grid grid-cols-2 gap-2">
                          <img src={selectedPost.listImage[0]} alt="Ảnh 1" className="w-full h-60 object-cover rounded-md col-span-2" />
                          <img src={selectedPost.listImage[1]} alt="Ảnh 2" className="w-full h-40 object-cover rounded-md" />
                          <img src={selectedPost.listImage[2]} alt="Ảnh 3" className="w-full h-40 object-cover rounded-md" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {selectedPost.listImage.map((img, imgIndex) => (
                            <img key={imgIndex} src={img} alt={`Ảnh ${imgIndex + 1}`} className="w-full h-40 object-cover rounded-md" />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {/* Lượt like, comment, share */}
                  <div className="flex justify-between items-center p-2">
                    <div className="flex gap-1">
                      <FaThumbsUp className="relative top-[3px]" />
                      {selectedPost.amountOfLike}
                    </div>
                    <div className="flex gap-2">
                      <div className="flex gap-1">
                        <FaFacebookMessenger className="relative top-[3px]" />
                        {selectedPost.listCmt?.length || 0}
                      </div>
                      <div className="flex gap-1">
                        <FaShare className="relative top-[3px]" />
                        {selectedPost.amountOfShare}
                      </div>
                    </div>
                  </div>
                  {/* Nút tương tác */}
                  <div className="flex justify-center items-center gap-5 w-full">
                    <button className="flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                      <FaThumbsUp className="w-5 h-5 " /> Thích
                    </button>
                    <button className="flex-1 rounded-md  flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                      <FaComment className="w-5 h-5" /> Bình luận
                    </button>
                    <button className="flex-1 rounded-md flex justify-center items-center gap-2 text-gray-600 hover:text-blue-500 py-2 hover:bg-gray-200 transition-all">
                      <FaShare className="w-5 h-5 rounded-md " /> Chia sẻ
                    </button>
                  </div>
                  {/* Bình luận */}
                  <button
                    onClick={(e) => {
                      // e.stopPropagation();
                      setIsOpen(!isOpen);
                    }}
                    className="toggle-dropdown flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition-all"
                  >
                    {selected}
                    <FaChevronDown className="w-3 h-3 text-gray-500" />
                  </button>

                  {isOpen && (
                    <div
                      className="dropdown-container absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {optionsReadCmt.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSelected(option.label);
                            setIsOpen(false);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-md cursor-pointer transition-all"
                        >
                          <div className="font-bold text-gray-800">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      ))}
                    </div>
                  )}              
                  <div className="space-y-3">
                    {selectedPost.listCmt?.length > 0 ? (
                      selectedPost.listCmt.map((cmt, cmtIndex) => (
                        <div key={cmtIndex} className="border-b p-2">
                          <p className="font-semibold text-gray-800">👤 Người dùng</p>
                          <p className="text-gray-700">{cmt.contentCmt}</p>
                          <p className="text-xs text-gray-500">{cmt.cmtAt}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">Chưa có bình luận nào.</p>
                    )}
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
                    <FaEllipsisH className="w-6 h-4" />
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
          <AboutProfileTabFriendContent user = {user} activeAbout_FriendTab={activeAbout_FriendTab}/>
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
                <div className="h-40 w-full flex justify-center items-center bg-gray-300 rounded-lg">
                    <img
                        src={user.avatar}
                        alt="avatar"
                        className="object-cover h-full w-full rounded-lg"
                    />
                </div>
                <div className="h-10 flex flex-col">
                    <p className="">Ảnh đại diện</p>
                    <p className="text-[10px]">1 mục</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="h-40 w-full flex justify-center items-center bg-gray-300 rounded-lg">
                    <img
                        src={user.coverPhoto}
                        alt="coverPhoto"
                        className="object-cover h-full w-full rounded-lg"
                    />
                </div>
                <div className="h-10 flex flex-col">
                    <p>Ảnh bìa</p>
                    <p className="text-[10px]">1 mục</p>
                </div>
            </div>
        </div>
        </div>
        
      </div>
    );
  }

  return null;
}
