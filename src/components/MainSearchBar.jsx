import SearchIcon from '@/assets/searchIcon.svg?react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { rtSearch } from '@/api/riot';
function MainSearchBar() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  // 바깥 클릭 시 닫힘
  useEffect(() => {
    const onDown = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => {
    const raw = (debounced || '').trim();
    if (raw.length < 2) {
      setResults([]);
      return;
    }
    const [name, tag] = raw.split('#');

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await rtSearch(name || '', tag || undefined);
        const arr = Array.isArray(data) ? data : data ? [data] : [];
        if (alive) setResults(arr);
      } catch (e) {
        if (alive) setResults([]);
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [debounced]);

  const go = (name, tag) => {
    if (!name || !tag) return;
    setOpen(false);
    navigate(
      `/match-detail/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
    );
  };

  const handleSearch = () => {
    const raw = (query || '').trim();
    if (!raw) return;
    const [name, tag] = raw.split('#');
    go(name, tag);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSearch();
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="w-[700px] h-[48px] bg-[#D9D9D9] rounded-4xl border-4 border-[#a9a9a9] flex items-center justify-end overflow-hidden">
        <input
          className="w-[550px] h-full px-4 bg-transparent outline-none text-black font-medium text-sm"
          placeholder="소환사를 검색해 주세요 (예: 이상호93#KR1)"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="w-[72px] h-full bg-[#00BBA3] flex items-center justify-center cursor-pointer"
          onClick={handleSearch}
          aria-label="검색"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 자동완성 드롭다운 */}
      {open && (loading || results.length > 0) && (
        <div className="absolute left-0 mt-2 w-[700px] rounded-2xl bg-white/95 shadow-xl border z-50 overflow-hidden">
          {loading && (
            <div className="p-3 text-sm text-stone-500">검색 중…</div>
          )}

          {!loading && results.length === 0 && (
            <div className="p-3 text-sm text-stone-500">결과 없음</div>
          )}

          {!loading &&
            results.map((r, i) => {
              const name = r.summoner_name ?? r.name ?? r.gameName ?? '';
              const tag = r.tag_line ?? r.tag ?? r.tagLine ?? '';
              const icon = r.profileIconId
                ? `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/profileicon/${r.profileIconId}.png`
                : null;

              return (
                <button
                  key={`${name}-${tag}-${i}`}
                  onClick={() => go(name, tag)}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-stone-400 text-left"
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

export default MainSearchBar;
