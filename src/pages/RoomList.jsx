import { useState } from 'react';

const DEFAULT_QUEUES = [
  { key: 'all', label: '전체' },
  { key: 'solo', label: '솔로랭크' },
  { key: 'flex', label: '자유랭크' },
  { key: 'aram', label: '칼바람 나락' },
];

export default function RoomList({
  selectedQueue,
  onChangeQueue,
  onCreateRoom,
  queues,
}) {
  const items = queues?.length ? queues : DEFAULT_QUEUES;
  const [internal, setInternal] = useState(items[0]?.key ?? 'all');
  const active = selectedQueue ?? internal;

  const setActive = (key) =>
    onChangeQueue ? onChangeQueue(key) : setInternal(key);

  // const onKeyDown = (e) => {
  //   if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
  //   const next = e.key === "ArrowRight"
  //     ? items[(index + 1) % items.length]
  //     : items[(index - 1 + items.length) % items.length];
  //   setActive(next.key);
  // };

  return (
    <div className="min-h-dvh bg-[#0f1115] text-[#eaeaea]">
      <div className="mx-auto w-full max-w-[90%] px-4 pt-20">
        <div className="overflow-x-auto">
          <div className="inline-flex rounded-full border border-[#2b3240] bg-[#1a1f29] shadow-inner">
            {items.map((q, i) => {
              const isActive = active === q.key;
              return (
                <button
                  key={q.key}
                  type="button"
                  onClick={() => setActive(q.key)}
                  className={[
                    'px-4 py-2 text-sm font-medium whitespace-nowrap select-none transition',
                    'first:rounded-l-full last:rounded-r-full',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BBA3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1115]',
                    i > 0 ? 'border-l border-[#2b3240]' : '',
                    isActive
                      ? 'bg-[#00BBA3] text-[#0b0f14]'
                      : 'text-slate-300 hover:bg-[#232a36]',
                  ].join(' ')}
                  aria-pressed={isActive}
                >
                  {q.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* (카드/리스트 영역은 이후 컴포넌트에서 구현 예정) */}
      <div className="mx-auto w-full max-w-[80%] px-4 py-8">
        <div className="rounded-2xl border border-[#2b3240] bg-[#0f141b] p-4 overflow-hidden">
          {/* 그리드 패턴 배경 */}
          <div className="rounded-xl p-4 min-h-[40vh]">
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-5">
              <div className="h-24 rounded-lg border border-dashed border-[#3a4252] bg-black/10" />
              <div className="h-24 rounded-lg border border-dashed border-[#3a4252] bg-black/10" />
              <div className="h-24 rounded-lg border border-dashed border-[#3a4252] bg-black/10" />
              <div className="h-24 rounded-lg border border-dashed border-[#3a4252] bg-black/10" />
              <div className="h-24 rounded-lg border border-dashed border-[#3a4252] bg-black/10" />
              <div className="h-24 rounded-lg border border-dashed border-[#3a4252] bg-black/10" />
            </div>
            {/* ↑ 여기까지 예시 */}
          </div>
        </div>
      </div>

      {/* 플로팅 + 버튼 */}
      <button
        type="button"
        aria-label="방 만들기"
        onClick={onCreateRoom}
        className="fixed bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full border border-[#2b3240] bg-[#22d3ee] text-[#0b0f14] shadow-lg transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
