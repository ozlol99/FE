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
import Champions from './pages/Champions.jsx';

function App() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <Routes>
      <Route element={<Layout isLogin={isLogin} setIsLogin={setIsLogin} />}>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />

        <Route path="/match-detail/:name/:tag" element={<MatchHistorych />} />
        <Route path="/champions" element={<Champions />} />
        <Route path="/add-info" element={<AdditionalInfo />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/rooms" element={<RoomList />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
export default App;
