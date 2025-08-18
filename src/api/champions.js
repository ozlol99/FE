import axios from 'axios';

export const DDRAGON_VER = '14.16.1';
export const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn';

const CHAMPIONS_URL = `${DDRAGON_BASE}/${DDRAGON_VER}/data/ko_KR/champion.json`;

export async function fetchChampionList() {
  try {
    const { data } = await axios.get(CHAMPIONS_URL);
    return Object.values(data.data).map((c) => ({
      id: c.id,
      name: c.name,
      tags: c.tags,
      icon: `${DDRAGON_BASE}/${DDRAGON_VER}/img/champion/${c.id}.png`,
    }));
  } catch (error) {
    console.error('챔피언 목록 요청 실패 : ', error);
    throw error;
  }
}

export async function fetchChampionDetail(id) {
  const { data } = await axios.get(
    `${DDRAGON_BASE}/${DDRAGON_VER}/data/ko_KR/champion/${id}.json`,
  );
  return data.data[id];
}
