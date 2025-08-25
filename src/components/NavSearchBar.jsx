import { useNavigate } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import { rtSearch } from '@/api/riot';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useState } from 'react';

function NavSearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400); // 입력 끝나고 0.4초 후 반영
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = debouncedQuery.trim();
    if (raw.length < 2) {
      setResults([]);
      return;
    }

    const [name, tag] = raw.split('#');
    (async () => {
      try {
        setLoading(true);
        const data = await rtSearch(name, tag);
        setResults(Array.isArray(data) ? data : data ? [data] : []);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [debouncedQuery]);

  const go = (name, tag) => {
    if (!name || !tag) return;
    navigate(
      `/match-detail/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
    );
  };

  const handleSearch = () => {
    const [name, tag] = query.trim().split('#');
    go(name, tag);
  };

  return (
    <div className="relative">
      <div className="flex items-center w-[500px] h-[40px] bg-[#D9D9D9] rounded-4xl border-2">
        <input
          className="flex-1 h-full px-4 bg-transparent outline-none text-black font-medium text-sm"
          placeholder="소환사 검색 (예: 이상호93#KR1)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSearch();
          }}
        />
        <button
          className="w-10 text-stone-500 hover:text-stone-950 border-l-2 px-2"
          onClick={handleSearch}
        >
          <SearchIcon />
        </button>
      </div>

      {(loading || results.length > 0) && (
        <div className="absolute left-0 mt-1 w-[500px] rounded-xl bg-black/95 shadow-xl border z-50">
          {loading && (
            <div className="p-3 text-sm text-stone-500">검색 중…</div>
          )}
          {!loading && results.length === 0 && (
            <div className="p-3 text-sm text-stone-500">결과 없음</div>
          )}
          {!loading &&
            results.map((r, i) => {
              const name = r.summoner_name || r.gameName || '';
              const tag = r.tag_line || r.tagLine || '';
              const icon = r.profileIconId
                ? `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/profileicon/${r?.profileIconId}.png`
                : null;
              return (
                <button
                  key={i}
                  onClick={() => go(name, tag)}
                  className="w-full flex items-center gap-2 p-3 rounded-xl hover:bg-stone-600 text-left"
                >
                  {icon ? (
                    <img src={icon} alt="" className="w-5 h-5 rounded" />
                  ) : (
                    <div className="w-5 h-5 rounded bg-stone-300" />
                  )}
                  <span className="text-sm font-medium">{name}</span>
                  <span className="text-xs text-stone-500">#{tag}</span>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default NavSearchBar;
