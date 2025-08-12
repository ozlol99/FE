import React from 'react';
import { formatGameDuration, timeAgoTimestamp } from '../utils/timeFormat';
import { getPositionIcon } from '../data/positionIcons';
import {
  getChampionImg,
  getItemImg,
  getKeystoneImg,
  getSpellImg,
} from '../data/imageCDN';

function PlayerMatchCard({ match, puuid }) {
  if (!puuid || !match) return null;

  const info = match?.info;
  const myData = match?.info?.participants.find((p) => p.puuid === puuid);

  if (!myData) return null; // 데이터 없으면 렌더 안 함

  //   승 패 여부에 따라 색상 다르게 주기 ㄱ #1 start #######

  const winFlag = myData?.win;
  const isRemake = (info?.gameDuration ?? 0) < 300; //5분 미만 닷지 리메이크
  const isWin = winFlag === true && !isRemake;
  const isLose = winFlag === false && !isRemake;

  const base =
    'relative flex w-full rounded-r-xl p-2 md:p-2 pl-4 min-h-[110px] md:pl-5 text-white';
  let stateClass = '';
  if (isWin) {
    stateClass =
      'bg-emerald-50 dark:bg-emerald-300/50 dark:border-emerald-700/40';
  } else if (isLose) {
    stateClass = 'bg-rose-50 dark:bg-rose-300/50 dark:border-rose-700/40';
  } else {
    stateClass = 'bg-slate-50 dark:bg-slate-300/50 dark:border-slate-700/40';
  }

  const accentClass = isWin
    ? 'bg-emerald-400'
    : isLose
      ? 'bg-rose-400'
      : 'bg-slate-400';

  //   승 패 여부에 따라 색상 다르게 주기 ㅣ #1 end #######

  const keystoneId = myData?.perks?.styles?.[0]?.selections?.[0]?.perk;
  const keystoneUrl = getKeystoneImg(keystoneId) ?? '/fallback-rune.png';
  const subRuneId = myData?.perks?.styles?.[0]?.selections?.[1]?.perk;
  const subRuneUrl = getKeystoneImg(subRuneId) ?? '/fallback-rune.png';
  console.log('subRuneId', subRuneId);
  console.log('keystoneId', keystoneId);

  const Icon = getPositionIcon(myData?.teamPosition);
  console.log(myData.perks);
  console.log(myData.perks?.styles);
  console.log(myData.perks?.styles?.[0]);
  console.log(myData.perks?.styles?.[0]?.selections);
  console.log(myData.perks?.styles?.[0]?.selections?.[0]);

  return (
    // <div className=" relative flex w-full  border-l-8 border-l-rose-600 rounded-xl min-h-[110px] ">
    //   <div className=" absolute w-full h-full top-0 inset-0 bg-red-400/40 -z-10"></div>
    <div className={`${base} ${stateClass}`}>
      <div
        className={`absolute left-0 top-0 h-full w-1.5 ${accentClass}`}
      ></div>
      <div className="flex flex-col flex-1 w-20 p-1 gap-1 text-xs justify-center pl-2">
        <div>개인 /2인 랭크</div>
        <div>
          {timeAgoTimestamp(info?.gameEndTimestamp ?? info?.gameStartTimestamp)}
        </div>
        <div className="w-10 border border-stone-500"></div>
        <div>{myData.win ? '승리' : '패배'}</div>
        <div>{formatGameDuration(info?.gameDuration)}</div>
      </div>
      <div className="flex flex-col w-10 p-1 gap-1 text-xs justify-center items-center">
        <div className="flex justify-center items-center w-9 h-9 border border-white">
          {Icon ? <Icon className="w-6 h-6 fill-white " /> : null}
        </div>
      </div>
      <div className="flex flex-col w-100 p-1 gap-1 text-xs justify-center items-start ">
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
              src={keystoneUrl}
              alt="Primary Rune"
              className="w-6 h-6 rounded object-contain"
            />
            <img
              src={subRuneUrl}
              alt="Sub Rune"
              className="w-6 h-6 rounded object-contain"
            />
          </div>
        </div>
        <div className="flex ">
          <ItemList data={myData} size={6} />
        </div>
      </div>
      <div className="flex flex-col flex-1 w-20 p-1 gap-1 text-xs justify-center ">
        asdfasdfas
      </div>
    </div>
  );
}

function ItemList({ data, size = 6 }) {
  const fallback = '/fallback.png';

  return (
    <div className="flex gap-1">
      {Array.from({ length: 7 }, (_, slot) => {
        const itemId = data[`item${slot}`];
        return (
          <img
            key={slot}
            src={itemId ? getItemImg(itemId) : fallback}
            alt={`item${slot}`}
            onError={(e) => {
              e.currentTarget.src = fallback;
            }}
            className={`w-${size} h-${size} object-cover border border-gray-700`}
          />
        );
      })}
    </div>
  );
}

export default PlayerMatchCard;
