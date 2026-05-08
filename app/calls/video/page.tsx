"use client";

import {
  PhoneOff,
  Mic,
  Video
} from "lucide-react";

export default function VideoCallPage() {
  return (
    <div className="h-screen bg-black relative text-white">

      {/* Main video */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-3xl">
          Video Calling...
        </h1>
      </div>

      {/* Small self preview */}
      <div className="absolute top-5 right-5 w-48 h-32 bg-gray-700 rounded-xl"></div>

      {/* Controls */}
      <div className="absolute bottom-10 w-full flex justify-center gap-8">
        <button className="bg-gray-700 p-4 rounded-full">
          <Mic />
        </button>

        <button className="bg-gray-700 p-4 rounded-full">
          <Video />
        </button>

        <button className="bg-red-500 p-4 rounded-full">
          <PhoneOff />
        </button>
      </div>
    </div>
  );
}