// import { useEffect, useState } from 'react';
// import LeaderOptionbar from '../components/LeaderOptionbar';

// import dummy from '../data/dummyRanks.json';
// import { Link } from 'react-router-dom';

// const STATUS = {
//   LOADING: 'loading',
//   SUCCESS: 'success',
//   ERROR: 'error',
// };

// export default function LeaderBoard() {
//   const [queueType, setQueueType] = useState('RANKED_SOLO_5x5');
//   const [status, setStatus] = useState(STATUS.LOADING);

//   useEffect(() => {
//     setStatus(STATUS.SUCCESS);
//   }, []);

//   const [page, setPage] = useState(1);
//   const size = 50; // 1페이지에 50명

//   // 현재 페이지 데이터
//   const start = (page - 1) * size;
//   const end = start + size;
//   const currentPageData = dummy.items.slice(start, end);

//   if (status === STATUS.LOADING) {
//     return (
//       <section className="flex-1 p-6">
//         <div className="h-screen rounded-xl bg-white/10 animate-pulse"></div>
//       </section>
//     );
//   }

//   if (status === STATUS.ERROR) {
//     return (
//       <section className="flex-1 p-6 text-center">
//         <div className="text-rose-300 mb-3">데이터를 불러오지 못했습니다.</div>
//         <button
//           className="px-3 py-2 rounded bg-teal-600 text-white"
//           // onClick={loadDetail} //수정
//         >
//           다시 시도
//         </button>
//       </section>
//     );
//   }

//   return (
//     <>
//       <div className="w-full">
//         <div className="w-full max-w-[1440px] mx-auto px-4 py-3 text-white">
//           <LeaderOptionbar
//             queueType={queueType}
//             onChangeQueueType={setQueueType}
//           />
//         </div>
//       </div>
//       <div className=" w-full min-h-screen flex justify-center px-0 mid:px-6 pt-3.5">
//         <div className="max-w-[1440px] w-full mx-auto h-full">
//           <div className="grid grid-cols-[40px_1fr_120px_80px] md:grid-cols-[40px_1fr_120px_80px_80px_150px] p-3 gap-2 bg-[#232323] text-white h-12 md:rounded-t-xl ">
//             <div>순위</div>
//             <div>소환사명</div>
//             <div>티어</div>
//             <div>LP</div>
//             <div className="hidden md:block">레벨</div>
//             <div className="hidden md:block">승률</div>
//           </div>

//           {currentPageData.map((u) => {
//             // const [name, tag] = u.summonerName.split('#');
//             const winRate =
//               u.wins + u.losses > 0
//                 ? ((u.wins / (u.wins + u.losses)) * 100).toFixed(1)
//                 : '0.0';
//             return (
//               <div
//                 key={u.rank}
//                 className="grid grid-cols-[40px_1fr_120px_80px] md:grid-cols-[40px_1fr_120px_80px_80px_150px] p-3 gap-2 bg-[#2f2f2f] text-white font-medium text-xs h-12 border-b border-gray-700"
//               >
//                 <div>{u.rank}</div>
//                 <div className="text-blue-400 hover:underline">
//                   <Link
//                     to={`/match-detail/${encodeURIComponent()}/${encodeURIComponent()}`}
//                   >
//                     {/* {user.summonerName} */}
//                   </Link>
//                 </div>
//                 <div>{u.tier}</div>
//                 <div>{u.lp}</div>
//                 <div className="hidden md:block">{u.level}</div>
//                 <div className="hidden md:block">{winRate}%</div>
//               </div>
//             );
//           })}

//           {/* 페이지 버튼 */}
//           <div className="flex  justify-center gap-4 mt-4">
//             <button
//               className="px-3 text-xs py-2 bg-teal-600 rounded disabled:bg-gray-500"
//               onClick={() => setPage(1)}
//               disabled={page === 1}
//             >
//               1
//             </button>
//             <button
//               className="px-3 text-xs py-2 bg-teal-600 rounded disabled:bg-gray-500"
//               onClick={() => setPage(2)}
//               disabled={page === 2}
//             >
//               2
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LeaderOptionbar from '@/components/LeaderOptionbar';
import {
  getTopLeagueEntries,
  getSummonerById,
  getAccountByPuuid,
} from '@/api/riot';

const STATUS = { LOADING: 'loading', SUCCESS: 'success', ERROR: 'error' };
const PAGE_SIZE = 50;

