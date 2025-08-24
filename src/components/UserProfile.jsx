function UserProfile({ profile, onRefresh }) {
  const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/profileicon/${profile?.profileIconId}.png`;
  return (
    <div className="flex h-[270px] w-full p-3.5 justify-center">
      <div className="flex flex-1 w-full  max-w-4x gap-4">
        <div className="flex text-sm text-gray-900 w-full sm:w-3/4 md:3/4 p-2.5 gap-3 bg-">
          <div className="flex flex-col">
            {/* 이미지 컨테이너 */}
            <div className="relative  w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]">
              <img
                src={profileIconUrl}
                alt={profile?.name}
                className="w-full h-full object-cover rounded-4xl"
              />
              {/* 레벨 배지 */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-5">
                <span className="bg-stone-800 rounded-2xl text-xs font-bold h-full w-full flex justify-center items-center text-white">
                  {profile?.summonerLevel}
                </span>
              </div>
            </div>
          </div>
          {/* 추가적인 정보 나중에 넣기 */}
          <div className="flex flex-1 flex-col w-[100px] h-full gap-3 justify-between">
            <div className="flex gap-2 text-2xl font-bold text-white">
              {profile?.name}
              <span className="text-gray-300">#{profile?.tag}</span>
            </div>
            <div>
              {/* 갱신시 새로고침 click 이벤트 작성 */}
              <button
                onClick={onRefresh}
                className="bg-[#00BBA3] text-white hover:bg-cyan-600 hover:dark:bg-cyan-900 text-sm px-4 h-10 align-middle rounded-xl justify-center box-border disabled:bg-gray-200 disabled:text-gray-300 relative flex items-center gap-1"
              >
                <span>전적갱신</span>
              </button>
            </div>
          </div>
        </div>
        {/* 광고넣을 div */}
        <div className="w-[280px] hidden md:block bg-amber-50">ad</div>
      </div>
    </div>
  );
}

export default UserProfile;
