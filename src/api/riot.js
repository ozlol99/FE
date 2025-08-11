import axios from 'axios';

const RIOT_API_KEY = import.meta.env.VITE_RIOT_API_KEY;
const KR_URL = 'https://kr.api.riotgames.com';
const ASIA_URL = 'https://asia.api.riotgames.com';

// 사용자 닉네임 태그 정보 api
export async function getAccountByRiotId(gameName, tagLine) {
  const url = `${ASIA_URL}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  try {
    const { data } = await axios.get(url, {
      headers: { 'X-Riot-Token': RIOT_API_KEY },
    });
    console.log('account:', data);
    return data;
  } catch (error) {
    console.error(
      `Riot API 호출 실패 (Account - ${gameName}#${tagLine}):`,
      error.response?.data || error.message,
    );
    throw error;
  }
}

// 사용자 프로필이미지, 레벨정보
export async function getSummonerByPuuid(puuid) {
  const url = `${KR_URL}/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;
  try {
    const { data } = await axios.get(url, {
      headers: { 'X-Riot-Token': RIOT_API_KEY },
    });
    console.log('summoner:', data);
    return data;
  } catch (error) {
    console.error(
      `Riot API 호출 실패 (Summoner - PUUID: ${puuid}):`,
      error.response?.data || error.message,
    );
    throw error;
  }
}

//사용자 티어
export async function getLeagueByPuuid(puuid) {
  const url = `${KR_URL}/lol/league/v4/entries/by-puuid/${encodeURIComponent(puuid)}`;
  try {
    const { data } = await axios.get(url, {
      headers: { 'X-Riot-Token': RIOT_API_KEY },
    });
    console.log('league:', data);
    return data;
  } catch (error) {
    console.error(
      `Riot API 호출 실패 (League - PUUID: ${puuid}):`,
      error.response?.data || error.message,
    );
    throw error;
  }
}
