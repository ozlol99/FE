// src/lib/api.js
import axios from 'axios';

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // 예: https://api.lol99.kro.kr
  withCredentials: true,
});

// CSRF 쿠키 읽기
function getCookie(name) {
  return (
    document.cookie
      .split('; ')
      .find((v) => v.startsWith(name + '='))
      ?.split('=')[1] || ''
  );
}

let refreshing = false;
let waiters = [];

// 요청 인터셉터: refresh 요청에 CSRF 헤더 추가
API.interceptors.request.use((config) => {
  const isRefresh =
    config.url?.endsWith('/user/token/refresh') &&
    (config.method || 'get').toLowerCase() === 'post';

  if (isRefresh) {
    const csrf =
      getCookie('csrf_refresh_token') || getCookie('XSRF-TOKEN') || '';
    if (csrf) {
      config.headers = config.headers || {};
      config.headers['X-CSRF-TOKEN'] = csrf;
    }
  }
  return config;
});

// 응답 인터셉터: 401 시 자동 토큰 갱신
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (!original || !error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // 이미 재시도했거나 refresh 요청 자체면 패스
    if (original._retry || original.url?.endsWith('/user/token/refresh')) {
      return Promise.reject(error);
    }

    if (status === 401) {
      // 이미 refresh 진행 중이면 대기
      if (refreshing) {
        await new Promise((resolve) => waiters.push(resolve));
        original._retry = true;
        return API(original);
      }

      try {
        refreshing = true;
        console.info('[api] 401 감지 → refresh 시도');

        await API.post('/user/token/refresh');
        console.info('[api] refresh 성공 → 원래 요청 재시도');

        // 대기 중인 요청들 재개
        waiters.forEach((resolve) => resolve());
        waiters = [];

        original._retry = true;
        return API(original);
      } catch (refreshError) {
        console.error('[api] refresh 실패:', refreshError?.response?.status);

        // 대기열 정리
        waiters.forEach((resolve) => resolve());
        waiters = [];

        // refresh 실패 시 필요하면 로그아웃 처리
        // 하지만 AuthContext에서 이미 처리하므로 여기서는 하지 않음

        return Promise.reject(refreshError);
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
