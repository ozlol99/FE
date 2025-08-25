import React from 'react';

export default function Pagination({
  page,
  totalPages,
  onChange,
  blockSize = 10, // 웹페이지 버튼 갯수
  mobileMax = 5, // 모바일 버튼 갯수
}) {
  const blockStart = Math.floor((page - 1) / blockSize) * blockSize + 1;
  const blockEnd = Math.min(blockStart + blockSize - 1, totalPages);

  const go = (p) => onChange(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <div className="flex items-center gap-2 md:hidden">
        <button
          className="px-3 py-2 text-xs rounded bg-white/10 text-white disabled:opacity-40"
          onClick={() => go(page - 1)}
          disabled={page === 1}
          aria-label="이전 페이지"
        >
          &lt;
        </button>
        {Array.from(
          { length: Math.min(mobileMax, totalPages) },
          (_, i) => i + 1,
        ).map((p) => (
          <button
            key={`m-${p}`}
            className={`px-3 py-2 text-xs rounded ${
              page === p ? 'bg-teal-600 text-white' : 'bg-white/10 text-white'
            }`}
            onClick={() => go(p)}
            aria-current={page === p ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
        <button
          className="px-3 py-2 text-xs rounded bg-white/10 text-white disabled:opacity-40"
          onClick={() => go(page + 1)}
          disabled={page === totalPages}
          aria-label="다음 페이지"
        >
          &gt;
        </button>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <button
          className="px-3 py-2 text-xs rounded bg-white/10 text-white disabled:opacity-40"
          onClick={() => go(page - 1)}
          disabled={page === 1}
          aria-label="이전 페이지"
        >
          &lt;
        </button>

        {Array.from(
          { length: blockEnd - blockStart + 1 },
          (_, i) => blockStart + i,
        ).map((p) => (
          <button
            key={`d-${p}`}
            className={`px-3 py-2 text-xs rounded ${
              page === p ? 'bg-teal-600 text-white' : 'bg-white/10 text-white'
            }`}
            onClick={() => go(p)}
            aria-current={page === p ? 'page' : undefined}
          >
            {p}
          </button>
        ))}

        <button
          className="px-3 py-2 text-xs rounded bg-white/10 text-white disabled:opacity-40"
          onClick={() => go(page + 1)}
          disabled={page === totalPages}
          aria-label="다음 페이지"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
