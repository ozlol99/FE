import MatchCard from './MatchCard';
import { gameModes } from '../data/gameMode';
import { useNavigate } from 'react-router-dom';

function GameModeList() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center gap-10">
      {gameModes.map((mode) => (
        <div
          key={mode.id}
          onClick={() => navigate(`/rooms?queue=${mode.type}`)}
        >
          <MatchCard
            title={mode.title}
            subtitle={mode.subtitle}
            imageSrc={mode.image}
            Icon={mode.icon}
            color={mode.color}
          />
        </div>
      ))}
    </div>
  );
}
export default GameModeList;
