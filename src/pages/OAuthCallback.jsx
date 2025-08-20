import { useEffect } from 'react';
import {
  useNavigate,
  useSearchParams,
  useOutletContext,
} from 'react-router-dom';
import axios from 'axios';

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useOutletContext(); // Context에 유저 저장

  useEffect(() => {
    const code = params.get('code');
    if (!code) return navigate('/login?error=missing_code', { replace: true });

    //code를 백엔드로 전달
    axios
      .post(`${import.meta.env.VITE_API_URL}/auth/oauth/callback`, { code })
      .then((res) => {
        // res.data에 access_token, user 정보가 내려옴
        localStorage.setItem('access_token', res.data.access_token);
        setUser(res.data.user); // 예: { email, nickname, ... }
        navigate('/', { replace: true });
      })
      .catch((err) => {
        console.error(err);
        navigate('/login?error=oauth_failed', { replace: true });
      });
  }, [params, navigate, setUser]);
  console.log(import.meta.env.VITE_API_URL);

  return <div>로그인 처리 중…</div>;
}
