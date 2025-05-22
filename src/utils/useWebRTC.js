import { useEffect, useRef } from "react";

export function useWebRTC({ isCaller, remoteSignal }) {
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);

  useEffect(() => {
    async function startCall() {
      localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      peerConnection.current = new RTCPeerConnection();

      localStream.current.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream.current);
      });

      peerConnection.current.ontrack = (event) => {
        remoteStream.current = event.streams[0];
        // Update remote video element
      };

      if (isCaller) {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        // send offer to remote via WebSocket
      } else {
        await peerConnection.current.setRemoteDescription(remoteSignal.offer);
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        // send answer back via WebSocket
      }
    }

    startCall();
  }, [isCaller, remoteSignal]);

  return {
    localStream: localStream.current,
    remoteStream: remoteStream.current,
  };
}
