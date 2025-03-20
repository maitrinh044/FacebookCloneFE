import { useParams } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileTabs from "../components/Profile/ProfileTabs";
import ProfileTabContent from "../components/Profile/ProfileTabContent";
import EditProfileModal from "../components/Profile/EditProfileModal";

export default function ProfilePage() {
  const { id } = useParams();
  const currentUserId = "1";

  const defaultUsers = {
    1: {
      name: "Nguyễn Mai Trinh",
      bio: "Mình là lập trình viên React.",
      email: "trinh@gmail.com",
      phone: "0123456789",
      avatar: "https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-6/458161522_2243394162660512_7913931544320209269_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFE4H0KfJHUauSeB90nsw9jIBJwHuSktOAgEnAe5KS04F5KUxSkb8DlPyoPUcf2mlb9fV6MzqCuAtSLoc7Ay6-A&_nc_ohc=CXoMMnzvULoQ7kNvgFZLNp-&_nc_oc=AdjNzoIiVpfLATDGUv0oY6SCRqqoWRKqzKIK2uibBiB7xMsZ3R_jrFit4A_ZcyT6khZD-46VADTMWeSRlKpYVKXP&_nc_zt=23&_nc_ht=scontent.fsgn5-6.fna&_nc_gid=Ax5cAA8VvhqV4FMBVI3PTkR&oh=00_AYHbJo2PZEMicy7PeJsIQd0f0-rz4jRhffDsyP_j1-V9pQ&oe=67D6AB59",
      coverPhoto: "https://4kwallpapers.com/images/walls/thumbs_3t/1455.jpg",
      posts: ["Bài viết của Trinh 1", "Bài viết của Trinh 2"],
    },
    2: {
      name: "Bảo Trân",
      bio: "Yêu thích thiết kế UI/UX.",
      avatar: "https://via.placeholder.com/100?text=Trân",
      coverPhoto: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
      posts: ["Hello mọi người!", "Thiết kế là đam mê."],
    },
  };

  const [users, setUsers] = useState(defaultUsers);
  const user = users[id] || defaultUsers[1];

  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);

  const handleSaveUser = (updatedUser) => {
    setUsers((prev) => ({
      ...prev,
      [id]: updatedUser,
    }));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="w-full max-w-6xl mx-auto">
        <ProfileHeader
          user={user}
          userId={1}
          isOwnProfile={id === currentUserId}
          onEdit={() => setShowEdit(true)}
        />
        <div className="pt-28 px-4">
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="bg-white p-6 rounded-xl shadow-md">
            <ProfileTabContent activeTab={activeTab} user={user} />
          </div>
        </div>
      </div>

      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}
