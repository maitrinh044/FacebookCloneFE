// CallOverlay.jsx
import React, { useRef, useEffect } from "react";
import { FaPhoneSlash, FaVideo, FaMicrophone } from "react-icons/fa";

export default function CallOverlay({ friend, isVideo, localStream, remoteStream, onEndCall }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Gán stream vào video element khi có thay đổi
  useEffect(() => {
    if (isVideo) {
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    }
  }, [localStream, remoteStream, isVideo]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4 text-white">
      <h2 className="text-2xl mb-4">{friend?.firstName || "Bạn"}</h2>

      {isVideo ? (
        <div className="flex gap-4">
          {/* Remote video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-96 h-72 rounded-lg bg-gray-900"
          />
          {/* Local video nhỏ */}
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-32 h-24 rounded-lg bg-gray-700 border-2 border-white"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <FaMicrophone size={80} className="text-green-400" />
          <p>Cuộc gọi thoại đang diễn ra...</p>
        </div>
      )}

      <button
        onClick={onEndCall}
        className="mt-6 bg-red-600 hover:bg-red-700 rounded-full p-4 flex items-center gap-2"
        title="Kết thúc cuộc gọi"
      >
        <FaPhoneSlash size={20} />
        <span>Kết thúc</span>
      </button>
    </div>
  );
}
