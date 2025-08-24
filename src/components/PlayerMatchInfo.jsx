import PlayerMatchCard from './PlayerMatchCard';

export default function PlayerMatchInfo({ matches, puuid }) {
  if (!puuid || !matches) return null;

  return (
    <div className="flex flex-col gap-3 p-2">
      {matches.map((match) => (
        <PlayerMatchCard key={match.id} match={match} puuid={puuid} />
      ))}
    </div>
  );
}
