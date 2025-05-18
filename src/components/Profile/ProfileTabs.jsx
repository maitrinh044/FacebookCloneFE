import { FaEllipsisH } from "react-icons/fa";

// src/components/ProfileTabs.jsx
export default function ProfileTabs({ activeTab, setActiveTab }) {
    const tabs = [
        { key: "posts", label: "Bài viết" },
        { key: "about", label: "Giới thiệu" },
        { key: "photos", label: "Ảnh" },
    ];
    return (
        <div className="w-full max-w-[1000px] mx-auto overflow-x-auto">
            {/* Tabs + Icon */}
            <div className="flex justify-between items-center border-b border-gray-300 pt-20 px-4">
                {/* Tabs */}
                <div className="flex gap-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`pb-3 font-semibold transition-colors duration-200 ${
                                activeTab === tab.key
                                    ? "border-b-4 border-blue-600 text-blue-600"
                                    : "text-gray-600 hover:text-blue-500"
                            }`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Icon ... nằm bên phải */}
                <button className="bg-gray-100 hover:bg-gray-300 text-gray-700 p-2 rounded-md shadow-md transition-all duration-200 relative">
                    <FaEllipsisH className="w-6 h-4" />
                </button>
            </div>
        </div>
    );
}
