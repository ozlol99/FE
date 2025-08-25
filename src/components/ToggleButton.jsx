import React, { memo } from 'react';

function ToggleButton({ value, onChange, name = 'gender', disabled = false }) {
  const options = [
    { label: '남', val: true },
    { label: '여', val: false },
  ];

  return (
    <div
      className={`w-full h-[55px] bg-[#3f3f3f] rounded-md border border-[#787878] flex items-center justify-around px-2 text-white ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      role="radiogroup"
      aria-label="성별"
      aria-disabled={disabled}
    >
      {options.map((opt, idx) => {
        const selected = value === opt.val;
        return (
          <label
            key={String(opt.val)}
            className={`relative flex-1 text-center cursor-pointer p-2 ${
              selected ? 'bg-[#313131]' : ''
            } ${opt.val === true ? 'rounded-l-md' : 'rounded-r-md'}`}
          >
            <input
              type="radio"
              name={name}
              value={String(opt.val)}
              checked={selected}
              onChange={() => onChange(opt.val)}
              className="hidden"
              disabled={disabled}
            />
            {opt.label}
            {idx === 0 && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-[20px] bg-white opacity-50" />
            )}
          </label>
        );
      })}
    </div>
  );
}

export default memo(ToggleButton);
