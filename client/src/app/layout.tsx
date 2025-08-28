"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { SocketProvider } from "@/context/SocketContext";
import { Sidebar } from "@/components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";

const inter = Inter({ subsets: ["latin"] });

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const publicRoutes = ["/login"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute) {
      router.push("/login");
    }
    if (!isLoading && user && isPublicRoute) {
      router.push("/");
    }
  }, [isLoading, user, isPublicRoute, router, pathname]);

  if (isLoading || (!user && !isPublicRoute) || (user && isPublicRoute)) {
    return <FullScreenLoader />;
  }

  // If it's a public route, just render the content without the app shell
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // If it's a private route and the user is logged in, render the full app shell
  return (
    <div className="relative min-h-screen md:flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 md:ml-64">
        <div className="md:hidden flex justify-between items-center p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold">Devora</h1>
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
  );
}

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
              <AppContent>{children}</AppContent>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
