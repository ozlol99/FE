import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './layouts/Layout.jsx';
import { useState } from 'react';
import OAuthCallback from './pages/OAuthCallback';
import AddInfo from './pages/AddInfo';
import MatchHistorych from './pages/MatchHistory';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [isLogin, _setIsLogin] = useState(false);
  return (
    <>
      <Routes>
        <Route element={<Layout isLogin={isLogin} />}>
          <Route path="/" element={<Home />} />
          {/*검색기능 미구현으로 인해 임시 라우터 경로 설정*/}
          {/*http://localhost:5173/match-detail 으로 임시 접속*/}
          <Route path="/match-detail" element={<MatchHistorych />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/add-info" element={<AddInfo />} />
      </Routes>
    </>
  );
}

export default App;
