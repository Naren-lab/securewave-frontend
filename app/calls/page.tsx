"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socket = io(
  "https://securewave-backend-2.onrender.com"
);

export default function VoiceCallPage() {
  const [stream, setStream] =
    useState<MediaStream | null>(null);

  const [me, setMe] =
    useState("");

  const [idToCall, setIdToCall] =
    useState("");

  const myAudio =
    useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
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
      )
      .catch((error) => {
        console.log(
          "Mic access error:",
          error
        );
      });

    socket.on(
      "me",
      (id: string) => {
        console.log(
          "My Call ID:",
          id
        );
        setMe(id);
      }
    );

    return () => {
      socket.off("me");
    };
  }, []);

  const callUser = () => {
    if (!idToCall) {
      alert(
        "Enter valid Call ID"
      );
      return;
    }

    alert(
      "Calling: " +
        idToCall
    );

    console.log(
      "Calling user:",
      idToCall
    );
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-6 font-bold">
        SecureWave Voice Call
      </h1>

      <p className="mb-2 text-lg">
        Your Call ID:
      </p>

      {/* Fixed visibility */}
      <input
        value={me}
        readOnly
        className="bg-white text-black p-3 rounded mb-4 w-80 text-center font-bold"
      />

      {/* Fixed visibility */}
      <input
        placeholder="Enter ID to call"
        value={idToCall}
        onChange={(e) =>
          setIdToCall(
            e.target.value
          )
        }
        className="bg-white text-black p-3 rounded mb-4 w-80 text-center"
      />

      <button
        onClick={callUser}
        className="bg-green-500 px-6 py-3 rounded text-white font-bold hover:bg-green-600"
      >
        Call
      </button>

      <audio
        ref={myAudio}
        autoPlay
        muted
      />
    </div>
  );
}