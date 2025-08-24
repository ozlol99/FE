import topIcon from '@/assets/top.svg';
import midIcon from '@/assets/mid.svg';
import bottomIcon from '@/assets/bottom.svg';
import jungleIcon from '@/assets/jungle.svg';
import supportIcon from '@/assets/supot.svg'; // 파일명 확인

export const POSITIONS = [
  { key: 'top', label: '탑', icon: topIcon },
  { key: 'jungle', label: '정글', icon: jungleIcon },
  { key: 'mid', label: '미드', icon: midIcon },
  { key: 'bottom', label: '바텀', icon: bottomIcon },
  { key: 'support', label: '서폿', icon: supportIcon },
];

export const QUEUES = [
  { key: 'solo_lank', label: '솔로랭크' },
  { key: 'flex', label: '자유랭크' },
  { key: 'aram', label: '칼바람 나락' },
];
