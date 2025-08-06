import NavBarLinkStyle from './NavBarLinkStyle';

function NavBar() {
  return (
    <div className="w-screen h-[90px] bg-[#232323] text-white flex items-center px-6">
      <div className="flex items-center justify-center text-white font-bold text-2xl h-full w-[100px] pr-6">
        LOL99
      </div>
      <div className=" flex h-full">
        <NavBarLinkStyle to="">팀원 찾기</NavBarLinkStyle>
        <NavBarLinkStyle to="">렝킹</NavBarLinkStyle>
        <NavBarLinkStyle to="">챔피언</NavBarLinkStyle>
      </div>
      <div className="flex h-full ml-auto ">
        <NavBarLinkStyle to="/login">로그인</NavBarLinkStyle>
      </div>
    </div>
  );
}
export default NavBar;
