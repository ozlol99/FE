export default function ChampionCard({ data, active = false, onClick }) {
  const { id, name, icon } = data || {};
  return (
    <button
      type="button"
      onClick={() => onClick?.(id)}
      aria-pressed={active}
      title={name}
      className={`relative aspect-square w-16 rounded-xl overflow-hidden focus:outline-none group 
        border ${active ? 'ring-2 ring-teal-500 border-transparent' : 'border-neutral-700 hover:border-teal-500/60'}
      `}
    >
      <div
        className="absolute inset-0 bg-cover scale-120 group-hover:scale-100 transition duration-200"
        style={{ backgroundImage: `url(${icon})` }}
      />
      <span className="absolute bottom-0 text-white left-0 right-0 text-[10px] px-1 py-0.5 bg-black/50 truncate group-hover:invisible transition duration-100">
        {name}
      </span>
    </button>
  );
}
