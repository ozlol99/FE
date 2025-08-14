import { useEffect, useState } from 'react';
import ChampionInfo from '../components/ChampionInfo';
import ChampionSidebar from '../components/ChampionSidebar';
import { fetchChampionList } from '../api/champions';

function Champions() {
  const [champions, setChampions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchChampionList().then(setChampions);
  }, []);

  console.log(champions);
  console.log(selectedId);

  return (
    <>
      <div className=" w-full h-full  flex justify-center items-center px-0 mid:px-6 pt-3.5">
        <div className="max-w-[1440px] w-full mx-auto h-full">
          <div className="flex flex-col md:flex-row h-full min-w-0">
            <div className="min-w-0">
              <ChampionSidebar
                champions={champions}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
            <div className="min-w-0 flex-1">
              <ChampionInfo />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Champions;
