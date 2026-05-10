"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RecoverMainPage() {
  const router = useRouter();

  const [password, setPassword] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [deviceId, setDeviceId] =
    useState("");

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("user") ||
            localStorage.getItem(
              "pendingUser"
            ) ||
            "{}"
        )
      : {};

  const userId = currentUser?._id;

  //-----------------------------------
  // Find current device
  //-----------------------------------
  useEffect(() => {
    const fetchCurrentDevice =
      async () => {
        try {
          const res =
            await axios.get(
              `https://securewave-backend-2.onrender.com/api/devices/${userId}`
            );

          const currentDevice =
            res.data.find(
              (device: any) =>
                device.deviceName ===
                navigator.userAgent
            );

          if (currentDevice) {
            setDeviceId(
              currentDevice._id
            );
          }
        } catch (error) {
          console.log(error);
        }
      };

    if (userId) {
      fetchCurrentDevice();
    }
  }, [userId]);

  //-----------------------------------
  // Make device main
  //-----------------------------------
  const handleRecoverMain =
    async () => {
      try {
        if (
          !password ||
          !otp
        ) {
          alert(
            "Enter password and OTP"
          );
          return;
        }

        if (!deviceId) {
          alert(
            "Current device not found"
          );
          return;
        }

        setLoading(true);

        await axios.post(
          "https://securewave-backend-2.onrender.com/api/devices/make-main",
          {
            userId,
            deviceId,
            password,
            otp
          }
        );

        alert(
          "This device is now your MAIN DEVICE"
        );

        router.push(
          "/dashboard"
        );

      } catch (
        error: any
      ) {
        console.log(
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Recovery failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#0B141A] text-white flex justify-center items-center">
      <div className="bg-[#111B21] p-10 rounded-xl w-[450px]">

        <h1 className="text-3xl font-bold text-red-400 text-center mb-3">
          Recover Main Device
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Lost your original main device?
          Verify ownership and make this device the new main device.
        </p>

        {/* Password */}
        <input
          type="password"
          placeholder="Enter account password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full p-3 rounded-lg text-black mb-4"
        />

        {/* OTP */}
        <input
          type="text"
          placeholder="Enter Google OTP"
          value={otp}
          onChange={(e) =>
            setOtp(
              e.target.value
            )
          }
          className="w-full p-3 rounded-lg text-black mb-4"
        />

        <button
          onClick={
            handleRecoverMain
          }
          className="w-full bg-red-500 py-3 rounded-lg font-bold"
        >
          {loading
            ? "Processing..."
            : "Make This Device Main"}
        </button>

        <p className="text-center text-gray-400 mt-4 text-sm">
          Demo OTP:
          <span className="text-green-400 ml-2">
            123456
          </span>
        </p>

        <button
          onClick={() =>
            router.push(
              "/private-space/link"
            )
          }
          className="w-full mt-4 bg-gray-700 py-2 rounded-lg"
        >
          Back
        </button>
      </div>
    </div>
  );
}