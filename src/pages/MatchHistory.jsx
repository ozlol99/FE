import { useEffect, useState } from 'react';
import UserProfile from '../components/UserProfile';
import {
  getAccountByRiotId,
  getLeagueByPuuid,
  getSummonerByPuuid,
} from '../api/riot';

function MatchHistorych() {
  // const { userId } = useParams();
  // const [name, tag] = userId.split('-');

  const name = '이상호93';
  const tag = 'KR1';

  // const [isLoding, setIsLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [summoner, setSummoner] = useState(null);
  const [rank, setRank] = useState(null);

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
      const accountData = await getAccountByRiotId(name, tag);
      if (!mounted) return;
      setAccount(accountData);

      const summonerData = await getSummonerByPuuid(accountData.puuid);
      if (!mounted) return;
      setSummoner(summonerData);

      const rankData = await getLeagueByPuuid(accountData.puuid);
      setRank(rankData);
    }

    fetchUserData();
  }, []);

  return (
    <div>
      <UserProfile summoner={summoner} account={account} rank={rank} />
    </div>
  );
}
export default MatchHistorych;
