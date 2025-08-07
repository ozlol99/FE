import GameModeList from '../components/GameModeList';
import MainSearchBar from '../components/MainSearchBar';

function Home() {
  return (
    <>
      <div className="w-full h-screen flex flex-col">
        <div className="w-full h-[420px] flex items-center justify-center">
          <GameModeList />
        </div>
        <div className="flex w-full h-[120px] items-center justify-center">
          <MainSearchBar />
        </div>
        <div></div>
      </div>
    </>
  );
}
export default Home;
