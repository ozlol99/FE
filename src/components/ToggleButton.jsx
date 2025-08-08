import { useState } from 'react';

function ToggleButton() {
  const [selectedGender, setSelectedGender] = useState('남');

  return (
    <>
      <div className="w-full h-[55px] bg-[#3f3f3f] rounded-md border border-[#787878] flex items-center justify-around px-2 text-white">
        {['남', '여'].map((gender, idx) => (
          <label
            key={gender}
            className={`relative flex-1 text-center cursor-pointer p-2 ${
              selectedGender === gender ? 'bg-[#313131]' : ''
            }
            ${gender === '남' ? 'rounded-l-md' : 'rounded-r-md'}
            `}
          >
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={selectedGender === gender}
              onChange={() => setSelectedGender(gender)}
              className="hidden"
            />
            {gender}
            {idx === 0 && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-[20px] bg-white opacity-50" />
            )}
          </label>
        ))}
      </div>
    </>
  );
}

export default ToggleButton;
