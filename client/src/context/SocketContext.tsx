// client/src/context/SocketContext.tsx

"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
}

// Get the API URL from environment variables, defaulting for local development
const URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Create the socket instance outside the component
const socketInstance = io(URL, {
  autoConnect: false,
});

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      // If we have a token, connect the socket
      socketInstance.connect();
    } else {
      // If no token, disconnect
      socketInstance.disconnect();
    }

    // Clean up the connection on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
