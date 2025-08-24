// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { API } from '@/lib/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const { data } = await API.get('/user/me'); // 쿠키로 인증됨
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchMe();
      setLoading(false);
    })();
  }, []);

  const logout = async () => {
    try {
      await API.delete('/user/logout');
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthCtx.Provider
      value={{ isLogin: !!user, user, loading, refreshMe: fetchMe, logout }}
    >
      {children}
    </AuthCtx.Provider>
  );
}
export const useAuth = () => useContext(AuthCtx);
