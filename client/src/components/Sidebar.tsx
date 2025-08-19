"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { NotificationsBell } from "@/components/NotificationsBell";

export function Sidebar() {
  const { user, token, logout } = useAuth();

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-800 p-4 flex flex-col justify-between">
      {/* === Top Section: Header & Navigation === */}
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <h1 className="text-2xl font-bold">Devora</h1>
          </Link>
          {token && <NotificationsBell />}
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/settings"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* === Bottom Section: User Profile & Logout === */}
      {token && (
        <div className="space-y-2">
          <div className="text-sm text-slate-400 p-2">
            <p>Signed in as</p>
            <p className="font-medium text-slate-200">
              {user?.name || user?.email}
            </p>
          </div>
          <Button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-500"
          >
            Logout
          </Button>
        </div>
      )}
    </aside>
  );
}
