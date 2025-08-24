import discordGreen from '@/assets/discord-green.svg';
import discordYellow from '@/assets/discord-yellow.svg';
import micOn from '@/assets/mic-on.svg';
import micOff from '@/assets/mic-off.svg';
import micNo from '@/assets/mic-no.svg';

export default function RoomCard({ room, onClick, onJoin }) {
  const {
    id,
    name,
    current_members,
    max_members,
    queue_type,
    use_discord,
    mic_required,
    listen_only_allowed,
    hashtags = [],
    owner_nickname,
    created_ago,
  } = room;

  const QUEUE_INFO = {
    solo_lank: { label: '솔로랭크', map: '소환사의 협곡' },
    flex: { label: '자유랭크', map: '소환사의 협곡' },
    aram: { label: '칼바람', map: '칼바람 나락' },
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(id)}
      className="relative overflow-hidden rounded-2xl border border-[#2b3240]/70 bg-[#0f141b] p-4 text-[#eaeaea] hover:bg-[#121824]"
    >
      {/* 상단: 제목 / 인원 */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold truncate">{name}</h3>
        <span className="text-sm text-slate-400 shrink-0">
          참여인원 {current_members} / {max_members}
        </span>
      </div>

      <div className="my-3 h-px bg-white/10" />

      {/* 중단: 해시태그 / 아이콘 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {hashtags.slice(0, 3).map((h) => (
            <span
              key={h.id}
              className="text-xs text-slate-300/90 bg-white/5 px-2 py-0.5 rounded-full"
            >
              #{h.name}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* 디스코드: true → 초록, false → 노랑 */}
          <img
            src={use_discord ? discordGreen : discordYellow}
            alt="Discord"
            className="h-5 w-5 opacity-90"
          />
          {/* 마이크: true → 켜짐, false → 꺼짐 */}
          <img
            src={mic_required ? micOn : micOff}
            alt="Mic"
            className="h-5 w-5 opacity-90"
          />
          {/* 듣기만 허용: true일 때만 표시 */}
          {listen_only_allowed && (
            <img src={micNo} alt="ListenOnly" className="h-5 w-5 opacity-90" />
          )}
        </div>
      </div>

      {/* 하단 */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="flex-1 text-xs text-slate-400 truncate">
          {QUEUE_INFO[queue_type]?.map || ''} ·
          {QUEUE_INFO[queue_type]?.label || queue_type} ·{created_ago} · 방장{' '}
          {owner_nickname}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onJoin?.(id);
          }}
          className="px-2 py-1.5 text-sm font-semibold rounded-md bg-[#00BBA3] text-[#0b0f14] cursor-pointer"
        >
          참가
        </button>
      </div>
    </div>
  );
}
