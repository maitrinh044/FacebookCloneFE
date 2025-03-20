// src/components/ProfileTabContent.jsx
export default function ProfileTabContent({ activeTab, user }) {
    if (activeTab === "posts") {
      return (
        <>
          {user.posts.length > 0 ? (
            user.posts.map((post, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-md shadow-sm text-gray-700 mb-3"
              >
                {post}
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Chưa có bài viết nào.</p>
          )}
        </>
      );
    }
  
    if (activeTab === "about") {
      return (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-600">1.023 bạn bè</p>
            <div className="flex mt-2 gap-2">
              {[...Array(6)].map((_, i) => (
                <img
                  key={i}
                  src={`https://randomuser.me/api/portraits/thumb/men/${i + 10}.jpg`}
                  alt="Friend"
                  className="w-10 h-10 rounded-full object-cover border border-white"
                />
              ))}
            </div>
          </div>
          <div className="text-gray-700">
            <p>Sở thích: Lập trình, thiết kế UI, đọc sách.</p>
            <p>Nghề nghiệp: Frontend Developer</p>
            <p>Ngày sinh: 01/01/2000</p>
          </div>
        </>
      );
    }
  
    if (activeTab === "photos") {
      return (
        <div className="grid grid-cols-3 gap-4">
          <img
            src={user.avatar}
            alt="Ảnh 1"
            className="w-full h-48 object-cover rounded-md"
          />
          <img
            src={user.coverPhoto}
            alt="Ảnh 2"
            className="w-full h-48 object-cover rounded-md"
          />
          <img
            src="https://via.placeholder.com/300x200"
            alt="Ảnh 3"
            className="w-full h-48 object-cover rounded-md"
          />
        </div>
      );
    }
  
    return null;
  }
  