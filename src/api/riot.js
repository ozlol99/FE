import axios from 'axios';

// const RIOT_API_KEY = import.meta.env.VITE_RIOT_API_KEY;
// const KR_URL = 'https://kr.api.riotgames.com';
// const ASIA_URL = 'https://asia.api.riotgames.com';

// // 사용자 닉네임 태그 정보 api
// export async function getAccountByRiotId(gameName, tagLine) {
//   const url = `${ASIA_URL}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
//   try {
//     const { data } = await axios.get(url, {
//       headers: { 'X-Riot-Token': RIOT_API_KEY },
//     });
//     console.log('account:', data);
//     return data;
//   } catch (error) {
//     console.error(
//       `Riot API 호출 실패 (Account - ${gameName}#${tagLine}):`,
//       error.response?.data || error.message,
//     );
//     throw error;
//   }
// }

// // 사용자 프로필이미지, 레벨정보
// export async function getSummonerByPuuid(puuid) {
//   const url = `${KR_URL}/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;
//   try {
//     const { data } = await axios.get(url, {
//       headers: { 'X-Riot-Token': RIOT_API_KEY },
//     });
//     console.log('summoner:', data);
//     return data;
//   } catch (error) {
//     console.error(
//       `Riot API 호출 실패 (Summoner - PUUID: ${puuid}):`,
//       error.response?.data || error.message,
//     );
//     throw error;
//   }
// }

// //사용자 티어
// export async function getLeagueByPuuid(puuid) {
//   const url = `${KR_URL}/lol/league/v4/entries/by-puuid/${encodeURIComponent(puuid)}`;
//   try {
//     const { data } = await axios.get(url, {
//       headers: { 'X-Riot-Token': RIOT_API_KEY },
//     });
//     console.log('league:', data);
//     return data;
//   } catch (error) {
//     console.error(
//       `Riot API 호출 실패 (League - PUUID: ${puuid}):`,
//       error.response?.data || error.message,
//     );
//     throw error;
//   }
// }

// // 최근 매치 ID 목록 //
// export async function getRecentMatchIds(puuid, count = 2) {
//   // 주의: 경로에 riot-asia 같은 prefix 없음
//   const url = `${ASIA_URL}/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?start=0&count=${count}`;
//   try {
//     const { data } = await axios.get(url, {
//       headers: { 'X-Riot-Token': RIOT_API_KEY },
//     });
//     // data: [ "KR_...", "KR_...", ... ]
//     console.log('match id:', data);
//     return data;
//   } catch (error) {
//     console.error(
//       `Riot API 실패 (Match IDs - PUUID: ${puuid}):`,
//       error.response?.data || error.message,
//     );
//     throw error;
//   }
// }

// // 매치 ID로 상세 가져오기 //
// export async function getMatchById(matchId) {
//   const url = `${ASIA_URL}/lol/match/v5/matches/${encodeURIComponent(matchId)}`;
//   try {
//     const { data } = await axios.get(url, {
//       headers: { 'X-Riot-Token': RIOT_API_KEY },
//     });
//     // data: { metadata: { matchId, participants: [...] }, info: { participants: [...], ... } }
//     console.log('metadata:', data);
//     return data;
//   } catch (error) {
//     console.error(
//       `Riot API 실패 (Match - ID: ${matchId}):`,
//       error.response?.data || error.message,
//     );
//     throw error;
//   }
// }

// 백엔드 라이엇 api 호출

const API = import.meta.env.VITE_API_BASE;
// const PLATFORM = 'kr';
// const API_BASE = `https://${PLATFORM}.api.riotgames.com`;
// const KEY = import.meta.env.VITE_RIOT_API_KEY;

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

//랭킹 roit api
const RETRY = 2; // 504/429 때 재시도 횟수
const GAP_MS = 250; // 재시도 간격

const ok = (r) => r && r.ok;

async function fetchWithRetry(path, attempts = RETRY) {
  for (let i = 0; i <= attempts; i++) {
    try {
      const res = await fetch(path); // /riot/... 프록시 사용
      if (ok(res)) return res.json();

      // 504, 429(레이트리밋)만 재시도, 나머지는 그대로 에러
      if (![429, 504].includes(res.status)) {
        const t = await res.text().catch(() => '');
        throw new Error(`Riot ${res.status}: ${t || path}`);
      }
    } catch (e) {
      if (i === attempts) throw e;
    }
    // 백오프
    await new Promise((r) => setTimeout(r, GAP_MS * (i + 1)));
  }
}

export async function getChallenger(queue) {
  return fetchWithRetry(
    `/riot/lol/league/v4/challengerleagues/by-queue/${queue}`,
  );
}
export async function getGrandmaster(queue) {
  return fetchWithRetry(
    `/riot/lol/league/v4/grandmasterleagues/by-queue/${queue}`,
  );
}
export async function getMaster(queue) {
  return fetchWithRetry(`/riot/lol/league/v4/masterleagues/by-queue/${queue}`);
}

/** 챌/그마/마스터 합쳐서 LP 내림차순, 일부 실패해도 가능한 것만 합침 */
export async function getTopLeagueEntries(queue, limit = 100) {
  const results = await Promise.allSettled([
    getChallenger(queue),
    // getGrandmaster(queue),
    // getMaster(queue),
  ]);

  const okJsons = results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);

  // 전부 실패하면 에러
  if (!okJsons.length) {
    const reasons = results
      .filter((r) => r.status === 'rejected')
      .map((r) => r.reason?.message || r.reason);
    throw new Error(`Riot fetch failed: ${reasons.join(' | ')}`);
  }

  const all = okJsons.flatMap((j) =>
    (j.entries || []).map((e) => ({ ...e, tier: j.tier })),
  );

  all.sort((a, b) => b.leaguePoints - a.leaguePoints);
  return all.slice(0, limit);
}

export async function getSummonerById(encSummonerId) {
  if (!encSummonerId) {
    console.warn('getSummonerById: encSummonerId is empty');
    throw new Error('summonerId missing');
  }
  const url = `/riot/lol/summoner/v4/summoners/${encodeURIComponent(encSummonerId)}`;
  try {
    const r = await fetch(url);
    if (!r.ok) {
      const t = await r.text().catch(() => '');
      console.error('SummonerV4 fail', r.status, url, t);
      throw new Error(`SummonerV4 ${r.status}`);
    }
    return r.json(); // { name, puuid, summonerLevel, ... }
  } catch (e) {
    console.error('getSummonerById error:', e);
    throw e;
  }
}

export async function getAccountByPuuid(puuid) {
  if (!puuid) {
    console.warn('getAccountByPuuid: puuid is empty');
    throw new Error('puuid missing');
  }
  const url = `/asia/riot/account/v1/accounts/by-puuid/${encodeURIComponent(puuid)}`;
  try {
    const r = await fetch(url);
    if (!r.ok) {
      const t = await r.text().catch(() => '');
      console.error('AccountV1 fail', r.status, url, t);
      throw new Error(`AccountV1 ${r.status}`);
    }
    return r.json(); // { gameName, tagLine }
  } catch (e) {
    console.error('getAccountByPuuid error:', e);
    throw e;
  }
}
