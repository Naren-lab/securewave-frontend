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

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("user") || "{}"
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
                "Browser",
              qrData:
                decodedText
            }
          );

          alert(
            "QR scanned successfully. Request sent to main device."
          );
        } catch (error) {
          console.log(error);
          alert(
            "Failed to send QR request"
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
  // Manual code linking
  //-----------------------------------
  const requestManualLink =
    async () => {
      try {
        if (!manualCode) {
          alert(
            "Please enter link code"
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
              "Browser",
            manualCode
          }
        );

        alert(
          "Manual link request sent successfully"
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
  // QR image upload
  //-----------------------------------
  const handleImageUpload = async (
    e: any
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    alert(
      `${file.name} uploaded successfully. QR decoding can be added next.`
    );
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
          Back to Private Space
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {/* QR Scanner */}
        <div className="bg-[#111B21] p-6 rounded-xl">
          <h2 className="text-xl mb-4 font-bold">
            Scan QR Code
          </h2>

          <button
            onClick={startScanner}
            className="bg-green-500 px-6 py-3 rounded-lg w-full"
          >
            Start Camera Scanner
          </button>

          <div
            id="reader"
            className="mt-5"
          ></div>

          {scannedResult && (
            <div className="mt-4">
              <p className="text-green-400 font-semibold">
                QR Scanned Successfully
              </p>

              <p className="text-sm text-gray-400 mt-2 break-all">
                {scannedResult}
              </p>
            </div>
          )}
        </div>

        {/* Manual Code */}
        <div className="bg-[#111B21] p-6 rounded-xl">
          <h2 className="text-xl mb-4 font-bold">
            Enter Manual Code
          </h2>

          <input
            type="text"
            placeholder="Enter code"
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
            className="mt-5 bg-blue-500 px-6 py-3 rounded-lg w-full"
          >
            Submit Code
          </button>
        </div>

        {/* Upload QR Image */}
        <div className="bg-[#111B21] p-6 rounded-xl">
          <h2 className="text-xl mb-4 font-bold">
            Upload QR Image
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageUpload
            }
            className="w-full"
          />

          <p className="text-gray-400 mt-4 text-sm">
            Upload screenshot/photo of QR code
          </p>
        </div>
      </div>

      {loading && (
        <div className="mt-8 text-center text-green-400 text-lg">
          Processing request...
        </div>
      )}
    </div>
  );
}