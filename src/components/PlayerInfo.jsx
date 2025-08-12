import { tierImages } from '@/data/tierImages';

function PlayerInfo({ rank }) {
  if (!rank) return '';
  const solo = rank?.find((e) => e.queueType === 'RANKED_SOLO_5x5');
  const tier = solo?.tier;
  const lp = solo?.leaguePoints;

  function formatTier(tier, rank) {
    const upperTiers = ['MASTER', 'GRANDMASTER', 'CHALLENGER'];
    return upperTiers.includes(tier) ? tier : `${tier} ${rank}`;
  }

  const displayTier = formatTier(solo?.tier, solo?.rank);

  return (
    <div className="flex flex-col w-full gap-3 p-3">
      <div className=" flex w-full h-40 gap-2.5 border border-stone-400 rounded-xl">
        <div className="flex justify-center items-center w-25 h-full">
          {tier !== '-' && (
            <img
              src={tierImages[tier]}
              alt={tier}
              className="w-24 h-24 object-contain"
            />
          )}
        </div>
        <div className="flex flex-col gap-2.5 justify-center items-start">
          <span className="font-bold text-xl text-white">{displayTier}</span>
          <span className="font-light text-stone-300">{lp} LP</span>
        </div>
        <div className="flex flex-1 justify-end p-2.5">
          <div className="flex flex-col gap-2.5 justify-center items-end">
            <div className="flex flex-col gap-1.5">
              <span className="font-light text-sm text-stone-300">
                {solo?.wins} 승
              </span>
              <span className="font-light text-sm text-stone-300">
                {solo?.losses} 패
              </span>
            </div>
            <span className="font-light text-sm text-stone-300">
              승률{' '}
              {((solo?.wins / (solo?.losses + solo?.wins)) * 100).toFixed(2)} %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerInfo;
