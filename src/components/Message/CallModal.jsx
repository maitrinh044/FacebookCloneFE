// src/components/CallModal.jsx
export default function CallModal({ type, friendName, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center w-80">
          <h2 className="text-lg font-semibold mb-2">
            {type === "voice" ? "Đang gọi thoại..." : "Đang gọi video..."}
          </h2>
          <p className="text-gray-600 mb-4">
            Đang kết nối với <strong>{friendName}</strong>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-full"
          >
            Kết thúc cuộc gọi
          </button>
        </div>
      </div>
    );
  }
  