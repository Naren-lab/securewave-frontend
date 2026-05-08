"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);

      alert(res.data.message);
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[#0B141A]">
      <div className="bg-[#202C33] p-10 rounded-xl w-[420px]">
        <h1 className="text-white text-3xl font-bold text-center mb-2">
          SecureWave
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Login to continue chatting
        </p>

        <input
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-white text-black"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-white text-black"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-500 p-3 rounded text-white"
        >
          Login
        </button>

        <p className="text-center mt-4">
          <Link href="/register" className="text-green-400">
            Create New Account
          </Link>
        </p>
      </div>
    </div>
  );
}