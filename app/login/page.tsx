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
        "https://securewave-backend-2.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      // Store token
      localStorage.setItem("token", res.data.token);

      // Store logged-in user details
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert(res.data.message);

      router.push("/dashboard");
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Login failed"
      );
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

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-3 mb-4 rounded bg-white text-black"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-3 mb-4 rounded bg-white text-black"
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-green-500 p-3 rounded text-white hover:bg-green-600"
        >
          Login
        </button>

        {/* Register Link */}
        <p className="text-center mt-4 text-gray-300">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-green-400"
          >
            Create New Account
          </Link>
        </p>
      </div>
    </div>
  );
}