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

// This new component will handle the auth logic
function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Define routes that are accessible to everyone
  const publicRoutes = ["/login"]; // We no longer have a /register page
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute) {
      // If loading is finished, user is not logged in, and it's not a public route, redirect
      router.push("/login");
    }
  }, [isLoading, user, isPublicRoute, router]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!user && !isPublicRoute) {
    // While redirecting, show a loader
    return <FullScreenLoader />;
  }

  if (user && isPublicRoute) {
    // If a logged-in user tries to visit login page, redirect to home
    router.push("/");
    return <FullScreenLoader />;
  }

  // If the user is logged in, or if it's a public page, show the content
  if (user || isPublicRoute) {
    return (
      <div className="relative min-h-screen md:flex">
        {/* The Sidebar is only shown for logged-in users */}
        {user && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Adjust main content based on whether the sidebar is present */}
        <main className={`flex-1 ${user ? "md:ml-64" : ""}`}>
          {user && (
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
          )}

          <div className={user ? "p-8" : ""}>{children}</div>
        </main>
      </div>
    );
  }

  return null; 
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
              <AppLayout>{children}</AppLayout>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
