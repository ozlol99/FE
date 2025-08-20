// import React, { useEffect, useState } from 'react';
// import CustomInput from '@/components/CustomInput';
// import GenderToggle from '@/components/ToggleButton';

// // {
// //   "email": "string",
// //   "user": "string",
// //   "google_or_kakao": "google",
// //   "gender": true,
// //   "birthday": "2025-08-20T05:09:38.418Z"
// // }

// const Form = ({ form, setForm }) => (
//   <div className="flex items-center justify-center bg-[#181818] w-full">
//     <form className="w-full max-w-[570px] flex flex-col gap-3 bg-[#232222] rounded-xl shadow-lg p-8">
//       {/* 제목 */}
//       <h2 className="text-2xl font-extrabold text-white mb-6 text-center">
//         추가정보입력
//       </h2>

//       {/* 닉네임 */}
//       <CustomInput
//         label="닉네임"
//         value={form.nickname}
//         onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
//         placeholder="닉네임 입력"
//       />
//       {/* 생년월일 + 성별 한 줄 */}
//       <div className="flex gap-3 items-center">
//         <div className="flex-1">
//           <CustomInput
//             label="생년월일"
//             value={form.birth}
//             onChange={(e) => setForm((f) => ({ ...f, birth: e.target.value }))}
//             type="date"
//             className="min-w-0"
//           />
//         </div>
//         <div className="flex-1 flex flex-col items-start justify-center">
//           <label className="mb-1 text-xs font-semibold text-[#b0b0b0]">
//             성별
//           </label>
//           <div className="w-full flex justify-end">
//             <GenderToggle
//               value={form.gender}
//               onChange={(gender) => setForm((f) => ({ ...f, gender }))}
//             />
//           </div>
//         </div>
//       </div>

//       {/* 약관 텍스트 */}
//       <textarea
//         className="w-full border border-[#787878] rounded-md bg-[#3F3E3E] text-[#B0B0B0] text-xs p-3 resize-none mt-2"
//         rows={3}
//         value="여기에 이용약관 내용이 들어갑니다. (수정불가)"
//         disabled
//       />

//       {/* 확인 버튼 */}
//       <button
//         type="submit"
//         className="w-full mx-auto bg-[#3F3E3E] border border-[#787878] text-white font-extrabold text-lg rounded-md py-2 mt-2 transition hover:bg-[#484848] hover:border-[#a0a0a0] cursor-pointer"
//         disabled={
//           !form.nickname ||
//           !form.riotTag ||
//           !form.birth ||
//           !form.gender ||
//           !form.agree
//         }
//       >
//         확인
//       </button>
//     </form>
//   </div>
// );

// export default function SignupAddInfo() {
//   const [form, setForm] = useState({
//     nickname: '',
//     birth: '',
//     gender: '',
//     agree: false,
//   });

//   useEffect(() => {});

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[#181818]">
//       <Form form={form} setForm={setForm} />
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import CustomInput from '@/components/CustomInput';
import GenderToggle from '@/components/ToggleButton';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'http://api.lol99.kro.kr:8000';
const ADD_INFO_ENDPOINT = `${API_BASE}/user/register`;
const ME_ENDPOINT = `${API_BASE}/auth/me`; // 실제 경로에 맞춰 조정

// 'YYYY-MM-DD'
function dateInputToUTCISO(yyyyMmDd) {
  if (!yyyyMmDd) return '';
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0)).toISOString();
}

const Form = ({ form, setForm, onSubmit, submitting }) => (
  <div className="flex items-center justify-center bg-[#181818] w-full">
    <form
      className="w-full max-w-[570px] flex flex-col gap-3 bg-[#232222] rounded-xl shadow-lg p-8"
      onSubmit={onSubmit}
    >
      <h2 className="text-2xl font-extrabold text-white mb-6 text-center">
        추가정보입력
      </h2>

      {/* 닉네임 -> 백엔드의 user 로 매핑 */}
      <CustomInput
        label="닉네임"
        value={form.nickname}
        onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
        placeholder="닉네임 입력"
      />

      {/* 생년월일 */}
      <CustomInput
        label="생년월일"
        type="date"
        value={form.birth}
        onChange={(e) => setForm((f) => ({ ...f, birth: e.target.value }))}
      />

      {/* 성별(boolean) */}
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

      {/* (선택) 약관 동의 UI는 유지하되 서버엔 안 보냄 */}
      <label className="flex items-center gap-2 text-sm text-[#b0b0b0]">
        <input
          type="checkbox"
          checked={form.agree}
          onChange={(e) => setForm((f) => ({ ...f, agree: e.target.checked }))}
        />
        약관에 동의합니다.
      </label>

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

export default function SignupAddInfo() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const [form, setForm] = useState({
    nickname: '',
    birth: '',
    gender: false, // boolean
    agree: false,
  });

  // 서버에 보낼 메타(이메일/프로바이더)
  const [oauthMeta, setOauthMeta] = useState({
    email: '',
    user: '',
    provider: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const pEmail = params.get('email');
    const pUser = params.get('user');
    const pProvider = params.get('provider');

    if (pEmail || pUser || pProvider) {
      setOauthMeta({
        email: pEmail || '',
        user: pUser || '',
        provider: pProvider || '',
      });
      return;
    }

    // 2) 쿼리 없으면 백엔드에서 현재 유저 조회
    (async () => {
      try {
        const res = await fetch(ME_ENDPOINT, { credentials: 'include' });
        if (res.ok) {
          const me = await res.json();
          setOauthMeta({
            email: me.email || '',
            user: me.user || '',
            provider: me.google_or_kakao || '',
          });
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('fetch /me 실패:', err);
        navigate('/login');
      }
    })();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);

      const payload = {
        email: oauthMeta.email,
        user: oauthMeta.user || form.nickname,
        google_or_kakao: oauthMeta.provider,
        gender: Boolean(form.gender),
        birthday: dateInputToUTCISO(form.birth),
      };

      const res = await fetch(ADD_INFO_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate('/'); // 완료 후 이동
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || '추가정보 저장 실패');
      }
    } catch {
      alert('네트워크 오류');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#181818]">
      <Form
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}
