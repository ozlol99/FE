import ChampionInfo from '../components/ChampionInfo';
import ChampionSidebar from '../components/ChampionSidebar';

function Champions() {
  return (
    <>
      <div className=" w-full h-screen bg-amber-500 flex justify-center items-center px-0 mid:px-6 pt-3.5">
        <div className="w-[1440px] h-full bg-amber-400 ">
          <div className="flex flex-col md:flex-row h-full min-w-[500px]">
            <ChampionSidebar />
            <ChampionInfo />
          </div>
        </div>
      </div>
    </>
  );
}

export default Champions;
