"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { Sidebar } from "@/components/Sidebar";
import { SocketProvider } from "@/context/SocketContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-slate-50`}>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 p-8">{children}</main>
              </div>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
