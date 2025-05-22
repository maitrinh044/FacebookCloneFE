// CallModalWrapper.jsx
import { useCall } from "../../contexts/CallContext";
import CallModal from "./CallModal";
import CallOverlay from "./CallOverlay";

export default function CallModalWrapper() {
  const {
    incomingSignal,
    callInfo,
    acceptCall,
    rejectCall,
    endCall,
    currentUserId,
    localStream,
    remoteStream,
  } = useCall();

  // Khi có cuộc gọi đến (incomingSignal) nhưng chưa xử lý (chưa accept/reject)
  if (incomingSignal && !callInfo) {
    return (
      <CallModal
        caller={incomingSignal.from}
        receiver={{ id: currentUserId }}
        callType={incomingSignal.callType}
        onAccept={acceptCall}
        onReject={rejectCall}
      />
    );
  }

  // Khi đã chấp nhận cuộc gọi (callInfo) và đang trong cuộc gọi
  if (callInfo) {
    const friend =
      callInfo.caller.id === currentUserId ? callInfo.receiver : callInfo.caller;

    return (
      <CallOverlay
        friend={friend}
        isVideo={callInfo.callType === "video"}
        localStream={localStream}
        remoteStream={remoteStream}
        onEndCall={endCall}
      />
    );
  }

  // Không có cuộc gọi đến hoặc đang gọi
  return null;
}
