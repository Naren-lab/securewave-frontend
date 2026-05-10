"use client";

import { useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LinkDevicePage() {
  const router = useRouter();

  const [scannedResult, setScannedResult] =
    useState("");

  const [manualCode, setManualCode] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [scannerStarted, setScannerStarted] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [otp, setOtp] =
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
  // Start QR Scanner
  //-----------------------------------
  const startScanner = () => {
    if (scannerStarted) {
      alert("Scanner already running");
      return;
    }

    setScannerStarted(true);

    const scanner =
      new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: 250
        },
        false
      );

    scanner.render(
      async (decodedText) => {
        try {
          setScannedResult(decodedText);

          scanner.clear();
          setScannerStarted(false);

          setLoading(true);

          await axios.post(
            "https://securewave-backend-2.onrender.com/api/devices/link",
            {
              userId,
              deviceName:
                navigator.userAgent,
              deviceType:
                "Browser"
            }
          );

          alert(
            "QR request sent to main device"
          );
        } catch (error) {
          console.log(error);
          alert(
            "QR link failed"
          );
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  //-----------------------------------
  // Manual Link
  //-----------------------------------
  const requestManualLink =
    async () => {
      try {
        if (!manualCode) {
          alert(
            "Enter manual code"
          );
          return;
        }

        setLoading(true);

        await axios.post(
          "https://securewave-backend-2.onrender.com/api/devices/link",
          {
            userId,
            deviceName:
              navigator.userAgent,
            deviceType:
              "Browser"
          }
        );

        alert(
          "Manual link request sent"
        );

        setManualCode("");
      } catch (error) {
        console.log(error);
        alert(
          "Manual link failed"
        );
      } finally {
        setLoading(false);
      }
    };

  //-----------------------------------
  // Upload QR
  //-----------------------------------
  const handleImageUpload = (
    e: any
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    alert(
      `${file.name} uploaded successfully`
    );
  };

  //-----------------------------------
  // Make device main
  //-----------------------------------
  const makeThisDeviceMain =
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

        setLoading(true);

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

        if (
          !currentDevice
        ) {
          alert(
            "Current device not found. Link this device first."
          );
          return;
        }

        await axios.post(
          "https://securewave-backend-2.onrender.com/api/devices/make-main",
          {
            userId,
            deviceId:
              currentDevice._id,
            password,
            otp
          }
        );

        alert(
          "This device is now MAIN DEVICE"
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
            "Failed to make device main"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#0B141A] text-white p-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Link New Device
        </h1>

        <button
          onClick={() =>
            router.push(
              "/private-space"
            )
          }
          className="bg-gray-700 px-5 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-8">

        {/* QR Scanner */}
        <div className="bg-[#111B21] p-6 rounded-xl">
          <h2 className="text-xl mb-4 font-bold">
            Scan QR
          </h2>

          <button
            onClick={
              startScanner
            }
            className="bg-green-500 px-6 py-3 rounded-lg w-full"
          >
            Start Scanner
          </button>

          <div
            id="reader"
            className="mt-5"
          ></div>
        </div>

        {/* Manual Code */}
        <div className="bg-[#111B21] p-6 rounded-xl">
          <h2 className="text-xl mb-4 font-bold">
            Manual Code
          </h2>

          <input
            type="text"
            value={
              manualCode
            }
            onChange={(e) =>
              setManualCode(
                e.target.value
              )
            }
            placeholder="Enter code"
            className="w-full p-3 rounded-lg text-black"
          />

          <button
            onClick={
              requestManualLink
            }
            className="mt-4 bg-blue-500 px-6 py-2 rounded-lg w-full"
          >
            Submit
          </button>
        </div>

        {/* Upload QR */}
        <div className="bg-[#111B21] p-6 rounded-xl">
          <h2 className="text-xl mb-4 font-bold">
            Upload QR
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageUpload
            }
          />
        </div>

        {/* Make Main */}
        <div className="bg-[#111B21] p-6 rounded-xl">
          <h2 className="text-xl mb-4 font-bold text-red-400">
            Lost Main Device?
          </h2>

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full p-3 rounded-lg text-black mb-4"
          />

          <input
            type="text"
            placeholder="Enter OTP"
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
              makeThisDeviceMain
            }
            className="w-full bg-red-500 py-3 rounded-lg"
          >
            Make This Device Main
          </button>

          <p className="text-gray-400 text-sm mt-3">
            Test OTP: 123456
          </p>
        </div>
      </div>

      {loading && (
        <div className="mt-8 text-center text-green-400">
          Processing...
        </div>
      )}
    </div>
  );
}