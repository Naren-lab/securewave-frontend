"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socket = io(
  "https://securewave-backend-2.onrender.com",
  {
    transports: ["websocket"],
  }
);

export default function VoiceCallPage() {
  const [stream, setStream] =
    useState<MediaStream | null>(null);

  const [usernameToCall, setUsernameToCall] =
    useState("");

  const [currentUsername, setCurrentUsername] =
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

  const myAudio =
    useRef<HTMLAudioElement | null>(null);

  const userAudio =
    useRef<HTMLAudioElement | null>(null);

  const connectionRef =
    useRef<any>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
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
            myAudio.current
          ) {
            myAudio.current.srcObject =
              currentStream;
          }
        }
      );

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

    // Incoming call
    socket.on(
      "callUser",
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
        "callUser"
      );
    };
  }, []);

  // CALL USER
  const callUser = () => {
    const peer =
      new Peer({
        initiator: true,
        trickle: false,
        stream:
          stream!,
      });

    peer.on(
      "signal",
      (data) => {
        socket.emit(
          "callUser",
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
          userAudio.current
        ) {
          userAudio.current.srcObject =
            remoteStream;
        }
      }
    );

    socket.on(
      "callAccepted",
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

  // ANSWER CALL
  const answerCall = () => {
    setCallAccepted(
      true
    );

    const peer =
      new Peer({
        initiator: false,
        trickle: false,
        stream:
          stream!,
      });

    peer.on(
      "signal",
      (data) => {
        socket.emit(
          "answerCall",
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
          userAudio.current
        ) {
          userAudio.current.srcObject =
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

  // END CALL
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
    <div className="h-screen bg-black text-white flex flex-col justify-center items-center">

      <h1 className="text-4xl mb-6 font-bold">
        SecureWave Real-Time Voice Call
      </h1>

      <p className="mb-2">
        Logged in as:
      </p>

      <input
        value={
          currentUsername
        }
        readOnly
        className="bg-white text-black p-3 rounded mb-4 w-80 text-center"
      />

      <input
        placeholder="Enter username to call"
        value={
          usernameToCall
        }
        onChange={(e) =>
          setUsernameToCall(
            e.target.value
          )
        }
        className="bg-white text-black p-3 rounded mb-4 w-80 text-center"
      />

      <button
        onClick={
          callUser
        }
        className="bg-green-500 px-6 py-3 rounded"
      >
        Call
      </button>

      {receivingCall &&
        !callAccepted && (
          <div className="mt-6">
            <h2>
              Incoming call
              from{" "}
              {
                caller
              }
            </h2>

            <button
              onClick={
                answerCall
              }
              className="bg-blue-500 px-6 py-2 rounded mt-2"
            >
              Answer
            </button>
          </div>
        )}

      {callAccepted &&
        !callEnded && (
          <button
            onClick={
              leaveCall
            }
            className="bg-red-500 px-6 py-2 rounded mt-4"
          >
            End Call
          </button>
        )}

      {/* Local audio */}
      <audio
        ref={
          myAudio
        }
        autoPlay
        muted
      />

      {/* Remote audio */}
      <audio
        ref={
          userAudio
        }
        autoPlay
      />
    </div>
  );
}