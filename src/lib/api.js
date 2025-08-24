import axios from 'axios';

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true,
});

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

// API.interceptors.request.use((config) => {
//   const isRefresh =
//     config.url?.endsWith('/user/token/refresh') &&
//     (config.method || 'get').toLowerCase() === 'post';

//   if (isRefresh) {
//     const csrf =
//       getCookie('csrftoken') ||
//       getCookie('XSRF-TOKEN') ||
//       getCookie('_csrf') ||
//       getCookie('csrf_token') ||
//       '';

//     if (csrf) {
//       config.headers = config.headers || {};
//       config.headers['X-CSRF-TOKEN'] = csrf;
//     }

//     console.log('[api] refresh 요청에 CSRF 토큰 추가:', csrf ? '있음' : '없음');
//   }
//   return config;
// });

API.interceptors.request.use((config) => {
  const methodsNeedingCSRF = ['post', 'put', 'delete', 'patch'];
  const method = (config.method || 'get').toLowerCase();

  if (methodsNeedingCSRF.includes(method)) {
    const csrf =
      getCookie('csrftoken') ||
      getCookie('XSRF-TOKEN') ||
      getCookie('_csrf') ||
      getCookie('csrf_token') ||
      '';

    if (csrf) {
      config.headers = config.headers || {};
      config.headers['X-CSRF-TOKEN'] = csrf;
    }

    console.log(
      `[api] ${method.toUpperCase()} 요청에 CSRF 토큰 추가:`,
      csrf ? '있음' : '없음',
    );
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (!original || !error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (original._retry || original.url?.endsWith('/user/token/refresh')) {
      return Promise.reject(error);
    }

    if (status === 401) {
      if (refreshing) {
        await new Promise((resolve) => waiters.push(resolve));
        original._retry = true;
        return API(original);
      }

      try {
        refreshing = true;
        console.info('[api] 401 감지 refresh 시도');

        await API.post('/user/token/refresh');
        console.info('[api] refresh 성공');

        waiters.forEach((resolve) => resolve());
        waiters = [];

        original._retry = true;
        return API(original);
      } catch (refreshError) {
        console.error('[api] refresh 실패:', refreshError?.response?.status);

        waiters.forEach((resolve) => resolve());
        waiters = [];

        return Promise.reject(refreshError);
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
