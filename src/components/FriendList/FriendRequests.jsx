import { useState } from "react";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import { message } from "antd";
import Sidebar from "./Sidebar";

const mockFriendRequests = [
  { id: 1, name: "Mỹ Trân", mutuals: 5, avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Bé Pu", mutuals: 3, avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Phan Nhi", mutuals: 8, avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Dambakly Allen", mutuals: 2, avatar: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "Mai Ngọc", mutuals: 4, avatar: "https://i.pravatar.cc/150?img=5" },
];

export default function FriendRequests() {
  const [requests, setRequests] = useState(mockFriendRequests);

  const handleAccept = (id) => {
    setRequests(requests.filter((request) => request.id !== id));
    message.success("Đã chấp nhận lời mời kết bạn");
    // Here you can add further logic to handle the acceptance, e.g., updating the backend
  };

  const handleDelete = (id) => {
    setRequests(requests.filter((request) => request.id !== id));
    message.success("Đã từ chối lời mời kết bạn");
    // Here you can add further logic to handle the deletion, e.g., notifying the backend
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Lời mời kết bạn ({requests.length})</h2>
            <button className="text-blue-500 hover:underline">Xem tất cả</button>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Không có lời mời kết bạn nào</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <div key={request.id} className="bg-gray-50 p-4 rounded-lg shadow flex flex-col items-center">
                  <img
                    src={request.avatar}
                    alt={request.name}
                    className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-blue-500"
                  />
                  <h3 className="font-semibold text-lg text-gray-900 text-center">{request.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{request.mutuals} bạn chung</p>
                  <div className="mt-4 flex space-x-2 w-full">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center gap-2"
                    >
                      <FaUserCheck /> Xác nhận
                    </button>
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition flex items-center justify-center gap-2"
                    >
                      <FaUserTimes /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}