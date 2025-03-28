import { FaTimes } from "react-icons/fa";

export default function NotificationPopup({ notifications, onClose }) {
  return (
    <div className="absolute right-0 top-12 w-96 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h4 className="text-lg font-bold">Thông báo</h4>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button className="flex-1 text-center py-2 font-medium text-blue-600 border-b-2 border-blue-600">
          Tất cả
        </button>
        <button className="flex-1 text-center py-2 text-gray-500 hover:text-black">
          Chưa đọc
        </button>
      </div>

      {/* Nội dung thông báo */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Không có thông báo mới</p>
        ) : (
          notifications.map((noti, index) => (
            <div key={index} className="p-4 flex items-start hover:bg-gray-100 cursor-pointer">
              <img
                src={noti.avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full mr-3"
              />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{noti.name}</span> {noti.message}
                </p>
                <p className="text-xs text-gray-400">{noti.time}</p>
                {noti.action && (
                  <div className="mt-2 flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md">
                      {noti.action.accept}
                    </button>
                    <button className="px-3 py-1 bg-gray-300 text-xs rounded-md">
                      {noti.action.reject}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
