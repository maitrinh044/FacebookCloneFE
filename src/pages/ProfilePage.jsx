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

export default function ProfilePage() {
  const { id } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const currentUserId2 = localStorage.getItem("userId");
  const {user} = useFetchUserById(currentUserId);
  // const {reactionByUser} = getReactionsByUser(currentUserId);
  // console.log("reactionByCurrentUser: ", reactionByUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {listPost, userData, reactionByPost,commentByPost,reactionTypes,listFriends,controlReactionUser,addCommentByUser,reactionByUser,controlActiveStatusPost,updateUser,loading} = useFetchProfile(id, currentUserId2);

  
  const {users, error} = useFetchUser();
  console.log("users: ", users);
  function getUserById(userId) {
    const user = users.find(e => e.id === userId);
    return user || [];
  }
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
                                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
