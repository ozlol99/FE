
import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import NavBar from '@/components/NavBar';

export default function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const onLogout = () => {
    setUser(null);
    navigate('/', { replace: true });
  };


  return (
    <>
      <NavBar isLogin={!!user} onLogout={onLogout} />
      <Outlet context={{ setUser }} />
    </>
  );
}
