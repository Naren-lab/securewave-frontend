"use client";

import { useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

export default function LinkDevicePage() {
  const [scannedResult, setScannedResult] =
    useState("");

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("user") || "{}"
        )
      : {};

  const userId = currentUser?._id;

  const startScanner = () => {
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
      (decodedText) => {
        setScannedResult(
          decodedText
        );

        scanner.clear();
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const requestDeviceLink =
    async () => {
      try {
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
          "Device request sent to main device"
        );
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-3xl mb-8">
        Link New Device
      </h1>

      <button
        onClick={startScanner}
        className="bg-green-500 px-6 py-3 rounded-lg"
      >
        Scan QR Using Camera
      </button>

      <div
        id="reader"
        className="mt-6"
      ></div>

      {scannedResult && (
        <div className="mt-6">
          <p>
            QR Scanned:
          </p>

          <p className="text-green-400">
            {scannedResult}
          </p>

          <button
            onClick={
              requestDeviceLink
            }
            className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          >
            Request Link
          </button>
        </div>
      )}

      {/* Upload QR Image */}
      <div className="mt-10">
        <h2 className="text-xl mb-4">
          Or Upload QR Image
        </h2>

        <input
          type="file"
          accept="image/*"
          className="text-white"
        />
      </div>
    </div>
  );
}