import { useState, useEffect, useRef } from "react";
import { useCallSocket } from "./useCallSocket";

export function useCallHandler(currentUserId) {
  const [callInfo, setCallInfo] = useState(null);
  const [incomingSignal, setIncomingSignal] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const peerConnection = useRef(null);

  // ... your existing sendSignal and signal handling code ...

  // Khởi tạo WebRTC peer connection
  const initPeerConnection = async (callType) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({
          type: "ice-candidate",
          candidate: event.candidate,
          to: callInfo.receiver || callInfo.caller,
          from: { id: currentUserId },
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    // Lấy stream từ camera hoặc mic tùy callType
    const constraints =
      callType === "video"
        ? { video: true, audio: true }
        : { audio: true };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    setLocalStream(stream);

    stream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, stream);
    });
  };

  // Tạo offer và gửi tín hiệu
  const createOffer = async (receiver, callType) => {
    await initPeerConnection(callType);

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    sendSignal({
      type: "offer",
      sdp: offer,
      to: receiver,
      from: { id: currentUserId },
      callType,
    });
  };

  // Tạo answer khi nhận offer
  const createAnswer = async (offerSignal) => {
    await initPeerConnection(offerSignal.callType);

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offerSignal.sdp)
    );
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    sendSignal({
      type: "answer",
      sdp: answer,
      to: offerSignal.from,
      from: { id: currentUserId },
      callType: offerSignal.callType,
    });
  };

  // Xử lý tín hiệu nhận được để điều khiển WebRTC
  const handleSignal = async (signal) => {
    switch (signal.type) {
      case "call":
        setIncomingSignal(signal);
        break;
      case "accept":
        setCallInfo({
          caller: signal.from,
          receiver: { id: currentUserId },
          callType: signal.callType,
        });
        await createOffer(signal.from, signal.callType);
        setIncomingSignal(null);
        break;
      case "offer":
        await createAnswer(signal);
        break;
      case "answer":
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(signal.sdp)
        );
        break;
      case "ice-candidate":
        if (signal.candidate) {
          try {
            await peerConnection.current.addIceCandidate(signal.candidate);
          } catch (err) {
            console.error("Lỗi thêm ICE candidate:", err);
          }
        }
        break;
      case "end":
      case "reject":
        endCall();
        break;
      default:
        console.warn("Tín hiệu không xác định:", signal);
    }
  };

  // Thay đổi useCallSocket để gọi handleSignal khi nhận tín hiệu
  const { sendSignal } = useCallSocket({
    userId: currentUserId,
    onSignalReceived: handleSignal,
  });

  // Các hàm startCall, acceptCall, rejectCall, endCall gọi sendSignal tương tự, 
  // nhưng startCall nên gọi trực tiếp sendSignal({type: "call", ...}) rồi chờ accept/offer

  const startCall = (receiver, callType) => {
    sendSignal({
      type: "call",
      from: { id: currentUserId },
      to: receiver,
      callType,
    });
    setCallInfo({ caller: { id: currentUserId }, receiver, callType });
    setIncomingSignal(null);
  };

  const acceptCall = () => {
    if (!incomingSignal) return;

    sendSignal({
      type: "accept",
      from: { id: currentUserId },
      to: incomingSignal.from,
      callType: incomingSignal.callType,
    });

    setCallInfo({
      caller: incomingSignal.from,
      receiver: { id: currentUserId },
      callType: incomingSignal.callType,
    });

    setIncomingSignal(null);
  };

  const rejectCall = () => {
    if (!incomingSignal) return;

    sendSignal({
      type: "reject",
      to: incomingSignal.from,
    });

    setIncomingSignal(null);
  };

  const endCall = () => {
    if (!callInfo) return;

    sendSignal({
      type: "end",
      to: callInfo.receiver,
    });

    setCallInfo(null);
    setLocalStream(null);
    setRemoteStream(null);

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
  };

  return {
    callInfo,
    incomingSignal,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    localStream,
    remoteStream,
  };
}
