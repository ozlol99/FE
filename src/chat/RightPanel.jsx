import ParticipantCard from './ParticipantCard.jsx';

export default function RightPanel({
  members = [],
  onRemove,
  onAddLike,
  className = '',
}) {
  return (
    <aside className={`p-4 space-y-4 overflow-y-auto  w-[360px] ${className}`}>
      {members.map((m) => (
        <ParticipantCard
          key={m.id}
          member={m}
          onRemove={onRemove}
          onAddLike={onAddLike}
        />
      ))}
    </aside>
  );
}
