"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function DashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

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
    const res = await axios.get("http://localhost:5000/api/users");
    setUsers(res.data);
  };

  const sendMessage = async () => {
    if (!message || !selectedUser) return;

    const data = {
      sender: senderId,
      receiver: selectedUser._id,
      message
    };

    await axios.post(
      "http://localhost:5000/api/chat/send",
      data
    );

    socket.emit("send_message", data);

    setMessages((prev) => [...prev, data]);
    setMessage("");
  };

  return (
    <div className="h-screen flex bg-[#0B141A] text-white">

      {/* Sidebar */}
      <div className="w-[30%] bg-[#111B21] p-4">
        <h2 className="text-2xl font-bold mb-5">Chats</h2>

        {users.map((user) => (
          user._id !== senderId && (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className="bg-[#202C33] p-4 mb-3 rounded-lg cursor-pointer"
            >
              {user.name}
            </div>
          )
        ))}
      </div>

      {/* Chat Area */}
      <div className="w-[70%] flex flex-col">

        <div className="bg-[#202C33] p-4 text-xl font-bold">
          {selectedUser
            ? selectedUser.name
            : "Select a chat"}
        </div>

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

        <div className="p-4 flex gap-3 bg-[#111B21]">
          <input
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
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
  );
}