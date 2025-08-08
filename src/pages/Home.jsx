import GameModeList from '../components/GameModeList';
import MainSearchBar from '../components/MainSearchBar';
import Notice from '../components/Notice';

function Home() {
  return (
    <>
      <div className="w-full h-screen flex flex-col gap-20 pt-16">
        <div className="w-full flex items-center justify-center">
          <GameModeList />
        </div>
        <div className="flex w-full items-center justify-center">
          <MainSearchBar />
        </div>
        <div className="flex w-full flex-1 justify-center">
          <Notice />
        </div>
      </div>
    </>
  );
}
export default Home;
