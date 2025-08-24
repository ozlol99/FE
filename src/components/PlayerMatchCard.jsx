import React from 'react';
import { getChampionImg, getItemImg, getSpellImg } from '../data/imageCDN';

function PlayerMatchCard({ match, puuid }) {
  if (!puuid || !match) return null;

  const isWin = match.win === true;
  const isLose = match.win === false;

  const base = 'relative flex w-full rounded-r-xl p-2 min-h-[110px] text-white';
  let stateClass = isWin
    ? 'bg-emerald-300/50'
    : isLose
      ? 'bg-rose-300/50'
      : 'bg-slate-300/50';

  return (
    <div className={`${base} ${stateClass}`}>
      <div className="flex flex-col w-24 p-1 gap-1 text-xs justify-center">
        <div>{match?.rankType || '일반'}</div>
        <div>{match?.endAtText || ''}</div>
        <div
          className={`w-10 border 
    ${match?.win ? 'border-green-600 bg-green-600' : 'border-red-600 bg-red-600'}`}
        />
        <div>{match?.win ? '승리' : '패배'}</div>
        <div>{match?.durationText || ''}</div>
      </div>

      <div className="flex items-center justify-center w-16 shrink-0">
        <img
          src={getChampionImg(match?.champion)}
          alt={match?.champion || 'champion'}
          className="w-12 h-12 object-cover"
          onError={(e) => {
            e.currentTarget.src = '/fallback.png';
          }}
        />
      </div>

      <div className="flex-1 min-w-[80px] sm:min-w-[120px] px-2 flex justify-center items-center">
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            {match.spells.map((id, i) => (
              <img
                key={i}
                src={getSpellImg(id)}
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 shrink-0"
              />
            ))}
          </div>
          <div className="flex gap-1 flex-wrap">
            {match.items.map((id, i) => (
              <img
                key={i}
                src={getItemImg(id)}
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="w-24 shrink-0 flex items-center justify-center text-right felx ">
        <div className="text-sm font-semibold leading-tight">
          {match.kda.kills}/{match.kda.deaths}/{match.kda.assists}
          <div className="text-xs opacity-90">{match.kda.kda_ratio}</div>
        </div>
      </div>

      <div className="hidden sm:flex flex-col sm:flex-row gap-4 text-[11px] leading-5">
        <div className="flex-1">
          {match.teamList
            ?.filter((p) => p.team_id === 100)
            .map((p, i) => (
              <div key={i} className="flex items-center gap-1">
                <img
                  src={getChampionImg(p.champion)}
                  alt={p.champion}
                  className="w-4 h-4 shrink-0"
                />
                <span className="w-15 truncate overflow-hidden text-ellipsis">
                  {p.summoner_name}
                </span>
              </div>
            ))}
        </div>
        <div className="flex-1">
          {match.teamList
            ?.filter((p) => p.team_id === 200)
            .map((p, i) => (
              <div key={i} className="flex items-center gap-1">
                <img
                  src={getChampionImg(p.champion)}
                  alt={p.champion}
                  className="w-4 h-4 shrink-0"
                />
                <span className="w-15 truncate overflow-hidden text-ellipsis">
                  {p.summoner_name}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default PlayerMatchCard;
