import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Layout from './layouts/Layout.jsx';
import Home from './pages/Home';
import Login from './pages/Login';
import OAuthCallback from './pages/OAuthCallback';
import MatchHistorych from './pages/MatchHistory';
import MyPage from './pages/MyPage';
import AdditionalInfo from './pages/AdditionalInfo';
import RoomList from './pages/RoomList';

import SocketProvider from '@/context/SocketProvider'; // ✅ 추가

// 간단한 보호 라우트 (로그인 필요 페이지용)
function RequireAuth({ isLogin, children }) {
  if (!isLogin) {
    window.location.href = '/login';
    return null;
  }
  return children;
}

function App() {
  const [isLogin, setIsLogin] = useState(
    Boolean(localStorage.getItem('accessToken')), // 새로고침에도 유지
  );

  // 매 렌더마다 최신 토큰을 읽어서 Provider에 전달
  const token = localStorage.getItem('accessToken') || undefined;

  return (
    <SocketProvider token={token}>
      <Routes>
        {/* Navbar/레이아웃이 필요한 페이지들 */}
        <Route element={<Layout isLogin={isLogin} setIsLogin={setIsLogin} />}>
          <Route index element={<Home />} />
          <Route path="rooms" element={<RoomList />} />
          <Route path="match-detail" element={<MatchHistorych />} />
          <Route path="add-info" element={<AdditionalInfo />} />
          <Route
            path="mypage"
            element={
              <RequireAuth isLogin={isLogin}>
                <MyPage />
              </RequireAuth>
            }
          />
        </Route>

        {/* 레이아웃 없이 단독 렌더 */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;
