import axios from 'axios';

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // e.g. https://api.lol99.kro.kr
  withCredentials: true,
});

// ---- CSRF 쿠키 읽기 util (HttpOnly=false 로 서버가 심어줘야 읽힘)
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

// 요청 인터셉터: refresh 호출엔 CSRF 헤더를 붙임
API.interceptors.request.use((config) => {
  if (config._isRefresh) {
    const csrf = getCookie('csrf_refresh_token'); // 서버에서 이 이름으로 심어둔 쿠키
    if (csrf) config.headers['X-CSRF-TOKEN'] = csrf;
  }
  return config;
});

// 응답 인터셉터: 401 → refresh → 원요청 재시도
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // 네트워크 에러 등 response 자체가 없으면 패스
    if (!original || !err.response) return Promise.reject(err);

    const status = err.response.status;

    // 이미 재시도한 요청 or refresh 요청 자체면 패스
    if (original._retry || original._isRefresh) {
      return Promise.reject(err);
    }

    // 401이면 리프레시 시도
    if (status === 401) {
      // 이미 다른 탭/요청에서 리프레시 중이면 대기
      if (refreshing) {
        await new Promise((resolve) => waiters.push(resolve));
        original._retry = true;
        return API(original);
      }

      try {
        refreshing = true;
        await API.post('/user/token/refresh', null, { _isRefresh: true }); // ← 플래그로 루프 방지 + CSRF 헤더 자동첨부
        // 대기중인 요청들 재개
        waiters.forEach((r) => r());
        waiters = [];
        original._retry = true;
        return API(original);
      } catch (e) {
        // 리프레시도 실패하면 대기열 정리하고 실패 반환(또는 여기서 전역 로그아웃/리다이렉트)
        waiters.forEach((r) => r());
        waiters = [];
        return Promise.reject(e);
      } finally {
        refreshing = false;
      }
    }

    // 그 외 상태 코드면 그대로 실패
    return Promise.reject(err);
  },
);
