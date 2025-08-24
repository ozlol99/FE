import { getPositionIcon, normalizePosition } from '@/data/positionIcons';
import { motion, useReducedMotion } from 'framer-motion';

const ORDER = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT', 'ALL'];

function FMBar({ percent, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`h-full rounded-full origin-left ${className}`}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: percent / 100 }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' }}
      style={{ transformOrigin: 'left' }}
    />
  );
}

export default function PositionUsageBars({ byPosition }) {
  if (!byPosition || Object.keys(byPosition).length === 0) return null;

  const entries = Object.entries(byPosition).map(([pos, count]) => {
    const key = normalizePosition(pos);
    const Icon = getPositionIcon(key);
    return { key, label: key, Icon, count };
  });

  const sorted = entries
    .filter((e) => e.count > 0)
    .sort((a, b) => ORDER.indexOf(a.key) - ORDER.indexOf(b.key));

  const total = sorted.reduce((s, e) => s + e.count, 0);
  const max = Math.max(1, ...sorted.map((e) => e.count));

  return (
    <div className="space-y-2 mt-2">
      {sorted.map(({ key, label, Icon, count }) => {
        const ratio = Math.round((count / total) * 100);
        return (
          <div key={key} className="flex items-center gap-2">
            {/* 아이콘 + 라벨 */}
            <div className="w-28 flex items-center gap-1">
              {Icon ? (
                <Icon
                  width={16}
                  height={16}
                  className="shrink-0 text-emerald-400"
                />
              ) : null}
              <span className="text-xs text-stone-300">{label}</span>
            </div>

            {/* 바 (가득 차는 폭은 count/max 기준) */}
            <div className="flex-1 h-3 bg-stone-700 rounded-full overflow-hidden">
              <FMBar
                percent={(count / max) * 100}
                className={
                  key === 'JUNGLE'
                    ? 'bg-emerald-500'
                    : key === 'TOP'
                      ? 'bg-blue-500'
                      : key === 'MIDDLE'
                        ? 'bg-violet-500'
                        : key === 'BOTTOM'
                          ? 'bg-amber-500'
                          : key === 'SUPPORT'
                            ? 'bg-cyan-500'
                            : 'bg-stone-500'
                }
              />
            </div>

            {/* 수치 */}
            <div className="w-16 text-right text-xs text-stone-300">
              {count}회 <span className="opacity-80">({ratio}%)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
