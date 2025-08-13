import { useId, useState, useMemo } from 'react';

export default function Switch({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const labelId = useId();

  const sizes = {
    sm: { track: 'h-5 w-9', thumb: 'h-3.5 w-3.5', shift: 'translate-x-4' },
    md: { track: 'h-6 w-11', thumb: 'h-4 w-4', shift: 'translate-x-5' },
    lg: { track: 'h-7 w-14', thumb: 'h-5 w-5', shift: 'translate-x-7' },
  };
  const S = sizes[size] ?? sizes.md;

  const isControlled = typeof checked === 'boolean';
  const [inner, setInner] = useState(defaultChecked);
  const isOn = isControlled ? checked : inner;

  const toggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  const trackClass = useMemo(
    () =>
      [
        'relative inline-flex shrink-0 cursor-pointer rounded-full transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BBA3]',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        isOn ? 'bg-[#00BBA3]' : 'bg-slate-600',
        S.track,
        className,
      ].join(' '),
    [disabled, isOn, S.track, className],
  );

  return (
    <div className="flex items-center justify-between gap-4 py-1">
      {label && (
        <span id={labelId} className="text-sm text-slate-200">
          {label}
        </span>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-labelledby={label ? labelId : undefined}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        className={trackClass}
      >
        {/* thumb */}
        <span
          className={[
            'pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-white transition-transform',
            S.thumb,
            isOn ? S.shift : 'translate-x-0',
          ].join(' ')}
        />
      </button>
    </div>
  );
}
