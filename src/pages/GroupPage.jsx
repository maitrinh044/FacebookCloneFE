import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import GroupTabs from "../components/Group/GroupTabs";
import GroupMembers from "../components/Group/GroupMembers.jsx";
import GroupPosts from "../components/Group/GroupPosts";
import GroupPhotos from "../components/Group/GroupPhotos";
import GroupEvents from "../components/Group/GroupEvents";
import GroupSidebar from "../components/Group/GroupSidebar";

import { getGroupById } from "../services/GroupService.jsx";
import { getGroupMemberCount } from "../services/GroupService.jsx";

import { useLoading } from "../contexts/LoadingContext";

export default function GroupPage() {
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("posts");
  const { id: groupId } = useParams();

  const [groupInfo, setGroupInfo] = useState(null);

  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const fetchGroupData = async () => {
      setLoading(true);
      try {
        const [groupData, count] = await Promise.all([
          getGroupById(groupId),
          getGroupMemberCount(groupId),
        ]);
        setGroupInfo(groupData);
        setMemberCount(count);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu nhóm:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);
  

  const getVisibilityLabel = (visibility) => {
    switch (visibility) {
      case "PRIVATE":
        return "Riêng tư";
      case "PUBLIC":
        return "Công khai";
      case "HIDDEN":
        return "Ẩn";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="flex mt-20">
      {/* Sidebar nhóm */}
      <div className="w-64 border-r h-[calc(100vh-80px)] fixed left-0 top-20 bg-white">
        <GroupSidebar />
      </div>

      {/* Nội dung chính */}
      <div className="ml-64 flex-1 px-6">
        {/* Cover Group Info */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <h1 className="text-2xl font-bold">
            {groupInfo ? groupInfo.groupName : "Đang tải..."}
          </h1>
          <p className="text-gray-600">
            {groupInfo ? `${getVisibilityLabel(groupInfo.visibility)} · ${memberCount} thành viên` : ""}
          </p>
        </div>

        {/* Tabs */}
        <GroupTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Nội dung theo tab */}
        <div className="mt-4">
          {activeTab === "members" && <GroupMembers groupId={groupId} />}
          {activeTab === "posts" && <GroupPosts groupId={groupId} />}
          {activeTab === "photos" && <GroupPhotos groupId={groupId} />}
          {activeTab === "events" && <GroupEvents groupId={groupId} />}
        </div>
      </div>
    </div>
  );
}
