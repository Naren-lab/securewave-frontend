"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import {
  PhoneOff,
  Mic,
  Video
} from "lucide-react";

const socket = io(
  "https://securewave-backend-2.onrender.com",
  {
    transports: ["websocket"]
  }
);

export default function VideoCallPage() {
  const [stream, setStream] =
    useState<MediaStream | null>(null);

  const [currentUsername, setCurrentUsername] =
    useState("");

  const [usernameToCall, setUsernameToCall] =
    useState("");

  const [receivingCall, setReceivingCall] =
    useState(false);

  const [caller, setCaller] =
    useState("");

  const [callerSignal, setCallerSignal] =
    useState<any>(null);

  const [callAccepted, setCallAccepted] =
    useState(false);

  const [callEnded, setCallEnded] =
    useState(false);

  const myVideo =
    useRef<HTMLVideoElement | null>(null);

  const userVideo =
    useRef<HTMLVideoElement | null>(null);

  const connectionRef =
    useRef<any>(null);

  useEffect(() => {
    // Camera + mic access
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true
      })
      .then(
        (
          currentStream: MediaStream
        ) => {
          setStream(
            currentStream
          );

          if (
            myVideo.current
          ) {
            myVideo.current.srcObject =
              currentStream;
          }
        }
      )
      .catch((error) => {
        console.log(
          "Camera/Mic error:",
          error
        );
      });

    // Current logged user
    const currentUser =
      JSON.parse(
        localStorage.getItem(
          "user"
        ) || "{}"
      );

    setCurrentUsername(
      currentUser.name
    );

    socket.emit(
      "join_user",
      {
        userId:
          currentUser._id,
        username:
          currentUser.name
      }
    );

    // Receive call
    socket.on(
      "videoCallUser",
      (data) => {
        setReceivingCall(
          true
        );

        setCaller(
          data.from
        );

        setCallerSignal(
          data.signal
        );
      }
    );

    return () => {
      socket.off(
        "videoCallUser"
      );
    };
  }, []);

  /* CALL USER */
  const callUser = () => {
    if (
      !usernameToCall
    ) {
      alert(
        "Enter username"
      );
      return;
    }

    const peer =
      new Peer({
        initiator: true,
        trickle: false,
        stream:
          stream!
      });

    peer.on(
      "signal",
      (data) => {
        socket.emit(
          "videoCallUser",
          {
            usernameToCall:
              usernameToCall,
            signalData:
              data,
            from:
              currentUsername
          }
        );
      }
    );

    peer.on(
      "stream",
      (
        remoteStream
      ) => {
        if (
          userVideo.current
        ) {
          userVideo.current.srcObject =
            remoteStream;
        }
      }
    );

    socket.on(
      "videoCallAccepted",
      (
        signal
      ) => {
        setCallAccepted(
          true
        );

        peer.signal(
          signal
        );
      }
    );

    connectionRef.current =
      peer;
  };

  /* ANSWER CALL */
  const answerCall = () => {
    setCallAccepted(
      true
    );

    const peer =
      new Peer({
        initiator: false,
        trickle: false,
        stream:
          stream!
      });

    peer.on(
      "signal",
      (data) => {
        socket.emit(
          "answerVideoCall",
          {
            signal:
              data,
            to:
              caller
          }
        );
      }
    );

    peer.on(
      "stream",
      (
        remoteStream
      ) => {
        if (
          userVideo.current
        ) {
          userVideo.current.srcObject =
            remoteStream;
        }
      }
    );

    peer.signal(
      callerSignal
    );

    connectionRef.current =
      peer;
  };

  /* END CALL */
  const leaveCall = () => {
    setCallEnded(
      true
    );

    if (
      connectionRef.current
    ) {
      connectionRef.current.destroy();
    }
  };

  return (
    <div className="h-screen bg-black relative text-white">

      {/* Remote Video */}
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        {callAccepted ? (
          <video
            ref={userVideo}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <h1 className="text-3xl">
            Video Calling...
          </h1>
        )}
      </div>

      {/* Self Video */}
      <div className="absolute top-5 right-5 z-40 w-60 h-40 bg-gray-700 rounded-xl overflow-hidden shadow-lg">
        <video
          ref={myVideo}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* FIXED Username Input */}
      <div className="absolute top-5 left-5 z-50 flex gap-3 bg-[#1f1f1f] p-4 rounded-xl shadow-lg">
        
        <input
          placeholder="Enter username"
          value={usernameToCall}
          onChange={(e) =>
            setUsernameToCall(
              e.target.value
            )
          }
          className="bg-white text-black p-3 rounded w-64 outline-none"
        />

        <button
          onClick={callUser}
          className="bg-green-500 px-5 py-3 rounded font-bold hover:bg-green-600"
        >
          Call
        </button>
      </div>

      {/* Incoming call */}
      {receivingCall &&
        !callAccepted && (
          <div className="absolute top-24 left-5 z-50 bg-gray-800 p-4 rounded-xl shadow-lg">
            <p>
              Incoming call from{" "}
              {caller}
            </p>

            <button
              onClick={answerCall}
              className="bg-blue-500 px-4 py-2 rounded mt-2"
            >
              Answer
            </button>
          </div>
        )}

      {/* Controls */}
      {callAccepted &&
        !callEnded && (
          <div className="absolute bottom-10 w-full flex justify-center gap-8 z-50">
            <button className="bg-gray-700 p-4 rounded-full">
              <Mic />
            </button>

            <button className="bg-gray-700 p-4 rounded-full">
              <Video />
            </button>

            <button
              onClick={leaveCall}
              className="bg-red-500 p-4 rounded-full"
            >
              <PhoneOff />
            </button>
          </div>
        )}
    </div>
  );
}