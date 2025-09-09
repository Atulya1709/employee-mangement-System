"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <Image
        src="/homebg.jpg"
        alt="EMS Background"
        fill
        priority
        className="object-cover z-0"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 flex flex-col items-center justify-center text-center px-6">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-xl tracking-wide animate-fadeInDown">
          Welcome to <span className="text-cyan-400">EMS</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mb-10 leading-relaxed animate-fadeIn delay-300">
          Manage employees with ease. Simple, fast, and effective.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 animate-fadeInUp delay-500">
          {/* Login Button */}
          <Link href="/login">
            <button className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden text-lg font-semibold text-white rounded-xl group bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg hover:shadow-cyan-500/50 transform transition duration-300 hover:scale-105">
              <span className="relative z-10">Login</span>
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition duration-300"></span>
            </button>
          </Link>

          {/* Signup Button */}
          <Link href="/signup">
            <button className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden text-lg font-semibold text-white rounded-xl group bg-gradient-to-r from-green-400 to-lime-500 shadow-lg hover:shadow-lime-400/50 transform transition duration-300 hover:scale-105">
              <span className="relative z-10">Signup</span>
              <span className="absolute inset-0 bg-gradient-to-r from-lime-400 to-green-500 opacity-0 group-hover:opacity-100 transition duration-300"></span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
