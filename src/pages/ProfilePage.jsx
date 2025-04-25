import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileTabs from "../components/Profile/ProfileTabs";
import ProfileTabContent from "../components/Profile/ProfileTabContent";
import EditProfileModal from "../components/Profile/EditProfileModal";
import PersonalInformation from "../components/Profile/PersonalInformation";
import { getUserById } from "../services/UserService";

export default function ProfilePage() {
  const { id } = useParams();
  console.log("id: ", id);
  const currentUserId = localStorage.getItem("userId");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(id);  // Gọi API để lấy thông tin người dùng
        console.log("a");
        setUser(userData);  // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Không thể lấy thông tin người dùng:", error);
      }
    };

    fetchUser();  // Gọi hàm fetchUser khi trang load
  }, [id]);  // Gọi lại khi ID thay đổi

  useEffect(() => {
    if (showEdit) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showEdit]);
  
  console.log(user);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="w-full min-h-screen mx-auto flex flex-col">
        <ProfileHeader
          user={user}
          userId={1}
          isOwnProfile={id === currentUserId}
          onEdit={() => setIsModalOpen(true)}
        />
        {isModalOpen && (
          <EditProfileModal user={user}  onClose={() => setIsModalOpen(false)} isOpen={() => setIsModalOpen(true)} />
        )}
        <div className="pt-28 w-full mx-auto border-b border-gray-300">
          <div className="bg-white shadow">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="bg-gray rounded-xl max-w-[1000px] mx-auto m-4 flex flex-row">

            <div className="w-[1000px]">
              <ProfileTabContent isOwnProfile={id === currentUserId} activeTab={activeTab} user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
