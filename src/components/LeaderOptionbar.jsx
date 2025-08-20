export default function LeaderOptionbar({ queueType, onChangeQueueType }) {
  const options = [
    { value: 'RANKED_SOLO_5x5', label: '개안/2인 랭크 게임' },
    { value: 'RANKED_FLEX_SR', label: '자유 랭크 게임' },
  ];
  return (
    <div className="inline-flex rounded-xl border-2 border-white/10 overflow-hidden">
      {options.map((opt) => {
        const active = queueType === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChangeQueueType(opt.value)}
            className={`px-4 py-2 text-sm transition
            ${active ? 'bg-teal-500 font-semibold' : 'bg-transparent hover:bg-white/10'}
          `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
