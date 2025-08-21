import { IconHeart, IconX } from '@/icons';
export function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-[#2b2b2b] text-[#bdbdbd] border border-[#3a3a3a]">
      {children}
    </span>
  );
}

export default function ParticipantCard({ member, onRemove, onAddLike }) {
  return (
    <div className="relative rounded-xl bg-[#242424] border border-[#343434] p-1.5 shadow-md">
      <button
        title="닫기"
        onClick={() => onRemove?.(member.id)}
        className="absolute right-2 top-2 text-[#8b8b8b] hover:text-[#e2e2e2] transition cursor-pointer"
      >
        <IconX />
      </button>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#383838] text-xs text-[#cfcfcf]">
          {member.profile || 'P'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold text-sm text-white">
              {member.name}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[12px] text-[#cfc2ff]">
              <span className="font-semibold tracking-tight">Master</span>
              <span className="opacity-70">· {member.lp} LP</span>
            </span>
            <span className="text-[11px] text-[#9f9f9f]">
              {member.wins}승 {member.losses}패
            </span>
            <span className="text-[11px] text-[#9f9f9f]">
              승률 {member.rate}%
            </span>
          </div>
        </div>

        {/* 좋아요 버튼 */}
        <button
          onClick={() => onAddLike?.(member.id)}
          className="ml-auto flex gap-1 items-center rounded-full p-1  text-rose-400 hover:scale-100 transition absolute right-1 bottom-1 cursor-pointer"
        >
          <IconHeart filled className="w-3 h-3" />
          <span className="text-xs text-[#dcdcdc]">{member.likes ?? 0}</span>
        </button>
      </div>
    </div>
  );
}
