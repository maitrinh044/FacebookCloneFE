
import { useState, useEffect } from "react";
import { FaUserCheck, FaTimes } from "react-icons/fa";
import { message } from "antd";
import Sidebar from "./Sidebar";
import FriendlistService from "../../services/FriendlistService";

export default function FriendRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch lời mời kết bạn khi component mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await FriendlistService.getFriendRequests();
        setRequests(data);
      } catch (error) {
        message.error("Không thể tải lời mời kết bạn");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Chấp nhận lời mời kết bạn
  const handleAccept = async (id) => {
    try {
      await FriendlistService.acceptFriendRequest(id);
      setRequests(requests.filter(req => req.id !== id));
      message.success("Đã chấp nhận lời mời");
    } catch (error) {
      message.error("Lỗi khi chấp nhận lời mời");
    }
  };

  // Từ chối lời mời kết bạn
  const handleDecline = async (id) => {
    try {
      await FriendlistService.declineFriendRequest(id);
      setRequests(requests.filter(req => req.id !== id));
      message.success("Đã từ chối lời mời");
    } catch (error) {
      message.error("Lỗi khi từ chối lời mời");
    }
  };

  return (

    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Lời mời kết bạn ({requests.length})</h2>


          {loading ? (
            <p className="text-gray-500 text-center py-4">Đang tải...</p>
          ) : requests.length === 0 ? (

            <p className="text-gray-500 text-center py-4">Không có lời mời nào</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map(request => (
                <div key={request.id} className="bg-gray-50 p-4 rounded-lg shadow">

                  <img
                    src={request.avatar}

                    alt={request.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-blue-500"
                  />
                  <h3 className="text-center font-medium">{request.name}</h3>
                  <p className="text-center text-sm text-gray-500 mb-3">
                    {request.mutuals} bạn chung
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition flex items-center justify-center gap-2"


                    >
                      <FaUserCheck /> Xác nhận
                    </button>
                    <button


                      onClick={() => handleDecline(request.id)}
                      className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300 transition flex items-center justify-center gap-2"
                    >
                      <FaTimes /> Xóa


                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

