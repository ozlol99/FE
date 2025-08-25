import axios from 'axios';

// 백엔드 라이엇 api 호출
const API = import.meta.env.VITE_API_BASE;
const KR = 'https://kr.api.riotgames.com';
const ASIA = 'https://asia.api.riotgames.com';
const KEY = import.meta.env.VITE_RIOT_API_KEY;

export async function getSummonerInfo(name, tag) {
  const encodeName = encodeURIComponent(name);
  const encodeTag = encodeURIComponent(tag);

  try {
    const res = await axios.get(
      `${API}/riot/summoner-info/${encodeName}/${encodeTag}`,
    );
    return res.data;
  } catch (err) {
    console.error('summoner-info 실패:', err);
    throw err;
  }
}

export async function rtSearch(name, tag) {
  const params = new URLSearchParams();
  if (name) params.set('summoner_name', name);
  if (tag) params.set('tag_line', tag);

  const url = `${API}/riot/rtSearch?${params.toString()}`;
  const { data } = await axios.get(url, { withCredentials: true });
  return data;
}

// 요청 많을 시 라이엇 호출 불가능으로 재호출
// 아주 가벼운 레이트리미터
let last = 0;
const MIN_DELAY_MS = 250;
async function rateWait() {
  const now = Date.now();
  const wait = Math.max(0, MIN_DELAY_MS - (now - last));
  if (wait) await new Promise((r) => setTimeout(r, wait));
  last = Date.now();
}

async function fetchJson(url, retry = 2) {
  if (!KEY) throw new Error('VITE_RIOT_API_KEY가 없습니다.');
  await rateWait();

  const res = await fetch(url, { headers: { 'X-Riot-Token': KEY } });

  if ((res.status === 429 || res.status >= 500) && retry > 0) {
    const ra = res.headers.get('Retry-After');
    const ms = ra ? Number(ra) * 1000 : 1200;
    await new Promise((r) => setTimeout(r, ms));
    return fetchJson(url, retry - 1);
  }
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`[${res.status}] ${url} :: ${t.slice(0, 120)}`);
  }
  return res.json();
}

export async function getChallenger(queue = 'RANKED_SOLO_5x5') {
  const url = `${KR}/lol/league/v4/challengerleagues/by-queue/${encodeURIComponent(queue)}`;
  return fetchJson(url);
}

export async function getAccountByPuuid(puuid) {
  const url = `${ASIA}/riot/account/v1/accounts/by-puuid/${encodeURIComponent(puuid)}`;
  return fetchJson(url);
}
