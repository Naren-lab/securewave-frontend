"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socket = io("https://securewave-backend-2.onrender.com");

export default function VoiceCallPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [me, setMe] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<any>(null);

  const myAudio = useRef<HTMLAudioElement | null>(null);
  const userAudio = useRef<HTMLAudioElement | null>(null);
  const connectionRef = useRef<any>(null);

  useEffect(() => {
    // Get microphone access
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        if (myAudio.current) {
          myAudio.current.srcObject = currentStream;
        }
      })
      .catch((error) => {
        console.log("Microphone permission denied:", error);
        alert("Please allow microphone access.");
      });

    // Receive own socket id
    socket.on("me", (id: string) => {
  console.log("Received Socket ID:", id);
  setMe(id);
});

    // Incoming call
    socket.on("callUser", (data: any) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    return () => {
      socket.off("me");
      socket.off("callUser");
      socket.off("callAccepted");
    };
  }, []);

  // Call another user
  const callUser = (id: string) => {
    if (!id) {
      alert("Enter valid Call ID");
      return;
    }

    if (!stream) {
      alert("Microphone not connected");
      return;
    }

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (data: any) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
      });
    });

    peer.on("stream", (currentStream: MediaStream) => {
      if (userAudio.current) {
        userAudio.current.srcObject = currentStream;
      }
    });

    socket.on("callAccepted", (signal: any) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  // Answer incoming call
  const answerCall = () => {
    if (!stream) return;

    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (data: any) => {
      socket.emit("answerCall", {
        signal: data,
        to: caller,
      });
    });

    peer.on("stream", (currentStream: MediaStream) => {
      if (userAudio.current) {
        userAudio.current.srcObject = currentStream;
      }
    });

    peer.signal(callerSignal);

    connectionRef.current = peer;
  };

  // End call
  const leaveCall = () => {
    setCallEnded(true);

    if (connectionRef.current) {
      connectionRef.current.destroy();
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    window.location.reload();
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 font-bold">
        SecureWave Voice Call
      </h1>

      {/* Your ID */}
      <div className="mb-4">
        <p className="mb-2">Your Call ID:</p>
        <input
          value={me}
          readOnly
          className="text-black p-2 rounded w-[300px]"
        />
      </div>

      {/* Call another user */}
      <div className="mb-4">
        <input
          placeholder="Enter ID to call"
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
          className="text-black p-2 rounded w-[300px]"
        />
      </div>

      <button
        onClick={() => callUser(idToCall)}
        className="bg-green-500 px-6 py-2 rounded mb-4"
      >
        Call
      </button>

      {/* Incoming call */}
      {receivingCall && !callAccepted && (
        <div className="text-center">
          <h2 className="mb-3 text-xl">
            Incoming Call...
          </h2>

          <button
            onClick={answerCall}
            className="bg-blue-500 px-6 py-2 rounded"
          >
            Answer
          </button>
        </div>
      )}

      {/* End call */}
      {callAccepted && !callEnded && (
        <button
          onClick={leaveCall}
          className="bg-red-500 px-6 py-2 rounded mt-4"
        >
          End Call
        </button>
      )}

      {/* Audio elements */}
      <audio ref={myAudio} autoPlay muted />
      <audio ref={userAudio} autoPlay />
    </div>
  );
}