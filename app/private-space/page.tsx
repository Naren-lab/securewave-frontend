"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Laptop,
  Smartphone,
  Tablet,
  QrCode,
  ShieldCheck,
  LogOut,
  CheckCircle
} from "lucide-react";

export default function PrivateSpacePage() {
  const [devices, setDevices] = useState<any[]>([]);

  // Primary user ID
  const userId = "69fd35073407e82f7551e98a";

  // Fetch devices when page loads
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await axios.get(
        `https://securewave-backend-2.onrender.com/api/devices/${userId}`
      );

      setDevices(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Link new device
  const linkDevice = async () => {
    try {
      await axios.post(
        "https://securewave-backend-2.onrender.com/api/devices/link",
        {
          userId,
          deviceName: "New Linked Device",
          deviceType: "Mobile"
        }
      );

      fetchDevices();

      alert("Device linked successfully");
    } catch (error) {
      console.log(error);
    }
  };

  // Force logout linked device
  const logoutDevice = async (deviceId: string) => {
    try {
      await axios.put(
        `https://securewave-backend-2.onrender.com/api/devices/logout/${deviceId}`
      );

      fetchDevices();

      alert("Device logged out");
    } catch (error) {
      console.log(error);
    }
  };

  // Remove linked device
  const removeDevice = async (deviceId: string) => {
    try {
      await axios.delete(
        `https://securewave-backend-2.onrender.com/api/devices/${deviceId}`
      );

      fetchDevices();

      alert("Device removed successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B141A] text-white p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-400">
          Private Space Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Manage linked devices securely
        </p>
      </div>

      {/* Link New Device */}
      <div className="bg-[#111B21] rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <QrCode className="text-green-400" />
          <h2 className="text-xl font-semibold">
            Link New Device
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* QR Link */}
          <div className="bg-[#202C33] p-6 rounded-xl text-center">
            <div className="w-40 h-40 bg-white mx-auto rounded-xl flex items-center justify-center text-black font-bold">
              QR CODE
            </div>

            <button
              onClick={linkDevice}
              className="mt-4 bg-green-500 px-6 py-3 rounded-xl"
            >
              Scan to Link Device
            </button>
          </div>

          {/* Link Code */}
          <div className="bg-[#202C33] p-6 rounded-xl text-center">
            <h3 className="text-lg font-semibold mb-4">
              Link Code
            </h3>

            <div className="text-3xl font-bold text-blue-400">
              SW-LINK-4821
            </div>

            <p className="text-gray-400 mt-4">
              Enter this code on your new device
            </p>
          </div>
        </div>
      </div>

      {/* Device Approval Requests */}
      <div className="bg-[#111B21] rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-yellow-400" />
          <h2 className="text-xl font-semibold">
            Pending Device Approval
          </h2>
        </div>

        <div className="bg-[#202C33] p-4 rounded-xl flex justify-between items-center">
          <div>
            <h3>MacBook Chrome Browser</h3>
            <p className="text-gray-400 text-sm">
              New device requesting access
            </p>
          </div>

          <div className="flex gap-3">
            <button className="bg-green-500 px-4 py-2 rounded-lg">
              Approve
            </button>

            <button className="bg-red-500 px-4 py-2 rounded-lg">
              Deny
            </button>
          </div>
        </div>
      </div>

      {/* Linked Devices */}
      <div className="bg-[#111B21] rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">
          Active Linked Devices
        </h2>

        <div className="space-y-4">
          {devices.length > 0 ? (
            devices.map((device: any) => (
              <div
                key={device._id}
                className="bg-[#202C33] p-4 rounded-xl flex justify-between items-center"
              >
                <div className="flex items-center gap-4">

                  {device.deviceType === "Mobile" ? (
                    <Smartphone className="text-green-400" />
                  ) : device.deviceType === "Tablet" ? (
                    <Tablet className="text-purple-400" />
                  ) : (
                    <Laptop className="text-blue-400" />
                  )}

                  <div>
                    <h3>{device.deviceName}</h3>

                    <p className="text-sm text-gray-400">
                      Status: {device.status}
                    </p>

                    <p className="text-sm text-gray-500">
                      Session expires in 30 mins
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <LogOut
                    onClick={() =>
                      logoutDevice(device._id)
                    }
                    className="text-red-400 cursor-pointer"
                  />

                  <CheckCircle
                    onClick={() =>
                      removeDevice(device._id)
                    }
                    className="text-green-400 cursor-pointer"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">
              No linked devices found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}