import { tierImages } from '@/data/tierImages';
import PositionUsageBars from './PositionUsageBars';

function PlayerInfo({ ranks, highest, summary }) {
  const solo = ranks?.solo || null;

  // 2) 현재 솔랭 없으면 최고티어로 폴백
  const tier = solo?.tier || highest?.highest_solo_tier || 'UNRANKED';
  const division = solo?.rank || highest?.highest_solo_rank || '';
  const lp = solo?.league_points ?? highest?.highest_solo_lp ?? 0;
  const wins = solo?.wins ?? 0;
  const losses = solo?.losses ?? 0;
  const total = wins + losses;
  const winRate = total > 0 ? (solo?.win_rate ?? (wins / total) * 100) : 0;

  function formatTier(tier, rnk) {
    const upperTiers = ['MASTER', 'GRANDMASTER', 'CHALLENGER'];
    if (!tier) return 'UNRANKED';
    return upperTiers.includes(tier) ? tier : `${tier} ${rnk || ''}`.trim();
  }

  const displayTier = formatTier(tier, division);
  const tierImg = tierImages?.[tier]; // 없으면 로고 숨김

  return (
    <div className="flex flex-col w-full gap-3 p-3 h-[200px]">
      <div className=" flex w-full h-full gap-2.5 border justify-center items-center border-stone-400 rounded-xl">
        <div className="flex justify-center items-center w-24 h-24 ">
          {tierImg && (
            <img src={tierImg} alt={tier} className="object-contain" />
          )}
        </div>
        <div className="flex flex-col gap-2.5 justify-center items-start">
          <span className="font-bold text-lg text-white">{displayTier}</span>
          <span className="font-light text-stone-300">{lp} LP</span>
        </div>
        <div className="flex flex-1 justify-end p-2.5">
          <div className="flex flex-col gap-2.5 justify-center items-end">
            <div className="flex flex-col gap-1.5">
              <span className="font-light text-sm text-stone-300">
                {wins} 승
              </span>
              <span className="font-light text-sm text-stone-300">
                {losses} 패
              </span>
            </div>
            <span className="font-light text-sm text-stone-300">승률</span>
            <span className="font-light text-sm text-stone-300">
              {/* 기존에 nan 으로 뜨는 경우가 있어서 무한대/NaN 아님 인지 확인 */}
              {Number.isFinite(winRate) ? winRate.toFixed(2) : '0.00'} %
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 border border-stone-400 rounded-lg p-2">
          <div className="text-sm font-light text-center text-white">
            포지션별 플레이 횟수
          </div>
          <PositionUsageBars byPosition={summary?.byPosition} />
        </div>
      </div>
    </div>
  );
}

export default PlayerInfo;
