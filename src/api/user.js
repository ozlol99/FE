import axios from 'axios';

// import { API } from '@/lib/api';
const BASE_URL = 'https://api.lol99.kro.kr'; // 실제 API 주소
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// 회원가입
export async function registerUser({ user, gender, birthday }) {
  const res = await api.post('/user/register', { user, gender, birthday });
  return res.data;
}

// 내 정보 조회 (riot_accounts 포함)
export async function getUserMe() {
  const res = await api.get('/user/me');
  return res.data;
}

// 내 정보 수정
export async function updateUserMe({ user, gender, birthday }) {
  const res = await api.patch('/user/me', { user, gender, birthday });
  return res.data;
}

// 로그아웃
export async function logoutUser() {
  const res = await api.delete('/user/logout');
  return res.data;
}

// 회원 탈퇴 (쿼리 파라미터 code 필요)
export async function deleteUser(code) {
  const res = await api.get(`/user/delete?code=${code}`);
  return res.data;
}

// 좋아요
export async function addLikeAPI(fromUserId, toUserId) {
  const res = await api.post(`/user/like/${fromUserId}/${toUserId}`);
  return res.data;
}

// Riot 계정 추가
export async function addRiotAccount({ game_name, tag_line }) {
  const res = await api.post('/user/riot-accounts', { game_name, tag_line });
  return res.data;
}

// Riot 계정 삭제
export async function removeRiotAccount(accountId) {
  await api.delete(`/user/riot-accounts/${accountId}`);
}
