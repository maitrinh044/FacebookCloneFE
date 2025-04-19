import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJoinedGroup } from "../../services/UserService";

export default function GroupSidebar() {
  const [groups, setGroups] = useState([]);
  const { id: currentGroupId, userId } = useParams(); // userId có thể lấy từ URL nếu cần

  const currentUserId = localStorage.getItem("userId"); // 👈 Tạm hardcode, hoặc lấy từ context/state

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getJoinedGroup(currentUserId);
        if (data == null) {
          setGroups([]);
        } else {
          setGroups(data);
        }
      } catch (error) {
        console.error("Lỗi khi fetch nhóm:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="w-64 p-4 border-r h-full overflow-y-auto bg-white">
      <h2 className="text-lg font-semibold mb-4">Nhóm của bạn</h2>
      <ul className="space-y-2">
        {groups.map((group) => (
          <li key={group.groupID}>
            <Link
              to={`/groups/${group.groupID}`}
              className={`block px-3 py-2 rounded-lg hover:bg-blue-100 ${
                currentGroupId == group.groupID ? "bg-blue-100 text-blue-700" : "text-gray-700"
              }`}
            >
              {group.groupName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
