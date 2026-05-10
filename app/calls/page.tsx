"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io(
  "https://securewave-backend-2.onrender.com",
  {
    transports: ["websocket"],
  }
);

export default function VoiceCallPage() {
  const [stream, setStream] =
    useState<MediaStream | null>(null);

  const [me, setMe] =
    useState("");

  const [usernameToCall, setUsernameToCall] =
    useState("");

  const [currentUsername, setCurrentUsername] =
    useState("");

  const myAudio =
    useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Get microphone access
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

    // Get logged in user
    const currentUser =
      JSON.parse(
        localStorage.getItem(
          "user"
        ) || "{}"
      );

    setCurrentUsername(
      currentUser.name
    );

    // Join socket
    socket.emit(
      "join_user",
      {
        userId:
          currentUser._id,
        username:
          currentUser.name,
      }
    );

    // Receive socket id
    socket.on(
      "me",
      (id: string) => {
        console.log(
          "My Socket ID:",
          id
        );
        setMe(id);
      }
    );

    // Incoming call
    socket.on(
      "callUser",
      (data) => {
        alert(
          `Incoming call from ${data.from}`
        );

        console.log(
          "Incoming call:",
          data
        );
      }
    );

    return () => {
      socket.off("me");
      socket.off(
        "callUser"
      );
    };
  }, []);

  const callUser = () => {
    if (
      !usernameToCall
    ) {
      alert(
        "Enter username"
      );
      return;
    }

    socket.emit(
      "callUser",
      {
        usernameToCall:
          usernameToCall,
        signalData:
          "voice-call-request",

        // FIXED → send username instead of socket id
        from:
          currentUsername,
      }
    );

    alert(
      `Calling ${usernameToCall}`
    );

    console.log(
      "Calling user:",
      usernameToCall
    );
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-6 font-bold">
        SecureWave Voice Call
      </h1>

      <p className="mb-2 text-lg">
        Your Username:
      </p>

      <input
        value={
          currentUsername
        }
        readOnly
        className="bg-white text-black p-3 rounded mb-4 w-80 text-center font-bold"
      />

      <p className="mb-2 text-lg">
        Your Socket ID:
      </p>

      <input
        value={me}
        readOnly
        className="bg-white text-black p-3 rounded mb-4 w-80 text-center"
      />

      <p className="mb-2 text-lg">
        Enter Username to Call:
      </p>

      <input
        placeholder="Enter username"
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
        onClick={callUser}
        className="bg-green-500 px-6 py-3 rounded text-white font-bold hover:bg-green-600"
      >
        Call User
      </button>

      <audio
        ref={myAudio}
        autoPlay
        muted
      />
    </div>
  );
}