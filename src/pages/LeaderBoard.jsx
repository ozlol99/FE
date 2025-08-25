import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LeaderOptionbar from '@/components/LeaderOptionbar';
import { getChallenger, getAccountByPuuid } from '@/api/riot';
import Pagination from '../components/Pagination';
import challenger from '@/assets/tier/challenger.png';

const STATUS = { LOADING: 'loading', SUCCESS: 'success', ERROR: 'error' };
const PAGE_SIZE = 5; //페이지 1에 5개 조회

const tierImages = {
  CHALLENGER: challenger,
};

export default function LeaderBoard() {
  const [queueType, setQueueType] = useState('RANKED_SOLO_5x5');
  const [status, setStatus] = useState(STATUS.LOADING);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [riotIdMap, setRiotIdMap] = useState({});

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setStatus(STATUS.LOADING);
        setPage(1);

        const data = await getChallenger(queueType);
        if (!alive) return;

        const sorted = (data.entries ?? [])
          .slice()
          .sort((a, b) => (b.leaguePoints || 0) - (a.leaguePoints || 0))
          .map((e, i) => ({
            rank: i + 1,
            puuid: e.puuid ?? null,
            summonerName: e.summonerName || '',
            tier: data.tier || 'CHALLENGER',
            lp: e.leaguePoints || 0,
            wins: e.wins || 0,
            losses: e.losses || 0,
          }));

        setRows(sorted.slice(0, 100));
        setStatus(STATUS.SUCCESS);
      } catch (e) {
        console.error('챌린저 호출 실패:', e);
        if (!alive) return;
        setStatus(STATUS.ERROR);
      }
    })();
    return () => {
      alive = false;
    };
  }, [queueType]);

  const current = useMemo(() => {
    const s = (page - 1) * PAGE_SIZE;
    return rows.slice(s, s + PAGE_SIZE);
  }, [rows, page]);

  useEffect(() => {
    const targets = [
      ...new Set(current.map((u) => u.puuid).filter((p) => p && !riotIdMap[p])),
    ];
    if (!targets.length) return;

    let alive = true;
    let i = 0;
    const CONCURRENCY = 3;
    // 페이지 이동 시 현재 5명만 조회
    (async () => {
      const worker = async () => {
        while (i < targets.length) {
          const puuid = targets[i++];
          try {
            const acc = await getAccountByPuuid(puuid);
            if (!alive || !acc?.gameName || !acc?.tagLine) continue;
            const riotId = `${acc.gameName}#${acc.tagLine}`;
            setRiotIdMap((prev) => ({ ...prev, [puuid]: riotId }));
          } catch {
            console.log('조회 오류 :');
          }
        }
      };
      await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    })();

    return () => {
      alive = false;
    };
  }, [current, riotIdMap]);

  if (status === STATUS.LOADING) {
    return (
      <section className="flex-1 p-6">
        <div className="h-screen rounded-xl bg-white/10 animate-pulse" />
      </section>
    );
  }

  if (status === STATUS.ERROR) {
    return (
      <section className="flex-1 p-6 text-center">
        <div className="text-rose-300 mb-3">데이터를 불러오지 못했습니다.</div>
        <button
          className="px-3 py-2 rounded bg-teal-600 text-white"
          onClick={() => setQueueType((q) => q)}
        >
          다시 시도
        </button>
      </section>
    );
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));

  return (
    <>
      <div className="w-full">
        <div className="w-full flex items-center max-w-[1440px] mx-auto px-4 py-3 text-white">
          <LeaderOptionbar
            queueType={queueType}
            onChangeQueueType={setQueueType}
          />
        </div>
      </div>
      <div className="w-full min-h-screen flex justify-center px-0 mid:px-6">
        <div className="max-w-[1440px] w-full mx-auto h-full">
          <div className=" grid grid-cols-[30px_1fr_50px_50px] md:grid-cols-[60px_1fr_200px_150px_150px] p-3 gap-2 bg-[#232323] text-white h-12 rounded-t-xl">
            <div>순위</div>
            <div>소환사명</div>
            <div>티어</div>
            <div>LP</div>
            <div className="hidden md:inline">승률</div>
          </div>
          {current.map((u, i) => {
            const winRate =
              u.wins + u.losses > 0
                ? ((u.wins / (u.wins + u.losses)) * 100).toFixed(1)
                : '0.0';

            const display =
              riotIdMap[u.puuid] || u.summonerName || '(이름 비공개)';
            const [name, tag = ''] = display.includes('#')
              ? display.split('#')
              : [display, ''];

            const key = `${u.puuid ?? u.summonerName ?? 'row'}-${u.rank ?? i}`;
            return (
              <div
                key={key}
                className="grid grid-cols-[30px_1fr_50px_50px] md:grid-cols-[60px_1fr_200px_150px_150px] p-3 gap-2 bg-[#2f2f2f] text-white text-sm h-12 border-b border-white/10"
              >
                <div>{u.rank}</div>
                <div className="truncate">
                  {tag ? (
                    <Link
                      className="text-white hover:underline hover:text-cyan-300"
                      to={`/match-detail/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`}
                    >
                      {display}
                    </Link>
                  ) : (
                    <span>{display}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src={tierImages[u.tier]}
                    alt={u.tier}
                    className="w-6 h-6 object-contain"
                  />
                  <span className="hidden md:inline text-xs">{u.tier}</span>
                </div>
                <div>{u.lp}</div>
                <div className="hidden md:inline">{winRate}%</div>
              </div>
            );
          })}
          <div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(p) => setPage(p)}
              blockSize={10} // 데스크탑 노출 개수
              mobileMax={5} // 모바일은 5
            />
          </div>
        </div>
      </div>
    </>
  );
}
