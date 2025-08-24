// import { Outlet, useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import NavBar from '@/components/NavBar';

// export default function Layout() {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const onLogout = () => {
//     setUser(null);
//     navigate('/', { replace: true });
//   };

//   return (
//     <>
//       <NavBar isLogin={!!user} onLogout={onLogout} />
//       <Outlet context={{ setUser }} />
//     </>
//   );
// }

import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/contexts/AuthContext';

export default function Layout() {
  const { isLogin, logout, loading } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await logout(); // 서버 /user/logout 호출 + 컨텍스트 비우기
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <>
      <NavBar isLogin={isLogin} onLogout={onLogout} loading={loading} />
      {/* 더 이상 Outlet에 setUser 넘길 필요 없음 */}
      <Outlet />
    </>
  );
}
