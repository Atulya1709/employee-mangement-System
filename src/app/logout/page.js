"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // ✅ Clear local storage or tokens
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("employeeData");
    localStorage.removeItem("stateData");
    localStorage.removeItem("cityData");

    // ✅ Redirect to login
    const timer = setTimeout(() => {
      router.push("/login");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800">Logging out...</h1>
        <p className="mt-2 text-gray-600">You will be redirected shortly.</p>
        <div className="mt-6 animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-solid mx-auto"></div>
      </div>
    </div>
  );
}
