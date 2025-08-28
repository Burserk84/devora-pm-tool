"use client";

import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
}

// Create the socket instance outside the component
// This ensures it's only created once per application lifecycle
const socketInstance = io("http://localhost:5001", {
  autoConnect: false, // We will connect manually
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
