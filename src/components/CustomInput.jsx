export default function CustomInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-xs font-semibold text-[#b0b0b0]">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-3 py-4
          text-[14px]
          bg-[#3F3E3E]
          border border-[#787878]
          rounded-md
          focus:outline-none
          text-white
          placeholder:text-[#B0B0B0]
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
