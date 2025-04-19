export default function GroupTabs({ activeTab, setActiveTab }) {
    const tabs = [
      { key: "posts", label: "Bài viết" },
      { key: "members", label: "Thành viên" },
      { key: "photos", label: "Ảnh" },
      { key: "events", label: "Sự kiện" },
    ];
  
    return (
      <div className="flex gap-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`pb-2 font-medium ${
              activeTab === tab.key
                ? "text-blue-600 border-b-4 border-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }
  