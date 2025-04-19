// src/components/group/GroupMembers.jsx
import { useEffect, useState } from "react";
import { getGroupMember } from "../../services/GroupService";

export default function GroupMembers({ groupId }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getGroupMember(groupId);
        setMembers(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thành viên:", error);
      }
    };

    if (groupId) {
      fetchMembers();
    }
  }, [groupId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.length > 0 ? (
        members.map((member) => (
          <div
            key={member.id}
            className="bg-white p-4 rounded-xl shadow flex items-center"
          >
            <img
              src={
                member.profilePicture
                  ? member.profilePicture
                  : "/default-avatar.png"
              }
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div className="font-medium text-base">
              {member.firstName} {member.lastName}
            </div>
          </div>
        ))
      ) : (
        <p className="col-span-full text-gray-500">Không có thành viên nào.</p>
      )}
    </div>
  );
}

