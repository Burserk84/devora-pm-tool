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
            {/* This is where navigation links will go in the future.
              For example:
              <li><Link href="/" className="block p-2 rounded-md hover:bg-slate-700">Dashboard</Link></li>
              <li><Link href="/settings" className="block p-2 rounded-md hover:bg-slate-700">Settings</Link></li>
            */}
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
