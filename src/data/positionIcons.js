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
  MID: MidIcon,
  BOTTOM: BotIcon,
  SUPPORT: SupportIcon,
};

export function normalizePosition(position) {
  const key = String(position || '').toUpperCase();

  switch (key) {
    case 'MIDDLE':
      return 'MID';
    case 'BOT':
    case 'BOTTOM':
      return 'BOTTOM';
    case 'UTILITY':
      return 'SUPPORT';
    case 'NONE':
      return 'ALL';
    case 'SOLO':
      return 'TOP';
    default:
      return key;
  }
}

export function getPositionIcon(position) {
  const key = String(position || '').toUpperCase();
  return positionIcons[key] || null;
}
