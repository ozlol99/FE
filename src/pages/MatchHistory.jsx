import { useEffect, useState } from 'react';
import UserProfile from '../components/UserProfile';
import PlayerInfo from '../components/PlayerInfo';
import PlayerMatchInfo from '../components/PlayerMatchInfo';
import { useParams } from 'react-router-dom';
import { getSummonerInfo } from '../api/riot';
import { mapSummonerInfo } from '../utils/mapSummonerInfo';

function MatchHistorych() {
  const { name, tag } = useParams();
  console.log(name, tag);

  const [view, setView] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await getSummonerInfo(name, tag);
        if (!mounted) return;
        const vm = mapSummonerInfo(raw);
        setView(vm);
      } catch (e) {
        setErr(e);
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [name, tag]);

  // 전적 갱신 핸들러
  async function handleRefresh() {
    const raw = await getSummonerInfo(name, tag);
    setView(mapSummonerInfo(raw));
  }

  if (err) return <div className="p-4">불러오기 실패</div>;
  if (!view) return <div className="p-4">로딩...</div>;

  const { profile, ranks, highest, summary, matches } = view;

  return (
    <div className="flex justify-center flex-col items-center ">
      <div className=" ">
        <UserProfile profile={profile} onRefresh={handleRefresh} />
        <div className="summonersContainer grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] gap-4 mt-4 items-start">
          <div className="rounded-lg p-3 self-start">
            <PlayerInfo ranks={ranks} highest={highest} summary={summary} />
          </div>

          <div className="min-h-screen">
            <PlayerMatchInfo matches={matches} puuid={profile.puuid} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default MatchHistorych;
