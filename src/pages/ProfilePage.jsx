import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileTabs from "../components/Profile/ProfileTabs";
import ProfileTabContent from "../components/Profile/ProfileTabContent";
import EditProfileModal from "../components/Profile/EditProfileModal";
import PersonalInformation from "../components/Profile/PersonalInformation";
import useFetchProfile, { getReactionsByUser } from "../utils/userFetchProfile";
import { useFetchUser, useFetchUserById } from "../utils/useFetchUser";
import { getPostByUser, getReactionByPostId, getReactionsByUserId } from "../services/profileService";
import { controlReaction } from "../services/CommentService";
import { createPost, shareToProfile } from "../services/PostService";

export default function ProfilePage() {
  const { id } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const currentUserId2 = localStorage.getItem("userId");
  const {user} = useFetchUserById(currentUserId);
  const [listPost, setListPost] = useState([]);
  const [reactionByUser, setReactionByUser] = useState([]);
  const [reactionByPost, setReactionByPost] = useState([]);
  // const {reactionByUser} = getReactionsByUser(currentUserId);
  // console.log("reactionByCurrentUser: ", reactionByUser);
  useEffect(() => {
    const fetchData = async() => {
      try {
        const response1 = await getPostByUser(id);
        setListPost(response1); 
        const data = await getReactionsByUserId(currentUserId); // Lấy người dùng bằng ID
        setReactionByUser(data);
        const reactionPromises = response1.map(post1 => {
            return getReactionByPostId(post1.id).then(reactions => ({
                postId: post1.id,
                reactions
            }));
        });
        // Chờ cho tất cả các yêu cầu reactions hoàn thành
        const tmp1 = await Promise.all(reactionPromises);
        setReactionByPost(tmp1);
      } catch (error) {
        console.error("Lỗi khi lấy các bài viết của người dùng:", error.response ? error.response.data : error.message);
      }
    }
    fetchData();
  },[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {userData,commentByPost,reactionTypes,listFriends,addCommentByUser,controlActiveStatusPost,updateUser,loading} = useFetchProfile(id, currentUserId2);

  const controlReactionUser = async (userId, targetType, targetId, reactionType) => {
    try {
      const newReaction = await controlReaction(userId, targetType, targetId, reactionType);
      const data = await getReactionsByUserId(userId);
      setReactionByUser(data);
      const updatedComments = await getPostByUser(userId);
      const tmp2 = await getReactionsByUserId(userId); // Lấy người dùng bằng ID
      setReactionByUser(tmp2);
      const reactionPromises = updatedComments.map(post1 => {
          return getReactionByPostId(post1.id).then(reactions => ({
              postId: post1.id,
              reactions
          }));
      });
      // Chờ cho tất cả các yêu cầu reactions hoàn thành
      const tmp1 = await Promise.all(reactionPromises);
      setReactionByPost(tmp1);
      setListPost(updatedComments);
    } catch (error) {
      const tmp2 = await getReactionsByUserId(userId); // Lấy người dùng bằng ID
      setReactionByUser(tmp2);
      const updatedComments = await getPostByUser(userId);
      const reactionPromises = updatedComments.map(post1 => {
          return getReactionByPostId(post1.id).then(reactions => ({
              postId: post1.id,
              reactions
          }));
      });
      // Chờ cho tất cả các yêu cầu reactions hoàn thành
      const tmp1 = await Promise.all(reactionPromises);
      setReactionByPost(tmp1);
      setListPost(updatedComments);
      console.error("Lỗi khi điều khiển phản ứng:", error);
    }
  };
  
  // console.log('listPost: ', listPost);
  // console.log('reactionByPost: ', reactionByPost);
  // console.log('reactionByUser: ', reactionByUser);
  const {users, error} = useFetchUser();
  // console.log("users: ", users);
  function getUserById(userId) {
    const user = users.find(e => e.id === userId);
    return user || [];
  }
  const share = async(userId, postId, caption)=> {
    try {
      const response = await shareToProfile(userId, postId, caption);
      const response1 = await getPostByUser(id);
      const data = await getReactionsByUserId(userId); // Lấy người dùng bằng ID
      setReactionByUser(data);
      const reactionPromises = response1.map(post1 => {
          return getReactionByPostId(post1.id).then(reactions => ({
              postId: post1.id,
              reactions
          }));
      });
      // Chờ cho tất cả các yêu cầu reactions hoàn thành
      const tmp1 = await Promise.all(reactionPromises);
      setReactionByPost(tmp1);
      setListPost(response1);
    } catch (error) {
      console.error("Lỗi khi share bài viết! ", error);
    }
  }
  const handlePostCreated = async (newPost) => {
    try {
      const createdPost = await createPost(newPost); // Gửi dữ liệu tạo bài viết mới đến API
      const response1 = await getPostByUser(id);
      const data = await getReactionsByUserId(id); // Lấy người dùng bằng ID
      setReactionByUser(data);
      const reactionPromises = response1.map(post1 => {
          return getReactionByPostId(post1.id).then(reactions => ({
              postId: post1.id,
              reactions
          }));
      });
      // Chờ cho tất cả các yêu cầu reactions hoàn thành
      const tmp1 = await Promise.all(reactionPromises);
      setReactionByPost(tmp1);
      setListPost(response1);
      console.log('Đăng bài viết trong profilepage!');
    } catch (err) {
      console.error("Error creating post:", err); // Log lỗi nếu có
      setError("Failed to create post"); // Thiết lập lỗi nếu có
    }
  };
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);

  const handleSaveUser = (updatedUser) => {
    setUsers((prev) => ({
      ...prev,
      [id]: updatedUser,
    }));
  };
  useEffect(() => {
    if (showEdit) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showEdit]);
  if(loading) return(<p>loading....</p>)
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="w-full min-h-screen mx-auto flex flex-col">
        <ProfileHeader
          user={userData}
          isOwnProfile={id === currentUserId}
          onEdit={() => setIsModalOpen(true)}
          listFriends={listFriends}

        />
        {isModalOpen && (
          <EditProfileModal user={userData}  onClose={() => setIsModalOpen(false)} isOpen={() => setIsModalOpen(true)} updateUser={updateUser} />
        )}
        <div className="pt-28 w-full mx-auto border-b border-gray-300">
          <div className="bg-white shadow">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="bg-gray rounded-xl max-w-[1000px] mx-auto m-4 flex flex-row">

            <div className="w-[1000px]">
              <ProfileTabContent isOwnProfile={id === currentUserId} 
                                currentUser={user} 
                                activeTab={activeTab} 
                                user={userData} 
                                listPost={listPost} 
                                listFriends={listFriends} 
                                users={users} 
                                commentByPost={commentByPost} 
                                reactionByPost={reactionByPost} 
                                reactionTypes={reactionTypes} 
                                reactionByCurrentUser={reactionByUser}
                                controlReactionUser={controlReactionUser}
                                addCommentByUser={addCommentByUser}
                                controlActiveStatusPost={controlActiveStatusPost}
                                share={share}
                                handlePostCreated={handlePostCreated}
                                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
