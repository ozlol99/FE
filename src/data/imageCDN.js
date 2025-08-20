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
  const fallback = '/fallback.png';
  if (!itemId || itemId === 0) return fallback;
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/item/${itemId}.png`;
}

// 룬 (canisback CDN 활용)
export function getRuneImg(perkId) {
  if (!perkId) return '/fallback-rune.png';
  return `https://ddragon.canisback.com/img/perk/${perkId}.png`; // 8005 -> 이미지 바로 나옴
}

// src="https://ddragon.leagueoflegends.com/cdn/img/perk-images

// 나중에 수정 해야 할 부분 지금 수동으로 매핑 한 부분
const BASE = 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles';

const KEYSTONE_ICON = {
  // Precision
  8005: `${BASE}/Precision/PressTheAttack/PressTheAttack.png`, // 집중 공격
  8008: `${BASE}/Precision/LethalTempo/LethalTempoTemp.png`, // 치명적 속도
  8021: `${BASE}/Precision/FleetFootwork/FleetFootwork.png`, // 기민한 발놀림
  8010: `${BASE}/Precision/Conqueror/Conqueror.png`, // 정복자

  // Domination
  8112: `${BASE}/Domination/Electrocute/Electrocute.png`, // 감전
  8124: `${BASE}/Domination/Predator/Predator.png`, // 포식자
  8128: `${BASE}/Domination/DarkHarvest/DarkHarvest.png`, // 어둠의 수확
  9923: `${BASE}/Domination/HailOfBlades/HailOfBlades.png`, // 칼날비

  // Sorcery
  8214: `${BASE}/Sorcery/SummonAery/SummonAery.png`, // 콩콩이 소환
  8229: `${BASE}/Sorcery/ArcaneComet/ArcaneComet.png`, // 신비로운 유성
  8230: `${BASE}/Sorcery/PhaseRush/PhaseRush.png`, // 기민한 발놀림(주문작)
  // ↑ 한국어 명칭 혼동 주의, 아이콘 경로만 정확하면 됨

  // Resolve
  8437: `${BASE}/Resolve/GraspOfTheUndying/GraspOfTheUndying.png`, // 착취
  8439: `${BASE}/Resolve/VeteranAftershock/VeteranAftershock.png`, // 여진
  8465: `${BASE}/Resolve/Guardian/Guardian.png`, // 수호자

  // Inspiration
  8351: `${BASE}/Inspiration/GlacialAugment/GlacialAugment.png`, // 빙결 강화
  8360: `${BASE}/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png`, // 봉인 풀린 주문서
  8369: `${BASE}/Inspiration/FirstStrike/FirstStrike.png`, // 선제공격
};

export function getKeystoneImg(perkId) {
  return KEYSTONE_ICON[perkId] ?? null;
}
