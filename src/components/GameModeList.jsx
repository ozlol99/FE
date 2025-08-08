import MatchCard from './MatchCard';
import { gameModes } from '../data/gameMode';

function GameModeList() {
  return (
    <div className=" flex justify-center gap-10">
      {gameModes.map((mode) => (
        <MatchCard
          key={mode.id}
          title={mode.title}
          subtitle={mode.subtitle}
          imageSrc={mode.image}
          Icon={mode.icon}
          color={mode.color}
        />
      ))}
    </div>
  );
}
export default GameModeList;
