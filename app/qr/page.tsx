"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRPage() {
  const [userId] = useState("SW1778201863538");
  const [scannedResult, setScannedResult] = useState("");

  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (qrRef.current) {
      QRCode.toCanvas(qrRef.current, userId);
    }
  }, [userId]);

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setScannedResult(decodedText);
        scanner.clear();
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#0B141A] text-white p-10">

      <h1 className="text-3xl font-bold mb-8 text-center">
        SecureWave QR Contacts
      </h1>

      <div className="grid md:grid-cols-2 gap-10">

        {/* Your QR */}
        <div className="bg-[#202C33] p-6 rounded-xl">
          <h2 className="text-xl mb-4 font-bold">
            Your QR Code
          </h2>

          <canvas ref={qrRef}></canvas>

          <p className="mt-4 text-gray-300">
            Your User ID: {userId}
          </p>
        </div>

        {/* Scanner */}
        <div className="bg-[#202C33] p-6 rounded-xl">
          <h2 className="text-xl mb-4 font-bold">
            Scan Contact QR
          </h2>

          <button
            onClick={startScanner}
            className="bg-green-500 px-5 py-2 rounded-lg"
          >
            Start Scanner
          </button>

          <div id="reader" className="mt-5"></div>

          {scannedResult && (
            <div className="mt-4">
              <p>Scanned User ID:</p>
              <p className="text-green-400">
                {scannedResult}
              </p>

              <button className="mt-4 bg-blue-500 px-5 py-2 rounded-lg">
                Add Contact
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}