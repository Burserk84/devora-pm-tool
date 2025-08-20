"use client";

import { useState } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { SocketProvider } from "@/context/SocketContext";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to manage the sidebar's visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-slate-50`}>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <div>
                {/* The Sidebar is now controlled by our state */}
                <Sidebar
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                />

                {/* Main content now has a margin on desktop to make space for the sidebar */}
                <main className="flex-1 md:ml-64">
                  {/* Mobile Header with Hamburger Menu */}
                  <div className="md:hidden flex justify-between items-center p-4 border-b border-slate-700">
                    <h1 className="text-xl font-bold">
                      <Link href="/">Devora</Link>
                    </h1>
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      aria-label="Open sidebar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                      </svg>
                    </button>
                  </div>

                  <div className="p-8">{children}</div>
                </main>
              </div>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
