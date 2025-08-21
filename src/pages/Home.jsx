import { useNavigate } from 'react-router-dom';
import GameModeList from '@/components/GameModeList';
import MainSearchBar from '@/components/MainSearchBar';
import Notice from '@/components/Notice';

function Home() {
  const navigate = useNavigate();

  const handleSelect = (queueKey) => {
    navigate('/rooms', { state: { queue: queueKey } }); // ✅ state로 전달
  };

  return (
    <div className="w-full h-screen flex flex-col gap-20 pt-16">
      <div className="w-full flex items-center justify-center">
        <GameModeList onSelect={handleSelect} />
      </div>
      <div className="flex w-full items-center justify-center">
        <MainSearchBar />
      </div>
      <div className="flex w-full flex-1 justify-center">
        <Notice />
      </div>
    </div>
  );
}

export default Home;
