"use client";
import Sidebar from "../component/sidebar";


export default function DashboardLayout({ children }) {
  return (
   
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="ml-64 w-full p-6 min-h-screen">
          {children}
        </div>
      </div>
  
  );
}
