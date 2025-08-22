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
import Champions from './pages/Champions.jsx';
import RoomPage from './pages/RoomPage.jsx';
import LeaderBoard from './pages/LeaderBoard.jsx';
import SignupAddInfo from './pages/SignupAddInfo.jsx';

// function RequireAuth({ isLogin, children }) {
//   if (!isLogin) {
//     window.location.href = '/login';
//     return null;
//   }
//   return children;
// }

function App() {
  const [isLogin, setIsLogin] = useState(
    Boolean(localStorage.getItem('accessToken')),
  );

  return (
    <Routes>
      {/* Navbar/레이아웃이 필요한 페이지들 */}
      <Route element={<Layout isLogin={isLogin} setIsLogin={setIsLogin} />}>
        <Route index element={<Home />} />
        <Route path="rooms" element={<RoomList />} />
        <Route path="match-detail/:name/:tag" element={<MatchHistorych />} />
        <Route path="/champions" element={<Champions />} />
        <Route path="add" element={<AdditionalInfo />} />
        <Route path="add-info" element={<SignupAddInfo />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route
          path="mypage"
          element={
            // <RequireAuth isLogin={isLogin}>
            <MyPage />
            // </RequireAuth>
          }
        />
      </Route>

      {/* 레이아웃 없이 단독 렌더 */}
      <Route path="/login" element={<Login />} />
      <Route path="/room" element={<RoomPage />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />
    </Routes>
  );
}

export default App;
