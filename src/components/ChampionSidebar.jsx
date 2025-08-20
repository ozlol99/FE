import { useMemo, useState } from 'react';
import { matchLaneByTags } from '../data/roleToLane';
import ChampionRoleFilter from './ChampionRoleFilter';
import ChampionSearchBox from './ChampionSearchBox';
import { useDebounce } from '../hooks/useDebounce';
import ChampionList from './ChampionList';

function ChampionSidebar({ champions, selectedId, onSelect }) {
  const [lane, setLane] = useState('ALL'); // 포지션 상태
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 300); // 0.3초 대기 후 반영

  const filtered = useMemo(() => {
    return champions
      .filter((ch) => matchLaneByTags(ch.tags, lane))
      .filter(
        (ch) =>
          ch.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          ch.id.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
  }, [champions, lane, debouncedSearch]);

  return (
    <div className=" w-full md:w-[300px]  p-3 ">
      <div className="block md:hidden h-[150px]  overflow-y-auto">
        <ChampionSearchBox value={search} onChange={setSearch} />
        <ChampionList
          champions={filtered}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>
      <div className="hidden md:block">
        <ChampionSearchBox value={search} onChange={setSearch} />
        <ChampionRoleFilter value={lane} onChange={setLane} />
        <ChampionList
          champions={filtered}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}

export default ChampionSidebar;
