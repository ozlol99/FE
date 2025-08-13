export default function ChampionCard() {
  return (
    <button
      // onClick={onClick}
      className="aspect-square w-full rounded-md overflow-hidden border border-neutral-700 hover:border-teal-500"
      // title={data.name}
    >
      <img
        // src={data.squareImg} // ddragon img/champion/{id}.png
        // alt={data.name}
        className="w-full h-full object-cover"
        // onError={(e) => (e.currentTarget.src = '/fallback.png')}
      />
    </button>
  );
}
