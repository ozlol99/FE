import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './Layouts/layout';
import { useState } from 'react';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [isLogin, _setIsLogin] = useState(false);
  return (
    <>
      <Routes>
        <Route element={<Layout isLogin={isLogin} />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
