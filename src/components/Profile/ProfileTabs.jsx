// src/components/ProfileTabs.jsx
export default function ProfileTabs({ activeTab, setActiveTab }) {
    const tabs = [
      { key: "posts", label: "Bài viết" },
      { key: "about", label: "Giới thiệu" },
      { key: "photos", label: "Ảnh" },
    ];
  
    return (
      <div className="flex gap-6 border-b border-gray-300 mb-6 pt-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`pb-2 font-semibold ${
              activeTab === tab.key
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }
  