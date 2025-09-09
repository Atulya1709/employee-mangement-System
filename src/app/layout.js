"use client";
import "./globals.css";

import { usePathname } from "next/navigation";


export default function RootLayout({ children }) {
  const pathname = usePathname();

  

  return (
    <html lang="en">
      <body className="h-screen flex flex-col">
       

        <div className="flex flex-1">
         

          <main className="flex-1 p-0 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
