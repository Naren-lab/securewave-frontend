"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "https://securewave-backend-2.onrender.com/api/auth/register",
        { name, email, password }
      );

      alert(res.data.message);
      router.push("/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[#0B141A]">
      <div className="bg-[#202C33] p-10 rounded-xl w-[420px]">
        <h1 className="text-white text-3xl font-bold text-center mb-2">
          SecureWave
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Create your secure account
        </p>

        <input
          placeholder="Full Name"
          className="w-full p-3 mb-4 rounded bg-white text-black"
          onChange={(e) => setName(e.target.value)}
        />

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

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 mb-4 rounded bg-white text-black"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 p-3 rounded text-white"
        >
          Register
        </button>

        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-green-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}