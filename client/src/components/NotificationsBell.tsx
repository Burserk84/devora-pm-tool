"use client";

import { useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export function NotificationsBell() {
  const { notifications, unreadCount, markNotificationsAsRead } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // When opening the dropdown, mark notifications as read
      markNotificationsAsRead();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-slate-700"
      >
        {/* Bell Icon */}
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
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-xs text-white items-center justify-center">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-20">
          <div className="p-3 font-semibold border-b border-slate-700">
            Notifications
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.actionUrl || "#"}
                    className={`block px-4 py-3 hover:bg-slate-700 ${
                      !n.read ? "bg-slate-900" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-4 text-sm text-slate-400">
                You have no new notifications.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
