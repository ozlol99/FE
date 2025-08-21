export default function SocialButton({ onClick, logo, color, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full w-14 h-14 flex items-center justify-center ${color} cursor-pointer`}
      aria-label={title}
    >
      <img src={logo} alt={title} className="w-6 h-6" />
    </button>
  );
}
