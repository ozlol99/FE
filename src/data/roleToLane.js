export const roleToLane = {
  TOP: ['Fighter', 'Tank'],
  JUNGLE: ['Assassin', 'Fighter'],
  MID: ['Mage', 'Assassin'],
  BOTTOM: ['Marksman'],
  SUPPORT: ['Support', 'Mage'],
};

export function matchLaneByTags(championTags = [], lane = 'ALL') {
  if (lane === 'ALL') return true;
  const need = roleToLane[lane] || [];
  return championTags.some((t) => need.includes(t));
}
