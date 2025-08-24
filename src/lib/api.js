import axios from 'axios';

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // https://api.lol99.kro.kr
  withCredentials: true, // 쿠키 들고 다님
});

// 401이면 /user/token/refresh 한 번 돌리고 원요청 재시도
let refreshing = false;
let waiters = [];

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (!original || err.response?.status !== 401 || original._retry) {
      return Promise.reject(err);
    }

    if (refreshing) {
      await new Promise((r) => waiters.push(r));
      original._retry = true;
      return API(original);
    }

    try {
      refreshing = true;
      await API.post('/user/token/refresh');
      waiters.forEach((r) => r());
      waiters = [];
      original._retry = true;
      return API(original);
    } catch (e) {
      waiters = [];
      return Promise.reject(e);
    } finally {
      refreshing = false;
    }
  },
);
