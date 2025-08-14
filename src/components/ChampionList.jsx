import ChampionCard from './ChampionCard';

export default function ChampionList({ champions = [], selectedId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-0.5 p-5 justify-center items-center md:p-0 md:pt-5 overflow-auto md:max-h-full">
      {champions.map((ch) => (
        <div key={ch.id} className="flex flex-col items-center w-16">
          <ChampionCard
            data={ch}
            active={selectedId === ch.id}
            onClick={onSelect}
          />
        </div>
      ))}
    </div>
  );
}
