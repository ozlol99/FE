import { createContext, useContext, useEffect, useState } from 'react';
import { API } from '@/lib/api'; // baseURL는 '/api', withCredentials: true 이어야 함

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 401이면 refresh 한 번 하고 재시도
  const fetchMe = async () => {
    try {
      const { data } = await API.get('/user/me');
      setUser(data);
      return;
    } catch {
      // ignore and try refresh
    }
    try {
      await API.post('/user/token/refresh'); // ← refresh 쿠키로 access 발급
      const { data } = await API.get('/user/me');
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
      await API.delete('/user/logout'); // 서버가 쿠키 삭제
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
