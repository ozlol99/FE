import { SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { useDebounce } from '../hooks/useDebounce';
import { useState } from 'react';

function NavSearchBar() {
  const [query, setQuery] = useState('');
  // const debouncedQuery = useDebounce(query, 1000);
  const navigate = useNavigate();

  const handleSearch = () => {
    const raw = query.trim();
    if (!raw) return;
    const [name, tag] = raw.split('#');

    navigate(
      `/match-detail/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center justify-center w-[500px] h-[40px] bg-[#D9D9D9] rounded-4xl border-2 ">
      <input
        className="flex-1 h-full px-4 bg-transparent outline-none text-black font-medium text-sm"
        placeholder="소환사를 검색해 주세요"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div
        className="w-10 text-stone-500 hover:text-stone-950 border-l-2 pl-2 pr-2"
        onClick={handleSearch}
      >
        <SearchIcon />
      </div>
    </div>
  );
}

export default NavSearchBar;
