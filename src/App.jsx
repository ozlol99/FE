import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './layouts/Layout.jsx';
import { useState } from 'react';
import OAuthCallback from './pages/OAuthCallback';
import MatchHistorych from './pages/MatchHistory';
import MyPage from './pages/MyPage';
import AdditionalInfo from './pages/AdditionalInfo';
import RoomList from './pages/RoomList';

function App() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <Routes>
      <Route element={<Layout isLogin={isLogin} setIsLogin={setIsLogin} />}>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        {/*검색기능 미구현으로 인해 임시 라우터 경로 설정*/}
        {/*http://localhost:5173/match-detail 으로 임시 접속*/}

        <Route path="/match-detail" element={<MatchHistorych />} />
        <Route path="/add-info" element={<AdditionalInfo />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/rooms" element={<RoomList />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
export default App;