export default function LeaderBoard() {
  const [queueType, setQueueType] = useState('RANKED_SOLO_5x5'); // or "RANKED_FLEX_SR"
  const [status, setStatus] = useState(STATUS.LOADING);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);

  // 랭킹 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setStatus(STATUS.LOADING);
        setPage(1);

        const top = await getTopLeagueEntries(queueType, 100);
        if (!alive) return;

        const mapped = top.map((e, i) => ({
          rank: i + 1,
          summonerName: e.summonerName || '', // 비어있을 수 있음
          summonerId: e.summonerId || null, // ← 없으면 null로
          puuid: e.puuid ?? null,
          tier: e.tier,
          lp: e.leaguePoints,
          wins: e.wins,
          losses: e.losses,
          level: null,
        }));
        setRows(mapped);
        setStatus(STATUS.SUCCESS);
      } catch (err) {
        console.error(err);
        if (!alive) return;
        setStatus(STATUS.ERROR);
      }
    })();
    return () => {
      alive = false;
    };
  }, [queueType]);

  // 현재 페이지
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, page]);

  // 현재 페이지에 이름/레벨 보강 (이름이 비었거나 레벨 없을 때만)
  useEffect(() => {
    const need = paged
      .map((u, idx) => ({ u, idx }))
      .filter(({ u }) => !u.summonerName || u.level == null);
    if (!need.length) return;

    let alive = true;
    (async () => {
      try {
        const patched = await Promise.all(
          need.map(async ({ u, idx }) => {
            const s = await getSummonerById(u.summonerId).catch(() => null);
            let name = s?.name || u.summonerName;
            let level = s?.summonerLevel ?? u.level;

            if (s?.puuid) {
              const acc = await getAccountByPuuid(s.puuid).catch(() => null);
              if (acc?.gameName && acc?.tagLine) {
                name = `${acc.gameName}#${acc.tagLine}`;
              }
            }
            return {
              pageIdx: idx,
              name: name || '(이름 비공개)',
              level: level ?? '-',
            };
          }),
        );

        if (!alive) return;
        setRows((prev) => {
          const copy = [...prev];
          const start = (page - 1) * PAGE_SIZE;
          patched.forEach(({ pageIdx, name, level }) => {
            const i = start + pageIdx;
            if (copy[i]) copy[i] = { ...copy[i], summonerName: name, level };
          });
          return copy;
        });
      } catch (e) {
        console.warn('이름/레벨 보강 실패:', e);
      }
    })();
    return () => {
      alive = false;
    };
  }, [paged, page]);

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
        <div className="text-rose-300 mb-3">라이엇 API 호출 실패</div>
        <button
          className="px-3 py-2 rounded bg-teal-600 text-white"
          onClick={() => setQueueType((q) => q)}
        >
          다시 시도
        </button>
      </section>
    );
  }

  return (
    <>
      {/* 옵션바 */}
      <div className="w-full bg-stone-500/80 backdrop-blur">
        <div className="w-full max-w-[1440px] mx-auto px-4 py-3 text-white">
          <LeaderOptionbar
            queueType={queueType}
            onChangeQueueType={setQueueType}
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="w-full min-h-screen flex justify-center px-0 mid:px-6 pt-3.5">
        <div className="max-w-[1440px] w-full mx-auto">
          {/* 헤더 */}
          <div className="grid grid-cols-[40px_1fr_120px_80px] md:grid-cols-[40px_1fr_120px_80px_80px_150px] p-3 gap-2 bg-[#232323] text-white h-12 md:rounded-t-xl">
            <div>순위</div>
            <div>소환사명</div>
            <div>티어</div>
            <div>LP</div>
            <div className="hidden md:block">레벨</div>
            <div className="hidden md:block">승률</div>
          </div>

          {/* 바디 */}
          {paged.map((u, i) => {
            const winRate =
              u.wins + u.losses > 0
                ? ((u.wins / (u.wins + u.losses)) * 100).toFixed(1)
                : '0.0';
            const key = `${u.summonerId ?? u.puuid ?? u.summonerName ?? 'row'}-${u.rank ?? i}`;
            return (
              <div
                key={key}
                className="grid grid-cols-[40px_1fr_120px_80px] md:grid-cols-[40px_1fr_120px_80px_80px_150px] p-3 gap-2 bg-[#2f2f2f] text-white font-medium text-xs h-12 border-b border-gray-700"
              >
                <div>{u.rank}</div>
                <div className="text-blue-400 hover:underline truncate">
                  <Link
                    to={`/match-detail/${encodeURIComponent(u.summonerName || u.summonerId)}`}
                  >
                    {u.summonerName || '(이름 비공개)'}
                  </Link>
                </div>
                <div>{u.tier}</div>
                <div>{u.lp}</div>
                <div className="hidden md:block">{u.level ?? '-'}</div>
                <div className="hidden md:block">{winRate}%</div>
              </div>
            );
          })}

          {/* 페이지 버튼 */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="px-3 text-xs py-2 bg-teal-600 rounded disabled:bg-gray-500"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              1
            </button>
            <button
              className="px-3 text-xs py-2 bg-teal-600 rounded disabled:bg-gray-500"
              onClick={() => setPage(2)}
              disabled={page === 2 || rows.length <= PAGE_SIZE}
            >
              2
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
