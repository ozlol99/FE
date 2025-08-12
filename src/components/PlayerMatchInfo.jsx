import PlayerMatchCard from './PlayerMatchCard';

export default function PlayerMatchInfo({ matchesInfo, puuid }) {
  if (!puuid || !matchesInfo) return null;

  const list = Array.isArray(matchesInfo) ? matchesInfo : [matchesInfo];

  return (
    <div className="flex flex-col gap-3 p-2">
      {list.filter(Boolean).map((match) => (
        <PlayerMatchCard
          key={match?.metadata?.matchId}
          match={match}
          puuid={puuid}
        />
      ))}
    </div>
  );
}
