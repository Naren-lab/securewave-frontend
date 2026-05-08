"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Link from "next/link";

// Fixed socket URL
const socket = io("https://securewave-backend-2.onrender.com");

export default function DashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  // Current logged-in user ID
  const senderId = "69fd35073407e82f7551e98a";

  useEffect(() => {
    fetchUsers();

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

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

  const sendMessage = async () => {
    if (!message || !selectedUser) return;

    const data = {
      sender: senderId,
      receiver: selectedUser._id,
      message,
    };

    try {
      await axios.post(
        "https://securewave-backend-2.onrender.com/api/chat/send",
        data
      );

      socket.emit("send_message", data);

      setMessages((prev) => [...prev, data]);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen bg-[#0B141A] text-white flex flex-col">

      {/* Top Navigation */}
      <div className="flex gap-3 p-4 bg-[#111B21] overflow-x-auto">

        <Link href="/calls">
          <button className="bg-green-500 px-4 py-2 rounded-lg">
            Voice Call
          </button>
        </Link>

        <Link href="/calls/video">
          <button className="bg-blue-500 px-4 py-2 rounded-lg">
            Video Call
          </button>
        </Link>

        <Link href="/qr">
          <button className="bg-yellow-500 px-4 py-2 rounded-lg text-black">
            QR Contacts
          </button>
        </Link>

        <Link href="/private-space">
          <button className="bg-purple-500 px-4 py-2 rounded-lg">
            Private Space
          </button>
        </Link>

        <Link href="/protection">
          <button className="bg-red-500 px-4 py-2 rounded-lg">
            Protection Mode
          </button>
        </Link>

        <Link href="/notifications">
          <button className="bg-orange-500 px-4 py-2 rounded-lg">
            Notifications
          </button>
        </Link>

        <Link href="/settings">
          <button className="bg-gray-500 px-4 py-2 rounded-lg">
            Settings
          </button>
        </Link>
      </div>

      {/* Main Chat Layout */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <div className="w-[30%] bg-[#111B21] p-4">
          <h2 className="text-2xl font-bold mb-5">Chats</h2>

          {users.map(
            (user) =>
              user._id !== senderId && (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className="bg-[#202C33] p-4 mb-3 rounded-lg cursor-pointer hover:bg-[#2a3942]"
                >
                  {user.name}
                </div>
              )
          )}
        </div>

        {/* Chat Area */}
        <div className="w-[70%] flex flex-col">

          {/* Selected Chat Header */}
          <div className="bg-[#202C33] p-4 text-xl font-bold">
            {selectedUser ? selectedUser.name : "Select a chat"}
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg mb-3 max-w-sm ${
                  msg.sender === senderId
                    ? "bg-green-500 ml-auto"
                    : "bg-gray-700"
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 flex gap-3 bg-[#111B21]">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message..."
              className="flex-1 p-3 rounded-lg text-black"
            />

            <button
              onClick={sendMessage}
              className="bg-green-500 px-6 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}