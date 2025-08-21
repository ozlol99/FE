// export default function SocialButton({ href, logo, color, title }) {
//   return (
//     <a
//       href={href}
//       className={`w-12 h-12 flex items-center justify-center rounded-full ${color} shadow hover:scale-105 transition`}
//       title={title}
//     >
//       <img
//         src={logo}
//         alt={title}
//         className="w-8 h-8 object-contain filter grayscale hover:filter-none transition"
//       />
//     </a>
//   );
// }
export default function SocialButton({ onClick, logo, color, title }) {
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
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full w-14 h-14 flex items-center justify-center ${color}`}
      aria-label={title}
    >
      <img src={logo} alt={title} className="w-6 h-6" />
    </button>
  );
}
