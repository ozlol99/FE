import { createContext, useContext, useEffect } from 'react';
import { socket, connectSocket, disconnectSocket } from '@/lib/socket';

const SocketCtx = createContext(null);

export default function SocketProvider({ children, token }) {
  useEffect(() => {
    connectSocket(token); // 앱 진입 시 연결
    return () => disconnectSocket(); // 언마운트 시 해제
  }, [token]);

  return <SocketCtx.Provider value={socket}>{children}</SocketCtx.Provider>;
}

export function useSocket() {
  const s = useContext(SocketCtx);
  if (!s) throw new Error('useSocket must be used within <SocketProvider>');
  return s;
}
