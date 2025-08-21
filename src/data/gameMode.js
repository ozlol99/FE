import AramIcon from '@/assets/aramIcon.svg?react';
import DuoIcon from '@/assets/duoIcon.svg?react';
import FlexIcon from '@/assets/flexIcon.svg?react';
import flexImg from '@/assets/mainCardimg1.png';
import duoImage from '@/assets/mainCardimg2.png';
import aramImage3 from '@/assets/mainCardimg3.png';

export const gameModes = [
  {
    id: 1,
    type: 'flex',
    title: 'Flex',
    subtitle: '자유랭크',
    color: 'from-cyan-600 to-cyan-950',
    icon: FlexIcon,
    image: flexImg,
  },

  {
    id: 2,
    type: 'solo',
    title: 'Duo',
    subtitle: '개인 / 듀오 랭크',
    color: 'from-pink-600 to-pink-950',
    icon: DuoIcon,
    image: duoImage,
  },
  {
    id: 3,
    type: 'aram',
    title: 'ARAM',
    subtitle: '칼바람',
    color: 'from-orange-600 to-orange-950',
    icon: AramIcon,
    image: aramImage3,
  },
];
