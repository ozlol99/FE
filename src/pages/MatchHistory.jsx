import { useEffect, useState } from 'react';
import UserProfile from '../components/UserProfile';
import {
  getAccountByRiotId,
  getSummonerByPuuid,
  getLeagueByPuuid,
  getRecentMatchIds,
  getMatchById,
} from '@/api/riot';
import PlayerInfo from '../components/PlayerInfo';
import PlayerMatchInfo from '../components/PlayerMatchInfo';

function MatchHistorych() {
  // const { userId } = useParams();
  // const [name, tag] = userId.split('-');

  const name = '산책못간나피리';
  const tag = 'KR11';

  // const [isLoding, setIsLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [summoner, setSummoner] = useState(null);
  const [rank, setRank] = useState(null);
  const [matchesInfo, setMatchesInfo] = useState([]); // 상세 경기 배열

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setIsLoading(true);
  //       const account = await getSummonerByName
  //     }catch{}
  //   })
  //   console.log(`${name}#${tag}`);
  // }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchUserData() {
      try {
        // 1) 기본 계정/소환사/랭크
        const accountData = await getAccountByRiotId(name, tag);
        if (!mounted) return;
        setAccount(accountData);

        const summonerData = await getSummonerByPuuid(accountData.puuid);
        if (!mounted) return;
        setSummoner(summonerData);

        const rankData = await getLeagueByPuuid(accountData.puuid);
        if (!mounted) return;
        setRank(rankData);

        // 2) 최근 매치 ID들
        const ids = await getRecentMatchIds(accountData.puuid, 20);

        // 3) 상세 매치 정보 병렬 호출 (실패는 건너뛰기)
        const infos = await Promise.all(
          (ids || []).map((id) =>
            getMatchById(id).catch((err) => {
              console.error(
                'getMatchById fail:',
                id,
                err?.response?.data || err?.message,
              );
              return null;
            }),
          ),
        );

        if (!mounted) return;
        setMatchesInfo(infos.filter(Boolean));
      } catch (err) {
        console.error(
          'fetchUserData error:',
          err?.response?.data || err?.message,
        );
      }
    }

    fetchUserData();
    return () => {
      mounted = false;
    };
  }, [name, tag]);

  return (
    <div>
      <UserProfile summoner={summoner} account={account} rank={rank} />\{' '}
      <div className="summonersContainer grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-4 mt-4 items-start">
        <div className="rounded-lg p-3 self-start">
          <PlayerInfo summoner={summoner} account={account} rank={rank} />
        </div>

        {/* 오른쪽: 매치 카드 리스트 */}
        <div className="min-h-screen">
          {summoner?.puuid && (
            <PlayerMatchInfo matchesInfo={matchesInfo} puuid={summoner.puuid} />
          )}
        </div>
      </div>
    </div>
  );
}
export default MatchHistorych;
