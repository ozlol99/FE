import { Outlet } from 'react-router-dom';
import NavBar from '@/components/NavBar';

function Layout({ isLogin }) {
  return (
    <>
      <NavBar isLogin={isLogin} />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
