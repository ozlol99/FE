import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

function NavBarLinkStyle({ to, onClick, children }) {
  const content = (
    <>
      {/* 텍스트 위로 살짝 이동 */}
      <motion.span
        className="inline-block"
        variants={{ rest: { y: 0 }, hover: { y: -10 } }}
        transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.3 }}
      >
        {children}
      </motion.span>
    </>
  );

  return (
    <motion.div
      className="relative flex items-end justify-center text-white w-[80px] pb-3 cursor-pointer"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {/* 호버 배경 */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(#363636, black)' }}
        variants={{ rest: { opacity: 0 }, hover: { opacity: 0.8 } }}
        transition={{ duration: 0.3 }}
      />

      {/* 링크 or 버튼 – 안쪽 내용은 공통 */}
      {to ? (
        <Link to={to} className="relative z-10">
          {content}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className="relative z-10">
          {content}
        </button>
      )}
    </motion.div>
  );
}

export default NavBarLinkStyle;
