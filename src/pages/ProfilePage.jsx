import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileTabs from "../components/Profile/ProfileTabs";
import ProfileTabContent from "../components/Profile/ProfileTabContent";
import EditProfileModal from "../components/Profile/EditProfileModal";
import PersonalInformation from "../components/Profile/PersonalInformation";

export default function ProfilePage() {
  const { id } = useParams();
  const currentUserId = "1";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const defaultUsers = {
    1: {
      name: "Nguyễn Mai Trinh",
      bio: "Mình là lập trình viên React.",
      email: "trinh@gmail.com",
      phone: "0123456789",
      avatar: "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/454496844_479840731481859_2536333414267653734_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGwctavh29EJSB0-bkY20f0kZNUFeeeddyRk1QV55513FjqWTv8mBUs9yycAiuSMb6yl65937x7WTTl8lbNf4lC&_nc_ohc=Caqr4CMaikEQ7kNvgFQBmVY&_nc_oc=AdlSOfGsP2-Rj8HiAfLYElg3OIFw9fgfj2GeTqP3Cmfrzqf6D5jLoWDwqszDLt__r_KV9KrbLVscLHCXME2P_2ct&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=QqXenu98qzXXrqIfhDAcFQ&oh=00_AYFKhmICmlVB68VTEMjuSj6GcVKwfHbZf1GkdAs8VFBjuw&oe=67E4C377",
      coverPhoto: "https://4kwallpapers.com/images/walls/thumbs_3t/1455.jpg",
      posts: [
        {
          listImage: [
            "https://media.loveitopcdn.com/24813/nuoc-sot-han-quoc-an-thit-nuong.jpg",
            "https://file.hstatic.net/1000355994/file/littlekoreabbq-270-5c581f515056b36_5c582258-5056-b365-ab9c393ec69b4d13_7756c2b2315f48d8a06c19a75bb90f29_1024x1024.jpg",
            "https://product.hstatic.net/1000372317/product/uop-thit-bo-nuong_e6164118341d47b4a4e4aeb113e163e7_master.jpg"
          ],
          content: 'Thèm thịt nướng qó đi ò =(((',
          createdAt: "2025-11-02",
          amountOfLike: 29302,
          amountOfShare: 132,
          listCmt: [
            { contentCmt: "Nhìn thèm qá à hic TT", cmtAt: "2025-03-22" },
            { contentCmt: "Quán Meet&Meat ở q1 ngon lắm á", cmtAt: "2025-03-21" },
            { contentCmt: "Ời ơi ăn ớn r", cmtAt: "2025-03-23" }
          ]
        },
        {
          listImage: [
            "https://image.lag.vn/upload/news/22/07/30/cute_ajrs.jpg",
            "https://kenh14cdn.com/203336854389633024/2023/5/4/anh-meo-cute-de-thuong-28-16831759326691946727451.jpg"
          ],
          createdAt: "2025-11-05",
          amountOfLike: 5000,
          amountOfShare: 250,
          listCmt: [
            { contentCmt: "Mèo dễ thương quá!", cmtAt: "2025-03-25" },
            { contentCmt: "Muốn nuôi 1 con quá chừng", cmtAt: "2025-03-26" }
          ]
        }
      ]
    },
    2: {
      name: "Bảo Trân",
      bio: "Yêu thích thiết kế UI/UX.",
      avatar: "https://via.placeholder.com/100?text=Trân",
      coverPhoto: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
      posts: [
        { listImage: [], createdAt: "2025-11-03", amountOfLike: 10, amountOfShare: 2, listCmt: [] }
      ]
    }
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
  useEffect(() => {
    if (showEdit) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showEdit]);
  
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
