"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Laptop,
  Smartphone,
  Tablet,
  QrCode,
  LogOut,
  Trash2,
  Lock,
  Unlock
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export default function PrivateSpacePage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [pendingDevices, setPendingDevices] = useState<any[]>([]);
  const [manualCodeInput, setManualCodeInput] =
    useState("");

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("user") || "{}"
        )
      : {};

  const userId = currentUser?._id;

  useEffect(() => {
    if (userId) {
      fetchDevices();
    }
  }, [userId]);

  //-----------------------------------
  // Fetch devices
  //-----------------------------------
  const fetchDevices = async () => {
    try {
      const res = await axios.get(
        `https://securewave-backend-2.onrender.com/api/devices/${userId}`
      );

      const allDevices = res.data;

      setDevices(
        allDevices.filter(
          (d: any) =>
            d.status === "active"
        )
      );

      setPendingDevices(
        allDevices.filter(
          (d: any) =>
            d.status === "pending"
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  //-----------------------------------
  // Submit manual code
  //-----------------------------------
  const submitManualCode =
    async () => {
      try {
        if (!manualCodeInput) {
          alert(
            "Enter manual code"
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
            manualCode:
              manualCodeInput
          }
        );

        alert(
          "Manual link request sent"
        );

        setManualCodeInput("");
        fetchDevices();
      } catch (error) {
        console.log(error);
      }
    };

  //-----------------------------------
  // Upload QR image
  //-----------------------------------
  const handleImageUpload = (
    e: any
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    alert(
      "QR image uploaded successfully"
    );
  };

  //-----------------------------------
  // Approve device
  //-----------------------------------
  const approveDevice = async (
    deviceId: string
  ) => {
    try {
      await axios.put(
        `https://securewave-backend-2.onrender.com/api/devices/approve/${deviceId}`
      );

      alert("Device approved");
      fetchDevices();
    } catch (error) {
      console.log(error);
    }
  };

  //-----------------------------------
  // Deny device
  //-----------------------------------
  const denyDevice = async (
    deviceId: string
  ) => {
    try {
      await axios.delete(
        `https://securewave-backend-2.onrender.com/api/devices/${deviceId}`
      );

      alert("Device denied");
      fetchDevices();
    } catch (error) {
      console.log(error);
    }
  };

  //-----------------------------------
  // Grant private access
  //-----------------------------------
  const grantPrivateAccess =
    async (
      deviceId: string
    ) => {
      try {
        await axios.put(
          `https://securewave-backend-2.onrender.com/api/devices/private-access/${deviceId}`
        );

        alert(
          "Private access granted"
        );

        fetchDevices();
      } catch (error) {
        console.log(error);
      }
    };

  //-----------------------------------
  // Remove private access
  //-----------------------------------
  const removePrivateAccess =
    async (
      deviceId: string
    ) => {
      try {
        await axios.put(
          `https://securewave-backend-2.onrender.com/api/devices/remove-private/${deviceId}`
        );

        alert(
          "Private access removed"
        );

        fetchDevices();
      } catch (error) {
        console.log(error);
      }
    };

  //-----------------------------------
  // Logout device
  //-----------------------------------
  const logoutDevice = async (
    deviceId: string
  ) => {
    try {
      await axios.put(
        `https://securewave-backend-2.onrender.com/api/devices/logout/${deviceId}`
      );

      alert(
        "Device logged out"
      );

      fetchDevices();
    } catch (error) {
      console.log(error);
    }
  };

  //-----------------------------------
  // Remove device
  //-----------------------------------
  const removeDevice = async (
    deviceId: string
  ) => {
    try {
      await axios.delete(
        `https://securewave-backend-2.onrender.com/api/devices/${deviceId}`
      );

      alert(
        "Device removed"
      );

      fetchDevices();
    } catch (error) {
      console.log(error);
    }
  };

  //-----------------------------------
  // Device icon
  //-----------------------------------
  const getDeviceIcon = (
    type: string
  ) => {
    if (type === "Mobile") {
      return (
        <Smartphone className="text-green-400" />
      );
    }

    if (type === "Tablet") {
      return (
        <Tablet className="text-purple-400" />
      );
    }

    return (
      <Laptop className="text-blue-400" />
    );
  };

  return (
    <div className="min-h-screen bg-[#0B141A] text-white p-8">

      {/* Title */}
      <h1 className="text-3xl font-bold text-green-400 mb-8">
        Private Space Dashboard
      </h1>

      {/* Link New Device */}
      <div className="bg-[#111B21] p-6 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <QrCode className="text-green-400" />
          <h2 className="text-xl font-bold">
            Link New Device
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">

          {/* QR */}
          <div className="bg-[#202C33] p-6 rounded-xl text-center">
            <h3 className="mb-4 font-bold">
              Your QR Code
            </h3>

            <div className="bg-white p-4 rounded-xl inline-block">
              <QRCodeCanvas
                value={`https://securewave-frontend-cbmy.vercel.app/private-space/link/${userId}`}
                size={180}
              />
            </div>
          </div>

          {/* Manual Code */}
          <div className="bg-[#202C33] p-6 rounded-xl text-center">
            <h3 className="mb-4 font-bold">
              Manual Code
            </h3>

            <div className="text-3xl font-bold text-green-400">
              SW-{userId?.slice(-6)}
            </div>
          </div>

          {/* Scanner */}
          <div className="bg-[#202C33] p-6 rounded-xl text-center">
            <h3 className="mb-4 font-bold">
              Scan QR
            </h3>

            <button
              onClick={() =>
                window.open(
                  "/private-space/link",
                  "_blank"
                )
              }
              className="bg-green-500 px-6 py-3 rounded-lg"
            >
              Open Scanner
            </button>
          </div>

          {/* Manual + Upload */}
          <div className="bg-[#202C33] p-6 rounded-xl">
            <h3 className="mb-4 font-bold">
              Enter Code / Upload
            </h3>

            <input
              type="text"
              placeholder="Enter manual code"
              value={
                manualCodeInput
              }
              onChange={(e) =>
                setManualCodeInput(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-lg text-black mb-4"
            />

            <button
              onClick={
                submitManualCode
              }
              className="w-full bg-blue-500 py-2 rounded-lg mb-4"
            >
              Submit Code
            </button>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageUpload
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Pending Devices */}
      <div className="bg-[#111B21] p-6 rounded-xl mb-8">
        <h2 className="text-xl font-bold mb-4">
          Pending Device Requests
        </h2>

        {pendingDevices.length > 0 ? (
          pendingDevices.map(
            (device) => (
              <div
                key={
                  device._id
                }
                className="bg-[#202C33] p-4 rounded-xl flex justify-between mb-4"
              >
                <div>
                  <h3>
                    {
                      device.deviceName
                    }
                  </h3>
                  <p>
                    Waiting approval
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      approveDevice(
                        device._id
                      )
                    }
                    className="bg-green-500 px-4 py-2 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      denyDevice(
                        device._id
                      )
                    }
                    className="bg-red-500 px-4 py-2 rounded"
                  >
                    Deny
                  </button>
                </div>
              </div>
            )
          )
        ) : (
          <p>No pending devices</p>
        )}
      </div>

      {/* Active Devices */}
      <div className="bg-[#111B21] p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">
          Active Devices
        </h2>

        {devices.length > 0 ? (
          devices.map(
            (device) => (
              <div
                key={
                  device._id
                }
                className="bg-[#202C33] p-4 rounded-xl mb-4 flex justify-between"
              >
                <div className="flex gap-4">
                  {getDeviceIcon(
                    device.deviceType
                  )}

                  <div>
                    <h3>
                      {
                        device.deviceName
                      }
                    </h3>

                    {device.isMainDevice && (
                      <span className="bg-green-500 px-2 py-1 rounded text-xs">
                        MAIN DEVICE
                      </span>
                    )}

                    {device.hasPrivateAccess &&
                      !device.isMainDevice && (
                        <span className="bg-purple-500 px-2 py-1 rounded text-xs ml-2">
                          PRIVATE ACCESS
                        </span>
                      )}
                  </div>
                </div>

                {!device.isMainDevice && (
                  <div className="flex gap-3">

                    {!device.hasPrivateAccess ? (
                      <Lock
                        className="cursor-pointer text-green-400"
                        onClick={() =>
                          grantPrivateAccess(
                            device._id
                          )
                        }
                      />
                    ) : (
                      <Unlock
                        className="cursor-pointer text-yellow-400"
                        onClick={() =>
                          removePrivateAccess(
                            device._id
                          )
                        }
                      />
                    )}

                    <LogOut
                      className="cursor-pointer text-red-400"
                      onClick={() =>
                        logoutDevice(
                          device._id
                        )
                      }
                    />

                    <Trash2
                      className="cursor-pointer text-red-500"
                      onClick={() =>
                        removeDevice(
                          device._id
                        )
                      }
                    />
                  </div>
                )}
              </div>
            )
          )
        ) : (
          <p>No active devices found</p>
        )}
      </div>
    </div>
  );
}