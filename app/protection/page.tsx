"use client";

import { useState } from "react";
import axios from "axios";

import {
  Lock,
  EyeOff,
  ShieldCheck,
  KeyRound,
  RefreshCw
} from "lucide-react";

export default function ProtectionModePage() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [chatUnlocked, setChatUnlocked] = useState(false);

  const userId = "69fd35073407e82f7551e98a";

  // Enable protection
  const enableProtection = async () => {
    try {
      await axios.post(
        "https://securewave-backend-2.onrender.com/api/protection/set",
        {
          userId,
          password
        }
      );

      alert("Protection Mode Enabled");
    } catch (error) {
      console.log(error);
    }
  };

  // Unlock chats
  const unlockChats = async () => {
    try {
      await axios.post(
        "https://securewave-backend-2.onrender.com/api/protection/verify",
        {
          userId,
          password
        }
      );

      setChatUnlocked(true);

      alert("Chats Unlocked");
    } catch (error) {
      alert("Wrong Password");
    }
  };

  // Disable protection
  const disableProtection = async () => {
    try {
      await axios.post(
        "https://securewave-backend-2.onrender.com/api/protection/disable",
        {
          userId
        }
      );

      setChatUnlocked(false);

      alert("Protection Disabled");
    } catch (error) {
      console.log(error);
    }
  };

  // Reset password
  const resetPassword = async () => {
    try {
      await axios.post(
        "https://securewave-backend-2.onrender.com/api/protection/set",
        {
          userId,
          password: newPassword
        }
      );

      alert("Password Reset Successfully");
      setNewPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B141A] text-white p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-400">
          Protection Mode
        </h1>

        <p className="text-gray-400 mt-2">
          Protect chats on linked devices with extra privacy controls
        </p>
      </div>

      {/* Blurred Chat Preview */}
      <div className="bg-[#111B21] rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <EyeOff className="text-red-400" />
          <h2 className="text-xl font-semibold">
            Protected Chat Preview
          </h2>
        </div>

        {!chatUnlocked ? (
          <div className="bg-[#202C33] p-6 rounded-xl blur-sm select-none">
            <div className="space-y-4">
              <div className="bg-gray-700 h-10 w-1/2 rounded-lg"></div>
              <div className="bg-green-600 h-10 w-1/3 rounded-lg ml-auto"></div>
              <div className="bg-gray-700 h-10 w-1/2 rounded-lg"></div>
            </div>
          </div>
        ) : (
          <div className="bg-[#202C33] p-6 rounded-xl">
            <div className="space-y-4">
              <div className="bg-gray-700 p-3 rounded-lg">
                Hey, how are you?
              </div>

              <div className="bg-green-600 p-3 rounded-lg ml-auto w-fit">
                I'm good!
              </div>

              <div className="bg-gray-700 p-3 rounded-lg">
                Project meeting at 5 PM
              </div>
            </div>
          </div>
        )}

        <p className="text-gray-400 mt-4">
          Chats remain hidden until correct password is entered.
        </p>
      </div>

      {/* Password Unlock */}
      <div className="bg-[#111B21] rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <KeyRound className="text-blue-400" />
          <h2 className="text-xl font-semibold">
            Unlock Protected Chats
          </h2>
        </div>

        <input
          type="password"
          placeholder="Enter protection password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full bg-[#202C33] p-4 rounded-xl outline-none"
        />

        <button
          onClick={unlockChats}
          className="w-full mt-4 bg-green-500 py-3 rounded-xl hover:bg-green-600 transition"
        >
          Unlock Chats
        </button>
      </div>

      {/* Protection Settings */}
      <div className="bg-[#111B21] rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-yellow-400" />
          <h2 className="text-xl font-semibold">
            Protection Settings
          </h2>
        </div>

        <div className="space-y-4">
          <button
            onClick={enableProtection}
            className="w-full bg-[#202C33] py-3 rounded-xl hover:bg-[#2b3a42] transition"
          >
            Enable Protection Mode
          </button>

          <button
            onClick={disableProtection}
            className="w-full bg-[#202C33] py-3 rounded-xl hover:bg-[#2b3a42] transition"
          >
            Disable Protection Mode
          </button>
        </div>
      </div>

      {/* Reset Password */}
      <div className="bg-[#111B21] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw className="text-purple-400" />
          <h2 className="text-xl font-semibold">
            Reset Protection Password
          </h2>
        </div>

        <input
          type="password"
          placeholder="Create new password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
          className="w-full bg-[#202C33] p-4 rounded-xl outline-none"
        />

        <button
          onClick={resetPassword}
          className="w-full mt-4 bg-purple-500 py-3 rounded-xl hover:bg-purple-600 transition"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}