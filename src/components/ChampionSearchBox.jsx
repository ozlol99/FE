export default function ChampionSearchBox({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="챔피언 검색"
      className="w-full h-9 px-3 rounded-md bg-neutral-800 text-sm text-white outline-none border border-stone-300"
    />
  );
}
