import { DDRAGON_VER } from '@/api/champions';

export const splashUrl = (id, num = 0) =>
  `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_${num}.jpg`;
export const loadingUrl = (id, num = 0) =>
  `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${id}_${num}.jpg`;
export const passiveIconUrl = (file) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/passive/${file}`;
export const spellIconUrl = (file) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/spell/${file}`;
