"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

export default function QRPage() {
  const [scannedResult, setScannedResult] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem(
            "user"
          ) || "{}"
        )
      : {};

  const userId =
    currentUser?._id;

  const qrRef =
    useRef<HTMLCanvasElement | null>(
      null
    );

  /* ---------------- Generate QR ---------------- */
  useEffect(() => {
    if (
      qrRef.current &&
      userId
    ) {
      QRCode.toCanvas(
        qrRef.current,
        userId,
        {
          width: 250,
        }
      );
    }
  }, [userId]);

  /* ---------------- Start Scanner ---------------- */
  const startScanner = () => {
    const scanner =
      new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: 250,
        },
        false
      );

    scanner.render(
      async (
        decodedText
      ) => {
        console.log(
          "Current User:",
          userId
        );

        console.log(
          "Scanned Contact:",
          decodedText
        );

        // Prevent self scan
        if (
          decodedText ===
          userId
        ) {
          alert(
            "You cannot add yourself"
          );
          scanner.clear();
          return;
        }

        setScannedResult(
          decodedText
        );

        scanner.clear();
      },

      (error) => {
        console.log(
          error
        );
      }
    );
  };

  /* ---------------- Add Contact ---------------- */
  const addContact =
    async () => {
      try {
        setLoading(true);

        const res =
          await axios.post(
            "https://securewave-backend-2.onrender.com/api/contacts/add",
            {
              userId:
                userId,
              contactId:
                scannedResult,
            }
          );

        alert(
          res.data
            .message ||
            "Contact Added Successfully"
        );

        // Clear scanned result
        setScannedResult(
          ""
        );

        // Redirect dashboard to refresh contacts
        window.location.href =
          "/dashboard";
      } catch (
        error: any
      ) {
        console.log(
          error
        );

        alert(
          error.response
            ?.data
            ?.message ||
            "Failed to add contact"
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  return (
    <div className="min-h-screen bg-[#0B141A] text-white p-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        SecureWave QR Contacts
      </h1>

      <div className="grid md:grid-cols-2 gap-10">
        
        {/* QR Generator */}
        <div className="bg-[#202C33] p-6 rounded-xl">
          <h2 className="text-xl mb-4 font-bold">
            Your QR Code
          </h2>

          <canvas
            ref={qrRef}
          ></canvas>

          <p className="mt-4 text-gray-300 break-all">
            Your User ID:
            <br />
            {userId}
          </p>
        </div>

        {/* Scanner */}
        <div className="bg-[#202C33] p-6 rounded-xl">
          <h2 className="text-xl mb-4 font-bold">
            Scan Contact QR
          </h2>

          <button
            onClick={
              startScanner
            }
            className="bg-green-500 px-5 py-2 rounded-lg hover:bg-green-600"
          >
            Start Scanner
          </button>

          <div
            id="reader"
            className="mt-5"
          ></div>

          {scannedResult && (
            <div className="mt-5">
              <p>
                Scanned User ID:
              </p>

              <p className="text-green-400 break-all">
                {
                  scannedResult
                }
              </p>

              <button
                onClick={
                  addContact
                }
                disabled={
                  loading
                }
                className="mt-4 bg-blue-500 px-5 py-2 rounded-lg hover:bg-blue-600"
              >
                {loading
                  ? "Adding..."
                  : "Add Contact"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}