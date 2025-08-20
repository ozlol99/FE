export default function Chat({ mine, system, text, time }) {
  if (system) {
    return (
      <div className="my-1 text-xs text-[#9c9c9c] flex items-center gap-2 px-2">
        <span className="h-[1px] flex-1 bg-[#333]" />
        <span>{text}</span>
        <span className="h-[1px] flex-1 bg-[#333]" />
      </div>
    );
  }
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'} my-1`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow ${mine ? 'bg-[#5d5cf5] text-white' : 'bg-[#2a2a2a] text-[#eaeaea]'}`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
        <div
          className={`mt-1 text-[10px] ${mine ? 'text-white/80' : 'text-[#b3b3b3]'}`}
        >
          {time}
        </div>
      </div>
    </div>
  );
}
