import TopIcon from '../assets/positions/top.svg?react';
import JungleIcon from '../assets/positions/jungle.svg?react';
import MidIcon from '../assets/positions/mid.svg?react';
import BotIcon from '../assets/positions/bot.svg?react';
import SupportIcon from '../assets/positions/support.svg?react';
import AllIcon from '../assets/positions/all.svg?react';

export const positionIcons = {
  ALL: AllIcon,
  TOP: TopIcon,
  JUNGLE: JungleIcon,
  MIDDLE: MidIcon,
  BOTTOM: BotIcon,
  UTILITY: SupportIcon,
};

// 안전하게 아이콘 가져오는 함수
export function getPositionIcon(position) {
  const key = String(position || '').toUpperCase();
  return positionIcons[key] || null;
}
