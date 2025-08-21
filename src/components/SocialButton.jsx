export default function SocialButton({ href, logo, color, title }) {
  return (
    <a
      href={href}
      className={`w-12 h-12 flex items-center justify-center rounded-full ${color} shadow hover:scale-105 transition cursor-pointer`}
      title={title}
    >
      <img
        src={logo}
        alt={title}
        className="w-8 h-8 object-contain filter grayscale hover:filter-none transition cursor-pointer"
      />
    </a>
  );
}
