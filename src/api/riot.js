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

export async function getSummonerInfo(name, tag) {
  const encodeName = encodeURIComponent(name);
  const encodeTag = encodeURIComponent(tag);

  try {
    const res = await axios.get(
      `${API}/riot/summoner-info/${encodeName}/${encodeTag}`,
      { withCredentials: true },
    );
    return res.data;
  } catch (err) {
    console.error('summoner-info 실패:', err);
    throw err;
  }
}
