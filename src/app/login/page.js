"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const loginUser = async () => {
    try {
      const response = await fetch("https://crud.parxfit.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok && data.token) {
        // ✅ Save token in cookie (for middleware)
        document.cookie = `token=${data.token}; path=/; secure; samesite=strict; max-age=${
          60 * 60 * 24
        }`; // 1 day expiry

        // (Optional) Also keep in localStorage for frontend usage
      localStorage.setItem("token", data.token);

        router.push("/dashboard");
      } else {
        alert(data.message || "Invalid email or password!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login
        </h1>

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />

          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />

          <button
            onClick={loginUser}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                       py-3 rounded-lg shadow-md transition duration-200"
          >
            Login
          </button>
        </div>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
