import { getPositionIcon } from '../data/positionIcons';

export default function ChampionRoleFilter() {
  const roles = ['ALL', 'TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];
  const selected = 'JUNGLE'; // 고정 선택값 추후 브롭스 받아서 변경
  return (
    <div className="grid grid-cols-6 gap-1 p-1">
      {roles.map((role) => {
        const Icon = getPositionIcon(role);
        return (
          <button
            key={role}
            className={`h-10 rounded-md border-2 flex items-center justify-center border-neutral-700
            ${selected === role ? 'bg-teal-500 fill-teal-400' : ''}`}
          >
            {Icon && <Icon className="w-5 h-5 fill-amber-50" />}
          </button>
        );
      })}
    </div>
  );
}
