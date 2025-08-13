import ChampionGrid from './ChampionGrid';
import ChampionRoleFilter from './ChampionRoleFilter';
import ChampionSearchBox from './ChampionSearchBox';

function ChampionSidebar() {
  return (
    <div className=" w-full h-[20%] min-h-[500px] md:h-full md:w-[300px] bg-red-400 p-3 ">
      <ChampionSearchBox />
      <ChampionRoleFilter />
      <ChampionGrid />
    </div>
  );
}

export default ChampionSidebar;
