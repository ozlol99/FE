export default function Fab({ onClick, ariaLabel = '방 만들기' }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="fixed bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full border border-[#2b3240] bg-[#00BBA3] text-[#0b0f14] shadow-lg transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:[#008f7c] cursor-pointer text-sm"
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
  );
}
