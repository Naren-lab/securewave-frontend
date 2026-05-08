"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);

      const user = localStorage.getItem("user");

      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0B141A] text-white">
        <h1 className="text-4xl font-bold text-green-500">
          SecureWave Loading...
        </h1>
      </div>
    );
  }

  return null;
}