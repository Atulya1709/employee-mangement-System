"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Globe,
  LogOut,
  Settings,
  Menu,
  X,
  Building,
  Users,
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">Employee</h2>
        <button onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white p-4 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold mb-8 hidden md:block">Employee</h2>

        <ul className="space-y-4">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setOpen(false)}
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/user"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setOpen(false)}
            >
              <Users className="w-5 h-5" />
              User
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/employee"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setOpen(false)}
            >
              <Users className="w-5 h-5" />
              Admin
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/country"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setOpen(false)}
            >
              <Building className="w-5 h-5" />
              Countries
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/state"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setOpen(false)}
            >
              <Globe className="w-5 h-5" />
              States
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/city"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setOpen(false)}
            >
              <Building className="w-5 h-5" />
              Cities
            </Link>
          </li>

          <li>
            <Link
              href="/logout"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setOpen(false)}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/setting"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setOpen(false)}
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
