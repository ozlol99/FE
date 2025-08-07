import SearchIcon from '@/assets/searchIcon.svg?react';

function MainSearchBar() {
  return (
    <>
      <div className="w-[700px] h-[48px] bg-[#D9D9D9] rounded-4xl border-4 border-[#a9a9a9] flex items-center justify-end overflow-hidden">
        <input
          className="w-[550px] h-full px-4 bg-transparent outline-none text-black font-medium text-sm"
          placeholder="소환사를 검색해 주세요"
        />
        <div className="w-[72px] h-full bg-[#00BBA3] flex items-center justify-center cursor-pointer">
          <SearchIcon />
        </div>
      </div>
    </>
  );
}

export default MainSearchBar;
