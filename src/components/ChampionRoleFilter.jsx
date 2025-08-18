import { getPositionIcon } from '../data/positionIcons';

export default function ChampionRoleFilter({ value = 'ALL', onChange }) {
  const roles = ['ALL', 'TOP', 'JUNGLE', 'MID', 'BOTTOM', 'SUPPORT'];

  return (
    <div className="grid grid-cols-6 gap-1 p-1">
      {roles.map((role) => {
        const Icon = getPositionIcon(role);
        const active = value === role;
        return (
          <button
            key={role}
            type="button"
            onClick={() => onChange?.(role)}
            className={`h-10 rounded-md border-2 flex items-center justify-center border-neutral-700
            ${active ? 'bg-teal-500' : ''}
            first:rounded-l-xl last:rounded-r-xl`}
          >
            {Icon && <Icon className="w-5 h-5 fill-amber-50" />}
          </button>
        );
      })}
    </div>
  );
}
