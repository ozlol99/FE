import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './layouts/Layout';
import { useState } from 'react';
import OAuthCallback from './pages/OAuthCallback';
import AddInfo from './pages/AddInfo';
import MyPage from './pages/MyPage';

function App() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <Routes>
      <Route element={<Layout isLogin={isLogin} setIsLogin={setIsLogin} />}>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-info" element={<AddInfo />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
      </Route>
    </Routes>
  );
}
export default App;
