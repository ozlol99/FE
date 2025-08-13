import SearchIcon from '@/assets/searchIcon.svg?react';
import { useState } from 'react';
// import { useDebounce } from '../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

function MainSearchBar() {
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
    <>
      <div className="w-[700px] h-[48px] bg-[#D9D9D9] rounded-4xl border-4 border-[#a9a9a9] flex items-center justify-end overflow-hidden">
        <input
          className="w-[550px] h-full px-4 bg-transparent outline-none text-black font-medium text-sm"
          placeholder="소환사를 검색해 주세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div
          className="w-[72px] h-full bg-[#00BBA3] flex items-center justify-center cursor-pointer"
          onClick={handleSearch}
        >
          <SearchIcon />
        </div>
      </div>
    </>
  );
}

export default MainSearchBar;
