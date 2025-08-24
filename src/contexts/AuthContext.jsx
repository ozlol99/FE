// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { API } from '@/lib/api'; // baseURL:'/api', withCredentials:true

const AuthCtx = createContext(null);

// (선택) CSRF 쓰는 백엔드라면 refresh 때 헤더 부착
function getCookie(name) {
  return (
    document.cookie
      .split('; ')
      .find((v) => v.startsWith(name + '='))
      ?.split('=')[1] || ''
  );
}
API.interceptors.request.use((config) => {
  const isRefresh =
    config.url?.endsWith('/user/token/refresh') &&
    (config.method || 'get').toLowerCase() === 'post';
  if (isRefresh) {
    const csrf =
      getCookie('csrf_refresh_token') || getCookie('XSRF-TOKEN') || '';
    if (csrf) (config.headers ||= {})['X-CSRF-TOKEN'] = csrf;
  }
  return config;
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 디버깅용: 토큰 추론 상태
  const [tokens, setTokens] = useState({
    accessOk: false,
    refreshOk: false,
    lastError: null,
  });

  const probeTokensAndFetchMe = async () => {
    // 1) access 토큰(쿠키)로 바로 me 시도
    try {
      const { data } = await API.get('/user/me');
      setUser(data);
      setTokens({ accessOk: true, refreshOk: true, lastError: null }); // access OK면 refresh도 대개 존재
      console.info('[auth] /user/me 200 → access OK');
      return;
    } catch (e) {
      console.warn(
        '[auth] /user/me 실패 → access 없음/만료로 추정',
        e?.response?.status,
      );
    }

    // 2) refresh 토큰으로 access 재발급 시도
    try {
      await API.post('/user/token/refresh'); // 성공 시 서버가 access 쿠키를 새로 굽는다
      setTokens((t) => ({ ...t, refreshOk: true, lastError: null }));
      console.info(
        '[auth] /user/token/refresh 200 → refresh OK, access 재발급됨',
      );

      // 3) 재발급 후 다시 me
      const { data } = await API.get('/user/me');
      setUser(data);
      setTokens({ accessOk: true, refreshOk: true, lastError: null });
      return;
    } catch (e) {
      const status = e?.response?.status;
      console.error(
        '[auth] /user/token/refresh 실패',
        status,
        e?.response?.data,
      );
      // 401/403이면 refresh 자체가 없거나(미전달), 유효하지 않거나(CSRF 미설정 포함)
      setUser(null);
      setTokens({
        accessOk: false,
        refreshOk: false,
        lastError: status || 'refresh_failed',
      });
    }
  };

  useEffect(() => {
    (async () => {
      await probeTokensAndFetchMe();
      setLoading(false);
    })();
  }, []);

  const logout = async () => {
    try {
      await API.delete('/user/logout');
    } finally {
      setUser(null);
      setTokens({ accessOk: false, refreshOk: false, lastError: null });
    }
  };

  return (
    <AuthCtx.Provider
      value={{
        isLogin: !!user,
        user,
        loading,
        refreshMe: probeTokensAndFetchMe,
        logout,
        tokens, // { accessOk, refreshOk, lastError }로 진단 가능
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
