import NavBarLinkStyle from './NavBarLinkStyle';
import Logo from '@/assets/logo.svg?react';
import { useNavigate } from 'react-router-dom';

function NavBar({ isLogin, onLogout }) {
  const navItems = [
    { label: '팀원 찾기', path: '/' },
    { label: '랭킹', path: '/' },
    { label: '챔피언', path: '/' },
  ];
  const navigate = useNavigate();

  return (
    <div className="w-screen h-[90px] bg-[#232323] text-white flex items-center px-6">
      <div className="flex items-center justify-center text-white font-bold text-2xl h-full w-[100px] pr-6">
        <Logo className="cursor-pointer" onClick={() => navigate('/')} />
      </div>
      <div className=" flex h-full">
        {navItems.map((item, index) => (
          <NavBarLinkStyle key={index} to={item.path}>
            {item.label}
          </NavBarLinkStyle>
        ))}
      </div>
      <div className="flex h-full ml-auto gap-2">
        {' '}
        {/* ← gap으로 간격 */}
        {isLogin ? (
          <>
            <NavBarLinkStyle to="/mypage">마이페이지</NavBarLinkStyle>
            <NavBarLinkStyle onClick={onLogout}>로그아웃</NavBarLinkStyle>
          </>
        ) : (
          <NavBarLinkStyle to="/login">로그인</NavBarLinkStyle>
        )}
      </div>
    </div>
  );
}
export default NavBar;
