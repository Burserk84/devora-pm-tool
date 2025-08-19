"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  getNotifications,
  markAllAsRead,
} from "@/services/notificationService";
import { useAuth } from "./AuthContext";

interface Notification {
  id: string;
  message: string;
  read: boolean;
  actionUrl: string | null;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => void;
  markNotificationsAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { token } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (token) {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    }
  }, [token]);

  useEffect(() => {
    // Fetch notifications when the user logs in, and then poll every 30 seconds
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markNotificationsAsRead = async () => {
    // Optimistically update the UI
    const currentlyUnread = notifications.filter((n) => !n.read);
    if (currentlyUnread.length === 0) return;

    setNotifications(notifications.map((n) => ({ ...n, read: true })));

    // Call the API in the background
    try {
      await markAllAsRead();
    } catch (error) {
      // If API fails, revert the UI change
      setNotifications(notifications);
      console.error("Failed to mark notifications as read", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markNotificationsAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
