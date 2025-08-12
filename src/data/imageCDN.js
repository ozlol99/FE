// 공통 버전 (ddragon 기준)
export const DDRAGON_VER = '14.16.1';

// 스펠
const spellData = {
  1: 'SummonerBoost',
  3: 'SummonerExhaust',
  4: 'SummonerFlash',
  6: 'SummonerHaste',
  7: 'SummonerHeal',
  12: 'SummonerTeleport',
  11: 'SummonerSmite',
  13: 'SummonerMana', // ARAM
  14: 'SummonerDot',
  21: 'SummonerBarrier',
  32: 'SummonerSnowball', // ARAM
};

export function getSpellImg(id) {
  const name = spellData[id] || 'Unknown';
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/spell/${name}.png`;
}

// 챔피언
export function getChampionImg(championName) {
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/champion/${championName}.png`;
}

// 아이템
export function getItemImg(itemId) {
  if (!itemId || itemId === 0) return '';
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/${itemId}.png`;
}

// 룬 (canisback CDN 활용)
export function getRuneImg(perkId) {
  if (!perkId) return '/fallback-rune.png';
  return `https://ddragon.canisback.com/img/perk/${perkId}.png`; // 8005 -> 이미지 바로 나옴
}
