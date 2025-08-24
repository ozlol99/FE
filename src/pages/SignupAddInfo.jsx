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

import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomInput from '@/components/CustomInput';
import GenderToggle from '@/components/ToggleButton';

// const API_BASE = import.meta.env.VITE_API_BASE || 'http://api.lol99.kro.kr';
const API_BASE = 'https://3.34.53.80:8000';

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
      // const ADD_INFO_ENDPOINT = `${API_BASE}/user/register`;
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
      alert('오류');
      navigate('/');
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
