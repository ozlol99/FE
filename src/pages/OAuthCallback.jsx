import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/');
  }, [navigate]);
  return <div>로그인 처리 중입니다...</div>;
}
