import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

function NavBarLinkStyle({ to, children }) {
  return (
    <motion.div
      className="relative flex items-end justify-center text-white w-[80px] pb-3 cursor-pointer"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(#363636, black)' }}
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 0.8 },
        }}
        transition={{ duration: 0.3 }}
      />
      <Link to={to} className="relative z-10">
        {children}
      </Link>
    </motion.div>
  );
}

export default NavBarLinkStyle;
