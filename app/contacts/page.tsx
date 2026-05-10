"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  QrCode,
  KeyRound,
  UserPlus,
  Camera
} from "lucide-react";

export default function ContactsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [passkey, setPasskey] = useState("");

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all registered users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://securewave-backend-2.onrender.com/api/users"
      );

      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Add contact
  const addContact = async (
    contactId: string
  ) => {
    try {
      const res = await axios.post(
        "https://securewave-backend-2.onrender.com/api/contacts/add",
        {
          userId: currentUser._id,
          contactId
        }
      );

      alert(
        res.data.message ||
          "Contact Added Successfully"
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B141A] text-white p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-400">
          QR Contact System
        </h1>

        <p className="text-gray-400 mt-2">
          Add contacts securely
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">

        {/* QR Scanner */}
        <div className="bg-[#111B21] rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-6">
            <QrCode className="text-green-400" />

            <h2 className="text-xl font-semibold">
              Scan QR Code
            </h2>
          </div>

          <div className="h-64 bg-[#202C33] rounded-xl flex flex-col items-center justify-center">
            <Camera
              size={50}
              className="text-gray-400"
            />

            <p className="text-gray-400 mt-4">
              QR Scanner Coming Soon
            </p>
          </div>

          <button className="w-full mt-6 bg-green-500 py-3 rounded-xl">
            Start Scanner
          </button>
        </div>

        {/* Passkey */}
        <div className="bg-[#111B21] rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-6">
            <KeyRound className="text-blue-400" />

            <h2 className="text-xl font-semibold">
              Enter Passkey
            </h2>
          </div>

          <input
            type="text"
            value={passkey}
            onChange={(e) =>
              setPasskey(e.target.value)
            }
            placeholder="Enter passkey"
            className="w-full bg-[#202C33] p-4 rounded-xl outline-none"
          />

          <button className="w-full mt-6 bg-blue-500 py-3 rounded-xl">
            Send Request
          </button>
        </div>
      </div>

      {/* My QR */}
      <div className="mt-10 bg-[#111B21] rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          My SecureWave QR
        </h2>

        <div className="flex flex-col items-center">
          <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center text-black font-bold">
            QR CODE
          </div>

          <p className="mt-4 text-gray-400">
            User ID: {currentUser._id}
          </p>
        </div>
      </div>

      {/* Add Contacts Section */}
      <div className="mt-10 bg-[#111B21] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <UserPlus className="text-yellow-400" />

          <h2 className="text-xl font-semibold">
            Add Users as Contacts
          </h2>
        </div>

        <div className="space-y-4">
          {users
            .filter(
              (user) =>
                user._id !== currentUser._id
            )
            .map((user) => (
              <div
                key={user._id}
                className="bg-[#202C33] p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <h3>{user.name}</h3>

                  <p className="text-sm text-gray-400">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={() =>
                    addContact(user._id)
                  }
                  className="bg-green-500 px-4 py-2 rounded-lg"
                >
                  Add Contact
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}