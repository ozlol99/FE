import React from 'react';
import { formatGameDuration, timeAgoTimestamp } from '../utils/timeFormat';
import { positionIcons } from '../data/positionIcons';
import { getChampionImg, getRuneImg, getSpellImg } from '../data/imageCDN';

function PlayerMatchCard({ matchesInfo, puuid }) {
  if (!puuid || !matchesInfo) return null;

  const match = Array.isArray(matchesInfo) ? matchesInfo[0] : matchesInfo;
  const myData = match?.info?.participants.find((p) => p.puuid === puuid);

  console.log('--------------------------------------');
  console.log('PlayerMatchCard teamPosition:', myData?.teamPosition);

  if (!myData) return null; // 데이터 없으면 렌더 안 함

  const Icon = positionIcons[myData?.teamPosition];
  console.log(myData.perks);
  console.log(myData.perks?.styles);
  console.log(myData.perks?.styles?.[0]);
  console.log(myData.perks?.styles?.[0]?.selections);
  console.log(myData.perks?.styles?.[0]?.selections?.[0]);

  return (
    <div className=" relative flex w-full border-l-8 border-l-red-600 rounded-xl min-h-[110px] ">
      <div className=" absolute w-full h-full top-0 inset-0 bg-red-400/40 -z-10"></div>
      <div className="flex flex-col flex-1 w-20 p-1 gap-1 text-xs justify-center ">
        <div>개인 /2인 랭크</div>
        <div>{timeAgoTimestamp(matchesInfo?.info?.gameEndTimestamp)}</div>
        <div className="w-10 border border-stone-500"></div>
        <div>승리</div>
        <div>{formatGameDuration(matchesInfo?.info?.gameDuration)}</div>
      </div>
      <div className="flex flex-col flex-1 w-20 p-1 gap-1 text-xs justify-center ">
        <Icon className="w-6 h-6 fill-white" />
      </div>
      <div className="flex flex-col flex-1 w-20 p-1 gap-1 text-xs justify-center ">
        <div className="flex ">
          <div className="w-14 h-14 overflow-hidden">
            <img
              src={getChampionImg(myData?.championName)}
              alt="champion"
              className="w-full h-full object-cover"
            ></img>
          </div>
          <div className=" grid grid-cols-2 grid-rows-2 gap-1">
            <img
              src={getSpellImg(myData?.summoner1Id)}
              alt="Spell1"
              className="w-6 h-6 rounded object-contain"
            />
            <img
              src={getSpellImg(myData?.summoner2Id)}
              alt="Spell2"
              className="w-6 h-6 rounded object-contain"
            />
            <img
              src={getRuneImg(myData.perks?.styles?.[0]?.selections?.[0]?.perk)}
              alt="Primary Rune"
              className="w-6 h-6 rounded object-contain"
            />
            <img
              src={''}
              alt="Sub Rune"
              className="w-6 h-6 rounded object-contain"
            />
          </div>
        </div>
        <div className="flex ">
          <div className="">
            <img></img>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerMatchCard;
