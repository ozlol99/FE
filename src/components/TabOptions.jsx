import { useRef } from 'react';

export default function TabOptions({
  items = [], // [{ key, label }]
  value, // active key
  onChange, // (key) => void
  wrapperClass = 'mx-auto w-full max-w-[90%] px-4 pt-20',
}) {
  const btnRefs = useRef({});

  if (!items.length) return null;

  const index = Math.max(
    0,
    items.findIndex((i) => i.key === value),
  );

  const focusKey = (k) => {
    // 렌더 뒤 포커스 이동
    requestAnimationFrame(() => btnRefs.current[k]?.focus());
  };

  const handleKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next =
      e.key === 'ArrowRight'
        ? items[(index + 1) % items.length]
        : items[(index - 1 + items.length) % items.length];
    onChange?.(next.key);
    focusKey(next.key);
  };

  const barClass =
    'inline-flex rounded-full border border-[#2b3240] bg-[#1a1f29] shadow-inner';

  return (
    <div className={wrapperClass}>
      <div className="overflow-x-auto">
        <div
          role="tablist"
          aria-label="큐 선택"
          onKeyDown={handleKeyDown}
          className={barClass}
        >
          {items.map((q, i) => {
            const isActive = value === q.key;
            const base =
              'px-4 py-2 text-sm font-medium whitespace-nowrap select-none transition cursor-pointer ' +
              'first:rounded-l-full last:rounded-r-full ' +
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BBA3] ' +
              'focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1115]';
            const divider = i > 0 ? ' border-l border-[#2b3240]' : '';
            const state = isActive
              ? ' bg-[#00BBA3] text-[#0b0f14]'
              : ' text-slate-300 hover:bg-[#232a36]';

            return (
              <button
                key={q.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${q.key}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onChange?.(q.key)}
                className={base + divider + state}
                ref={(el) => (btnRefs.current[q.key] = el)}
              >
                {q.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
