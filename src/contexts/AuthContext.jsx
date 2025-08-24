// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { API } from '@/lib/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 디버깅용: 토큰 상태
  const [tokens, setTokens] = useState({
    accessOk: false,
    refreshOk: false,
    lastError: null,
  });

  const probeTokensAndFetchMe = async () => {
    setLoading(true);

    // 1) access 토큰으로 /user/me 시도
    try {
      const { data } = await API.get('/user/me');
      setUser(data);
      setTokens({ accessOk: true, refreshOk: true, lastError: null });
      console.info('[auth] /user/me 성공 → 로그인됨');
      return data;
    } catch (e) {
      const status = e?.response?.status;
      console.warn('[auth] /user/me 실패', status);

      // 401이 아니면 다른 에러이므로 refresh 시도하지 않음
      if (status !== 401) {
        setUser(null);
        setTokens({ accessOk: false, refreshOk: false, lastError: status });
        return null;
      }
    }

    // 2) refresh 토큰으로 access 재발급 시도
    try {
      await API.post('/user/token/refresh');
      setTokens((prev) => ({ ...prev, refreshOk: true, lastError: null }));
      console.info('[auth] refresh 성공 → access 재발급됨');

      // 3) 재발급 후 다시 /user/me
      try {
        const { data } = await API.get('/user/me');
        setUser(data);
        setTokens({ accessOk: true, refreshOk: true, lastError: null });
        return data;
      } catch (meError) {
        console.error(
          '[auth] refresh 후 /user/me 실패:',
          meError?.response?.status,
        );
        throw meError;
      }
    } catch (e) {
      const status = e?.response?.status;
      console.error('[auth] refresh 실패', status, e?.response?.data);

      setUser(null);
      setTokens({
        accessOk: false,
        refreshOk: false,
        lastError: status || 'refresh_failed',
      });
      return null;
    }
  };

  // 최초 로그인 상태 확인
  useEffect(() => {
    (async () => {
      try {
        await probeTokensAndFetchMe();
      } catch (error) {
        console.error('[auth] 초기 인증 확인 실패:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    try {
      await API.delete('/user/logout');
      console.info('[auth] 로그아웃 완료');
    } catch (error) {
      console.error('[auth] 로그아웃 API 실패:', error);
      // API 실패해도 클라이언트에서는 로그아웃 처리
    } finally {
      setUser(null);
      setTokens({ accessOk: false, refreshOk: false, lastError: null });
    }
  };

  const value = {
    isLogin: !!user,
    user,
    loading,
    refreshMe: probeTokensAndFetchMe,
    logout,
    tokens, // 디버깅용
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthCtx);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
};
