import RoomCard from './RoomsCard';

export default function RoomsGridSection({
  rooms = [],
  onClick, // (id) => void
  onJoin, // (id) => void
  emptyText = '조건에 맞는 방이 없어요.',
  gridCols = 'sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
}) {
  const wrapperClass = 'mx-auto w-full max-w-[80%] px-4 py-8';
  const gridClass = `grid gap-4 ${gridCols}`;

  return (
    <div className={wrapperClass}>
      <div className="rounded-2xl border border-[#2b3240] bg-[#0f141b] p-4 overflow-hidden">
        <div className="rounded-xl p-4 min-h-[40vh]">
          <div className={gridClass}>
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onClick={onClick}
                onJoin={onJoin}
              />
            ))}

            {rooms.length === 0 && (
              <div className="col-span-full text-center text-sm text-slate-400 py-12">
                {emptyText}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
