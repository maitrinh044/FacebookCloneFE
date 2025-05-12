import { useState } from "react";
import PostAdmin from "../components/admin/PostAdmin";
import UserAdmin from "../components/admin/UserAdmin";

export default function WatchPage() {
    const tabAdmin = [
        { key: "post", label: "Quản lí bài viết" },
        { key: "user", label: "Quản lí người dùng" }
    ];
    const [activeTab, setActiveTab] = useState("post");
    
    return (
        <div className="flex flex-row h-screen mt-3">
            <div className="flex flex-col w-[300px] gap-3 p-4 bg-gray-200">
                {tabAdmin.map((tab) => (
                    <button
                        key={tab.key}
                        className={`p-3 flex justify-start items-center mt-1 mb-1 rounded-lg font-semibold transition-colors duration-200 hover:bg-gray-300 ${
                            activeTab === tab.key
                                ? "bg-blue-200 text-blue-600"
                                : "text-gray-600 hover:text-blue-500"
                        }`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="flex flex-col gap-3 p-4 w-screen">
                {/* Nội dung tab sẽ được hiển thị ở đây */}
                {activeTab === "post" && <PostAdmin/>}
                {activeTab === "user" && <UserAdmin/>}
            </div>
        </div>
    );
}
