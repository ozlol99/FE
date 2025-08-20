import React from 'react';
import { useNavigate } from 'react-router-dom';
import MyPageForm from '@/components/MyPageForm';

export default function MyPage() {
  const navigate = useNavigate();

  // 더미 데이터 (백엔드 붙기 전)
  const email = 'social@example.com';
  const riotAccounts = ['소환사A#1234', '소환사B#7777', '소환사C#99999'];

  return (
    <main className="min-h-screen w-full bg-[#141414] text-white">
      <div className="max-w-[900px] mx-auto px-6 py-10">
        <MyPageForm
          email={email}
          riotAccounts={riotAccounts}
          onAddRiot={() => navigate('/connect/riot')}
          // onRemoveRiot={(index) => ...}             // 나중에 API 붙으면 구현
        />
      </div>
    </main>
  );
}
