"use client";

import { useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

export default function LinkDevicePage() {
  const [scannedResult, setScannedResult] =
    useState("");

  const [manualCode, setManualCode] =
    useState("");

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("user") || "{}"
        )
      : {};

  const userId = currentUser?._id;

  // QR scanner
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

  // Request link after QR scan
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

  // Manual code request
  const requestManualLink =
    async () => {
      try {
        if (!manualCode) {
          alert(
            "Enter link code"
          );
          return;
        }

        await axios.post(
          "https://securewave-backend-2.onrender.com/api/devices/link",
          {
            userId,
            deviceName:
              navigator.userAgent,
            deviceType:
              "Browser",
            manualCode
          }
        );

        alert(
          "Manual link request sent"
        );
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="min-h-screen bg-[#0B141A] text-white p-10">

      <h1 className="text-3xl font-bold mb-8">
        Link New Device
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* QR Scanner */}
        <div className="bg-[#111B21] p-6 rounded-xl">
          <h2 className="text-xl mb-4 font-bold">
            Scan QR Code
          </h2>

          <button
            onClick={startScanner}
            className="bg-green-500 px-6 py-3 rounded-lg"
          >
            Start Camera Scanner
          </button>

          <div
            id="reader"
            className="mt-5"
          ></div>

          {scannedResult && (
            <div className="mt-5">
              <p className="text-green-400">
                QR Scanned Successfully
              </p>

              <button
                onClick={
                  requestDeviceLink
                }
                className="mt-4 bg-blue-500 px-6 py-2 rounded-lg"
              >
                Request Link
              </button>
            </div>
          )}
        </div>

        {/* Manual Code */}
        <div className="bg-[#111B21] p-6 rounded-xl">
          <h2 className="text-xl mb-4 font-bold">
            Enter Manual Link Code
          </h2>

          <input
            type="text"
            placeholder="Enter code (Ex: SW-397282)"
            value={manualCode}
            onChange={(e) =>
              setManualCode(
                e.target.value
              )
            }
            className="w-full p-3 rounded-lg text-black"
          />

          <button
            onClick={
              requestManualLink
            }
            className="mt-5 bg-green-500 px-6 py-3 rounded-lg"
          >
            Submit Code
          </button>
        </div>
      </div>
    </div>
  );
}