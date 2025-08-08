import { useEffect } from 'react';
import {
  useNavigate,
  useSearchParams,
  useOutletContext,
} from 'react-router-dom';

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useOutletContext(); // ← 이제 null 아님

  useEffect(() => {
    const code = params.get('code');
    if (!code) return navigate('/login?error=missing_code', { replace: true });

    setUser({ email: 'social@example.com' });
    navigate('/', { replace: true });
  }, [params, navigate, setUser]);

  return <div>로그인 처리 중…</div>;
}
