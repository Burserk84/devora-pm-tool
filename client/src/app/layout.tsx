"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

const inter = Inter({ subsets: ["latin"] });

// Since we can't use Metadata in a client component,
// you might move it to specific page files or handle it differently.
// For now, we'll remove it from here.

function AppContent({ children }: { children: React.ReactNode }) {
  const { token, logout } = useAuth(); // Use the hook to get auth state

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-800 p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold">Devora</h1>
          {/* Navigation links will go here later */}
        </div>
        {token && ( // Only show logout button if logged in
          <Button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-500"
          >
            Logout
          </Button>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-slate-50`}>
        <AuthProvider>
          {" "}
          {/* Wrap everything with AuthProvider */}
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}
