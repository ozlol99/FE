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

// import { useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';

// const API_BASE = import.meta.env.VITE_API_BASE;

// export default function OAuthCallback() {
//   const [params] = useSearchParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const run = async () => {
//       const code = params.get('code');
//       const state = params.get('state');
//       if (!code)
//         return navigate('/login?error=missing_code', { replace: true });

//       const provider = sessionStorage.getItem('oauth:lastProvider') || 'google';
//       const savedState = sessionStorage.getItem(`oauth:${provider}:state`);
//       if (savedState && state && savedState !== state) {
//         return navigate('/login?error=state_mismatch', { replace: true });
//       }

//       try {
//         const body = new URLSearchParams({ code });
//         if (state) body.set('state', state);

//         const res = await fetch(`${API_BASE}/${provider}-login`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//           credentials: 'include',
//           redirect: 'manual',
//           body: body.toString(),
//         });

//         // 신규 유저: 307/302 → Location으로 이동
//         if (res.status === 307 || res.status === 302) {
//           const loc = res.headers.get('Location');
//           return loc
//             ? window.location.replace(loc)
//             : navigate('/login?error=redirect_missing', { replace: true });
//         }

//         // 기존 유저: 200 JSON
//         if (res.status === 200) {
//           const data = await res.json().catch(() => ({}));
//           if (data?.access_token)
//             localStorage.setItem('accessToken', data.access_token);
//           const redirectUrl = data?.redirect_url || '/';
//           return /^https?:\/\//.test(redirectUrl)
//             ? window.location.replace(redirectUrl)
//             : navigate(redirectUrl, { replace: true });
//         }

//         navigate('/login?error=oauth_failed', { replace: true });
//       } catch {
//         navigate('/login?error=network', { replace: true });
//       }
//     };
//     run();
//   }, [params, navigate]);

//   return <div>로그인 처리 중…</div>;
// }
import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomInput from '@/components/CustomInput';
import GenderToggle from '@/components/ToggleButton';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.lol99.kro.kr';
const ADD_INFO_ENDPOINT = `${API_BASE}/user/register`;

function dateInputToUTCISO(yyyyMmDd) {
  if (!yyyyMmDd) return '';
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0)).toISOString();
}

export default function SignupAddInfo() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const { email, provider } = useMemo(() => {
    const p = new URLSearchParams(search);
    return {
      email: p.get('email') || '',
      provider: p.get('provider') || '',
    };
  }, [search]);

  const [form, setForm] = useState({
    nickname: '',
    birth: '',
    gender: false,
    agree: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (
      !form.nickname ||
      !form.birth ||
      typeof form.gender !== 'boolean' ||
      !form.agree
    ) {
      setError('모든 항목을 입력하고 약관에 동의해주세요.');
      return;
    }

    const payload = {
      email,
      user: form.nickname,
      google_or_kakao: provider,
      gender: Boolean(form.gender),
      birthday: dateInputToUTCISO(form.birth),
    };

    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch(ADD_INFO_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.ok) return navigate('/', { replace: true });

      const data = await res.json().catch(() => ({}));
      setError(data?.message || data?.detail || '추가정보 저장 실패');
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#181818]">
      <form
        className="w-full max-w-[570px] flex flex-col gap-3 bg-[#232222] rounded-xl shadow-lg p-8"
        onSubmit={onSubmit}
      >
        <h2 className="text-2xl font-extrabold text-white mb-6 text-center">
          추가정보입력
        </h2>

        <CustomInput
          label="닉네임"
          value={form.nickname}
          onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
          placeholder="닉네임 입력"
        />

        <CustomInput
          label="생년월일"
          type="date"
          value={form.birth}
          onChange={(e) => setForm((f) => ({ ...f, birth: e.target.value }))}
        />

        <div className="flex-1 flex flex-col items-start justify-center">
          <label className="mb-1 text-xs font-semibold text-[#b0b0b0]">
            성별
          </label>
          <div className="w-full flex justify-end">
            <GenderToggle
              value={form.gender}
              onChange={(gender) => setForm((f) => ({ ...f, gender }))}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-[#b0b0b0]">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(e) =>
              setForm((f) => ({ ...f, agree: e.target.checked }))
            }
          />
          약관에 동의합니다.
        </label>

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button
          type="submit"
          className="w-full mx-auto bg-[#3F3E3E] border border-[#787878] text-white font-extrabold text-lg rounded-md py-2 mt-2 transition hover:bg-[#484848] hover:border-[#a0a0a0] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={
            submitting ||
            !form.nickname ||
            !form.birth ||
            typeof form.gender !== 'boolean' ||
            !form.agree
          }
        >
          {submitting ? '전송 중…' : '확인'}
        </button>
      </form>
    </div>
  );
}
