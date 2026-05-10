"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const socket = io("https://securewave-backend-2.onrender.com");

export default function DashboardPage() {
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const senderId = currentUser?._id;

  useEffect(() => {
    if (!senderId) {
      router.push("/login");
      return;
    }

    fetchContacts();

    // Register current user socket
    socket.emit("registerUser", senderId);

    socket.on("receive_message", (data) => {
      if (
        selectedUser &&
        (
          data.sender === selectedUser._id ||
          data.receiver === selectedUser._id
        )
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [senderId, selectedUser]);

  // Fetch only added contacts
  const fetchContacts = async () => {
    try {
      const res = await axios.get(
        `https://securewave-backend-2.onrender.com/api/contacts/${senderId}`
      );

      const contacts = res.data.map(
        (item: any) => item.contactId
      );

      setUsers(contacts);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch old messages
  const fetchMessages = async (receiverId: string) => {
    try {
      const res = await axios.get(
        `https://securewave-backend-2.onrender.com/api/chat/messages/${senderId}/${receiverId}`
      );

      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!message && !selectedFile) return;
    if (!selectedUser) return;

    let fileUrl = "";
    let fileType = "";

    try {
      // Upload file if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await axios.post(
          "https://securewave-backend-2.onrender.com/api/upload",
          formData
        );

        fileUrl = uploadRes.data.fileUrl;
        fileType = uploadRes.data.fileType;
      }

      const data = {
        sender: senderId,
        receiver: selectedUser._id,
        message,
        fileUrl,
        fileType,
        createdAt: new Date(),
      };

      await axios.post(
        "https://securewave-backend-2.onrender.com/api/chat/send",
        data
      );

      // Send through socket
      socket.emit("send_message", data);

      // Add sender message instantly
      setMessages((prev) => [...prev, data]);

      setMessage("");
      setSelectedFile(null);

    } catch (error) {
      console.log(error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="h-screen flex bg-[#111B21] text-white overflow-hidden">

      {/* Left Sidebar */}
      <div className="w-[80px] bg-[#202C33] flex flex-col items-center py-5 gap-6">
        <div className="w-12 h-12 bg-green-500 rounded-full"></div>

        <Link href="/calls">📞</Link>
        <Link href="/calls/video">🎥</Link>
        <Link href="/qr">📱</Link>
        <Link href="/private-space">🔒</Link>
        <Link href="/notifications">🔔</Link>
        <Link href="/settings">⚙️</Link>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 px-3 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Chat List */}
      <div className="w-[30%] bg-[#111B21] border-r border-gray-700 flex flex-col">

        <div className="p-4">
          <input
            placeholder="Search chats..."
            className="w-full p-3 rounded-lg bg-[#202C33] text-white"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                fetchMessages(user._id);
              }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#202C33] cursor-pointer mb-2"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center font-bold">
                {user.name?.charAt(0)}
              </div>

              <div>
                <h2 className="font-semibold">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-400">
                  Click to chat
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-[70%] flex flex-col bg-[#0B141A]">

        {/* Header */}
        <div className="h-20 bg-[#202C33] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full"></div>

            <div>
              <h2 className="font-bold text-lg">
                {selectedUser
                  ? selectedUser.name
                  : "Select Chat"}
              </h2>

              <p className="text-green-400 text-sm">
                Online
              </p>
            </div>
          </div>

          <div className="flex gap-5 text-xl">
            <Link href="/calls/video">🎥</Link>
            <Link href="/calls">📞</Link>
            🔍
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0B141A]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl mb-4 max-w-sm ${
                msg.sender === senderId
                  ? "bg-green-500 ml-auto"
                  : "bg-[#202C33]"
              }`}
            >
              {/* Text Message */}
              {msg.message && (
                <div>
                  <p>{msg.message}</p>

                  <div className="text-xs text-right mt-1 opacity-70">
                    {new Date(
                      msg.createdAt || Date.now()
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} ✓✓
                  </div>
                </div>
              )}

              {/* Image */}
              {msg.fileUrl &&
                msg.fileType?.startsWith("image") && (
                  <img
                    src={`https://securewave-backend-2.onrender.com${msg.fileUrl}`}
                    className="mt-2 rounded-lg"
                  />
                )}

              {/* Video */}
              {msg.fileUrl &&
                msg.fileType?.startsWith("video") && (
                  <video controls className="mt-2 rounded-lg">
                    <source
                      src={`https://securewave-backend-2.onrender.com${msg.fileUrl}`}
                    />
                  </video>
                )}

              {/* Audio */}
              {msg.fileUrl &&
                msg.fileType?.startsWith("audio") && (
                  <audio controls className="mt-2 w-full">
                    <source
                      src={`https://securewave-backend-2.onrender.com${msg.fileUrl}`}
                    />
                  </audio>
                )}

              {/* Documents */}
              {msg.fileUrl &&
                !msg.fileType?.startsWith("image") &&
                !msg.fileType?.startsWith("video") &&
                !msg.fileType?.startsWith("audio") && (
                  <a
                    href={`https://securewave-backend-2.onrender.com${msg.fileUrl}`}
                    target="_blank"
                    className="text-blue-300 underline"
                  >
                    View Document
                  </a>
                )}
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="p-4 bg-[#202C33] flex items-center gap-3">
          <input
            type="file"
            onChange={(e) =>
              setSelectedFile(
                e.target.files?.[0] || null
              )
            }
            className="text-white"
          />

          <input
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Type a message..."
            className="flex-1 p-3 rounded-full bg-[#2A3942] text-white"
          />

          <button
            onClick={sendMessage}
            className="bg-green-500 px-6 py-3 rounded-full"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}