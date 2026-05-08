"use client";

import { QrCode, KeyRound, UserPlus, Camera } from "lucide-react";

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-[#0B141A] text-white p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-400">
          QR Contact System
        </h1>
        <p className="text-gray-400 mt-2">
          Add contacts securely without syncing phone numbers
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">

        {/* QR Scanner Section */}
        <div className="bg-[#111B21] rounded-2xl p-6 shadow-lg">

          <div className="flex items-center gap-3 mb-6">
            <QrCode className="text-green-400" />
            <h2 className="text-xl font-semibold">
              Scan QR Code
            </h2>
          </div>

          {/* Camera Placeholder */}
          <div className="h-64 bg-[#202C33] rounded-xl flex flex-col items-center justify-center">
            <Camera size={50} className="text-gray-400" />

            <p className="text-gray-400 mt-4">
              Webcam QR Scanner Area
            </p>
          </div>

          <button className="w-full mt-6 bg-green-500 py-3 rounded-xl font-semibold hover:bg-green-600 transition">
            Start Scanner
          </button>
        </div>

        {/* Passkey Section */}
        <div className="bg-[#111B21] rounded-2xl p-6 shadow-lg">

          <div className="flex items-center gap-3 mb-6">
            <KeyRound className="text-blue-400" />
            <h2 className="text-xl font-semibold">
              Enter Passkey
            </h2>
          </div>

          <input
            type="text"
            placeholder="Enter unique passkey"
            className="w-full bg-[#202C33] p-4 rounded-xl outline-none"
          />

          <button className="w-full mt-6 bg-blue-500 py-3 rounded-xl font-semibold hover:bg-blue-600 transition">
            Send Request
          </button>
        </div>
      </div>

      {/* My QR Code */}
      <div className="mt-10 bg-[#111B21] rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          My SecureWave QR
        </h2>

        <div className="flex flex-col items-center">
          <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center text-black font-bold">
            QR CODE
          </div>

          <p className="mt-4 text-gray-400">
            User ID: SWX-23894
          </p>

          <p className="text-gray-400">
            Passkey: SECURE-7842
          </p>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="mt-10 bg-[#111B21] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <UserPlus className="text-yellow-400" />
          <h2 className="text-xl font-semibold">
            Pending Requests
          </h2>
        </div>

        <div className="space-y-4">

          <div className="bg-[#202C33] p-4 rounded-xl flex justify-between items-center">
            <div>
              <h3>Alex Johnson</h3>
              <p className="text-sm text-gray-400">
                Wants to connect with you
              </p>
            </div>

            <div className="flex gap-3">
              <button className="bg-green-500 px-4 py-2 rounded-lg">
                Accept
              </button>

              <button className="bg-red-500 px-4 py-2 rounded-lg">
                Reject
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}