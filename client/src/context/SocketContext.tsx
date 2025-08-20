"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      // If we have a token, establish a connection
      const newSocket = io("http://localhost:5001");
      setSocket(newSocket);

      // Clean up the connection when the component unmounts or token changes
      return () => {
        newSocket.disconnect();
      };
    } else {
      // If no token, disconnect any existing socket
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket }}>
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
