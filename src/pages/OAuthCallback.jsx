// import { useEffect } from 'react';
// import {
//   useNavigate,
//   useSearchParams,
//   useOutletContext,
// } from 'react-router-dom';

// export default function OAuthCallback() {
//   const [params] = useSearchParams();
//   const navigate = useNavigate();
//   const { setUser } = useOutletContext(); // ← 이제 null 아님

//   useEffect(() => {
//     const code = params.get('code');
//     if (!code) return navigate('/login?error=missing_code', { replace: true });

//     setUser({ email: 'social@example.com' });
//     navigate('/', { replace: true });
//   }, [params, navigate, setUser]);

//   return <div>로그인 처리 중…</div>;
// }

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const code = params.get('code');
      const state = params.get('state');
      if (!code)
        return navigate('/login?error=missing_code', { replace: true });

      const provider = sessionStorage.getItem('oauth:lastProvider') || 'google';
      const savedState = sessionStorage.getItem(`oauth:${provider}:state`);
      if (savedState && state && savedState !== state) {
        return navigate('/login?error=state_mismatch', { replace: true });
      }

      try {
        const body = new URLSearchParams({ code });
        if (state) body.set('state', state);

        const res = await fetch(`${API_BASE}/${provider}-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          credentials: 'include',
          redirect: 'manual',
          body: body.toString(),
        });

        // 신규 유저: 307/302 → Location으로 이동
        if (res.status === 307 || res.status === 302) {
          const loc = res.headers.get('Location');
          return loc
            ? window.location.replace(loc)
            : navigate('/login?error=redirect_missing', { replace: true });
        }

        // 기존 유저: 200 JSON
        if (res.status === 200) {
          const data = await res.json().catch(() => ({}));
          if (data?.access_token)
            localStorage.setItem('accessToken', data.access_token);
          const redirectUrl = data?.redirect_url || '/';
          return /^https?:\/\//.test(redirectUrl)
            ? window.location.replace(redirectUrl)
            : navigate(redirectUrl, { replace: true });
        }

        navigate('/login?error=oauth_failed', { replace: true });
      } catch {
        navigate('/login?error=network', { replace: true });
      }
    };
    run();
  }, [params, navigate]);

  return <div>로그인 처리 중…</div>;
}
