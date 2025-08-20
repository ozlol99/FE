import NavBarLinkStyle from './NavBarLinkStyle';
import Logo from '@/assets/logo.svg?react';
import SymbolLogo from '@/assets/lol99logo.svg?react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavSearchBar from './NavSearchBar';

function NavBar({ isLogin, onLogout }) {
  const navItems = [
    { label: '팀원 찾기', path: '/' },
    { label: '랭킹', path: '/leaderboard' },
    { label: '챔피언', path: '/champions' },
  ];
  const navigate = useNavigate();
  //주소 가져오기
  const { pathname } = useLocation();
  const showSearch = pathname !== '/';

  return (
    <div className="w-screen h-[90px] bg-[#232323] text-white flex items-center px-6">
      <div className="flex items-center justify-center text-white font-bold text-2xl h-full w-[100px] pr-6">
        <SymbolLogo
          className="w-40 h-40 spin-slow"
          style={{
            '--start': '#00BBA3',
            '--end': '#0c5748',
          }}
        />
        <Logo
          className=" w-40 h-40 cursor-pointer"
          onClick={() => navigate('/')}
        />
      </div>
      <div className=" flex h-full">
        {navItems.map((item, index) => (
          <NavBarLinkStyle key={index} to={item.path}>
            {item.label}
          </NavBarLinkStyle>
        ))}
      </div>
      <div className="flex-1 flex justify-center">
        {showSearch && <NavSearchBar />}
      </div>
      <div className="flex h-full ml-auto gap-2">
        {' '}
        {/* 이거 다시 밑으로 넣기 */}
        <NavBarLinkStyle to="/mypage">마이페이지</NavBarLinkStyle>
        {/* ← gap으로 간격 */}
        {isLogin ? (
          <>
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
