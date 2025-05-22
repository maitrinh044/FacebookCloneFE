// CallModal.jsx
import React from "react";

export default function CallModal({ caller, receiver, callType, onAccept, onReject }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Cuộc gọi đến</h2>
        <p className="mb-4">
          <strong>{caller?.firstName || caller?.name || "Người gọi"}</strong> đang gọi bạn{" "}
          <span className="font-bold">{callType === "video" ? "video" : "thoại"}</span>.
        </p>
        <div className="flex justify-around gap-4">
          <button
            onClick={onAccept}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Chấp nhận
          </button>
          <button
            onClick={onReject}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Từ chối
          </button>
        </div>
      </div>
    </div>
  );
}
