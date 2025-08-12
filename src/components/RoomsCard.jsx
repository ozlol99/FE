import discordGreen from '@/assets/discord-green.svg';
import discordYellow from '@/assets/discord-yellow.svg';
import micOn from '@/assets/mic-on.svg';
import micOff from '@/assets/mic-off.svg';
import micNo from '@/assets/mic-no.svg';

function fromNow(date) {
  const d = new Date(date);
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  const units = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];
  for (const [unit, sec] of units) {
    const v = Math.floor(diffSec / sec);
    if (v >= 1) return `${v} ${unit}${v > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

const QUEUE_LABEL = (q) => (q === 'aram' ? '칼바람 나락' : '소환사의 협곡');

export default function RoomCard({ room, onClick, onJoin }) {
  const {
    id,
    title,
    queue, // 'solo' | 'flex' | 'aram'
    members,
    capacity,
    tags = [],
    discord, // 'green' | 'yellow' (더미)
    mic, // 'on' | 'off' | 'no' (더미)
    createdAt,
    host,
  } = room;

  const discordIcon = discord === 'green' ? discordGreen : discordYellow;
  const micIcon = mic === 'on' ? micOn : mic === 'off' ? micOff : micNo;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(id)}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(id)}
      className="relative overflow-hidden
								rounded-2xl border border-[#2b3240]/70
								bg-[#0f141b]
								p-4 text-[#eaeaea]
								ring-1 ring-black/30
								shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_6px_18px_rgba(0,0,0,0.35)]
								hover:bg-[#121824] hover:ring-black/40
								transition outline-none focus-visible:ring-2 focus-visible:ring-[#00BBA3]"
    >
      {/* 상단: 제목 / 인원 */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold truncate">{title}</h3>
        <span className="text-sm text-slate-400 shrink-0">
          참여인원 {members} / {capacity}
        </span>
      </div>

      {/* 구분선 */}
      <div className="my-3 h-px bg-white/10" />

      {/* 중단: 해시태그 / 디스코드·마이크 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-xs text-slate-300/90 bg-white/5 px-2 py-0.5 rounded-full"
            >
              #{t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <img src={discordIcon} alt="Discord" className="h-5 w-5 opacity-90" />
          <img src={micIcon} alt="Mic" className="h-5 w-5 opacity-90" />
        </div>
      </div>

      {/* 하단: 맵/시간/방장 + 참가 버튼 */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="flex-1 min-w-0 max-w-[40ch] text-xs text-slate-400 truncate">
          {QUEUE_LABEL(queue)} · {fromNow(createdAt)} · 방장 {host}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onJoin?.(id);
          }}
          className="px-2 py-1.5 text-sm font-semibold rounded-md bg-[#00BBA3] text-[#0b0f14] hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:[#007566] cursor-pointer"
        >
          참가
        </button>
      </div>
    </div>
  );
}
