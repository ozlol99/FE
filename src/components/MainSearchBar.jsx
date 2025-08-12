import SearchIcon from '@/assets/searchIcon.svg?react';
import { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

function MainSearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1000); // 1초 후 반영
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery.trim()) {
      console.log('검색 실행:', debouncedQuery);
    }
  }, [debouncedQuery, navigate]);
  const [name, tag] = query.split('#');
  return (
    <>
      <div className="w-[700px] h-[48px] bg-[#D9D9D9] rounded-4xl border-4 border-[#a9a9a9] flex items-center justify-end overflow-hidden">
        <input
          className="w-[550px] h-full px-4 bg-transparent outline-none text-black font-medium text-sm"
          placeholder="소환사를 검색해 주세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div
          className="w-[72px] h-full bg-[#00BBA3] flex items-center justify-center cursor-pointer"
          onClick={() =>
            navigate(
              `/match-detail/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
            )
          }
        >
          <SearchIcon />
        </div>
      </div>
    </>
  );
}

export default MainSearchBar;
