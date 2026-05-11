"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const socket = io(
  "https://securewave-backend-2.onrender.com"
);

export default function DashboardPage() {
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] =
    useState<any>(null);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState<any[]>([]);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem(
            "user"
          ) || "{}"
        )
      : {};

  const senderId =
    currentUser?._id;

  //-----------------------------------
  // Initial Load
  //-----------------------------------
  useEffect(() => {
    if (!senderId) {
      router.push("/login");
      return;
    }

    fetchContacts();

    socket.emit("join_user", {
  userId: senderId,
  username: currentUser.name,
});

    socket.on(
      "receive_message",
      (data) => {
        if (
          selectedUser &&
          (data.senderId ===
            selectedUser._id ||
            data.receiverId ===
              selectedUser._id)
        ) {
          setMessages((prev) => [
            ...prev,
            data,
          ]);
        }
      }
    );

    return () => {
      socket.off(
        "receive_message"
      );
    };
  }, [
    senderId,
    selectedUser,
  ]);

  //-----------------------------------
  // Fetch Contacts
  //-----------------------------------
  const fetchContacts =
    async () => {
      try {
        const res =
          await axios.get(
            `https://securewave-backend-2.onrender.com/api/contacts/${senderId}`
          );

        const contacts =
          res.data.map(
            (item: any) =>
              item.contactId
          );

        setUsers(
          contacts
        );
      } catch (
        error
      ) {
        console.log(
          error
        );
      }
    };

  //-----------------------------------
  // Fetch Messages
  //-----------------------------------
  const fetchMessages =
    async (
      receiverId: string
    ) => {
      try {
        const res =
          await axios.get(
            `https://securewave-backend-2.onrender.com/api/chat/messages/${senderId}/${receiverId}`
          );

        setMessages(
          res.data
        );
      } catch (
        error
      ) {
        console.log(
          error
        );
      }
    };

  //-----------------------------------
  // Send Message
  //-----------------------------------
  const sendMessage =
    async () => {
      if (
        !message &&
        !selectedFile
      )
        return;

      if (!selectedUser)
        return;

      let fileUrl =
        "";
      let fileType =
        "";

      try {
        // Upload file
        if (
          selectedFile
        ) {
          const formData =
            new FormData();

          formData.append(
            "file",
            selectedFile
          );

          const uploadRes =
            await axios.post(
              "https://securewave-backend-2.onrender.com/api/upload",
              formData
            );

          fileUrl =
            uploadRes.data.fileUrl;

          fileType =
            uploadRes.data.fileType;
        }

        const data = {
          senderId,
          receiverId:
            selectedUser._id,
          message,
          fileUrl,
          fileType,
          createdAt:
            new Date(),
        };

        await axios.post(
          "https://securewave-backend-2.onrender.com/api/chat/send",
          data
        );

        socket.emit(
          "send_message",
          data
        );

        setMessages((prev) => [
          ...prev,
          data,
        ]);

        setMessage("");
        setSelectedFile(
          null
        );
      } catch (
        error
      ) {
        console.log(
          error
        );
      }
    };

  //-----------------------------------
  // Logout
  //-----------------------------------
  const handleLogout =
    () => {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      router.push(
        "/login"
      );
    };

  return (
    <div className="h-screen flex bg-[#111B21] text-white">

      {/* Sidebar */}
      <div className="w-[80px] bg-[#202C33] flex flex-col items-center py-5 gap-6">
        <Link href="/calls">📞</Link>
        <Link href="/calls/video">🎥</Link>
        <Link href="/qr">📱</Link>
        <Link href="/private-space">🗂️</Link>
        <Link href="/protection">🛡️</Link>
        <Link href="/notifications">🔔</Link>
        <Link href="/settings">⚙️</Link>

        <button
          onClick={
            handleLogout
          }
          className="mt-auto bg-red-500 px-3 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Contact List */}
      <div className="w-[30%] bg-[#111B21] border-r border-gray-700">
        {users.map(
          (user) => (
            <div
              key={
                user._id
              }
              onClick={() => {
                setSelectedUser(
                  user
                );
                fetchMessages(
                  user._id
                );
              }}
              className="p-4 cursor-pointer hover:bg-[#202C33]"
            >
              {user.name}
            </div>
          )
        )}
      </div>

      {/* Chat Area */}
      <div className="w-[70%] flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5">

          {messages.map(
            (
              msg,
              index
            ) => (
              <div
                key={index}
                className={`mb-4 max-w-sm p-3 rounded-xl ${
                  msg.senderId ===
                  senderId
                    ? "bg-green-500 ml-auto"
                    : "bg-[#202C33]"
                }`}
              >
                {/* IMAGE FILE */}
                {msg.fileType ===
                  "image" &&
                  msg.fileUrl && (
                    <img
                      src={`https://securewave-backend-2.onrender.com/${msg.fileUrl}`}
                      alt="shared image"
                      className="w-64 rounded-lg mb-2"
                    />
                  )}

                {/* DOCUMENT FILE */}
                {msg.fileType ===
                  "document" &&
                  msg.fileUrl && (
                    <a
                      href={`https://securewave-backend-2.onrender.com/${msg.fileUrl}`}
                      target="_blank"
                      className="text-blue-300 underline block mb-2"
                    >
                      View Document
                    </a>
                  )}

                {/* TEXT MESSAGE */}
                {msg.message && (
                  <p>
                    {
                      msg.message
                    }
                  </p>
                )}

                {/* TIME */}
                <div className="text-xs mt-2 text-right">
                  {new Date(
                    msg.createdAt
                  ).toLocaleTimeString(
                    [],
                    {
                      hour:
                        "2-digit",
                      minute:
                        "2-digit",
                    }
                  )}{" "}
                  ✓✓
                </div>
              </div>
            )
          )}
        </div>

        {/* Input Section */}
        <div className="p-4 bg-[#202C33] flex gap-3">

          <input
            type="file"
            onChange={(e) =>
              setSelectedFile(
                e.target
                  .files?.[0] ||
                  null
              )
            }
          />

          <input
            value={
              message
            }
            onChange={(e) =>
              setMessage(
                e.target
                  .value
              )
            }
            className="flex-1 p-3 rounded-full bg-[#2A3942]"
            placeholder="Type message..."
          />

          <button
            onClick={
              sendMessage
            }
            className="bg-green-500 px-6 rounded-full"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}