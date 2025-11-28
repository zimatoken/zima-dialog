import { ReactNode, createContext, useContext, useEffect, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const token = useAuthStore((s) => s.session?.accessToken);

  const socket = useMemo(() => {
    if (!token) return null;
    return io('http://localhost:3000', {
      path: '/v0/ws',
      transports: ['websocket'],
      auth: { token: `Bearer ${token}` },
      reconnectionAttempts: 5,
    });
  }, [token]);

  useEffect(() => {
    if (!socket) return;
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('Socket not ready. Ensure user authenticated.');
  }
  return ctx;
};


