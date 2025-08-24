// import { useEffect, useState } from 'react';
// import MyPageForm from '@/components/MyPageForm';
// import { getUserMe, addRiotAccount, removeRiotAccount } from '@/api/user';

// export default function MyPage() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     loadUser();
//   }, []);

//   const loadUser = async () => {
//     try {
//       const data = await getUserMe();
//       setUser(data);
//     } catch (err) {
//       console.error('유저 정보 불러오기 실패:', err);
//     }
//   };

//   const handleAddRiot = async () => {
//     const game_name = prompt('게임 닉네임 입력 (예: Hide on bush)');
//     const tag_line = prompt('태그 입력 (예: KR1)');
//     if (!game_name || !tag_line) return;

//     try {
//       const newAcct = await addRiotAccount({ game_name, tag_line });
//       setUser((prev) => ({
//         ...prev,
//         riot_accounts: [...(prev.riot_accounts || []), newAcct],
//       }));
//     } catch (err) {
//       console.error('추가 실패:', err);
//       alert('계정 추가 실패!');
//     }
//   };

//   const handleRemoveRiot = async (accountId) => {
//     if (!window.confirm('정말 삭제하시겠습니까?')) return;

//     try {
//       await removeRiotAccount(accountId);
//       setUser((prev) => ({
//         ...prev,
//         riot_accounts: prev.riot_accounts.filter(
//           (acct) => acct.id !== accountId,
//         ),
//       }));
//     } catch (err) {
//       console.error('삭제 실패:', err);
//       alert('삭제 실패!');
//     }
//   };

//   if (!user) return <p className="text-white">로딩 중...</p>;

//   return (
//     <MyPageForm
//       email={user.email}
//       riotAccounts={user.riot_accounts.map(
//         (acct) => `${acct.game_name}#${acct.tag_line}`,
//       )}
//       onAddRiot={handleAddRiot}
//       onRemoveRiot={(i) => handleRemoveRiot(user.riot_accounts[i].id)}
//     />
//   );
// }

import React, { useEffect, useState } from 'react';
import { getUserMe } from '@/api/user';
import MyPageHeader from '../components/MyPageHeader';
import BasicInfoCard from '../components/BasicInfoCard';
import RiotAccountsCard from '../components/RiotAccountsCard';
import EditProfileModal from '../components/EditProfileModal';
import PageSkeleton from '../components/PageSkeleton';

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getUserMe();
        if (!alive) return;
        setUser({ ...data, riot_accounts: data?.riot_accounts ?? [] });
      } catch (e) {
        console.error('[MyPage] me 실패', e);
        setError('유저 정보를 불러오지 못했어요.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <PageSkeleton />;
  if (error)
    return (
      <div className="min-h-[60svh] grid place-items-center px-4">
        <div className="text-center space-y-3">
          <p className="text-[#ddd]">{error}</p>
          <button
            onClick={() => location.reload()}
            className="px-4 py-2 rounded-lg bg-[#3A3A3A] border border-[#575757] text-[#eaeaea] hover:bg-[#4a4a4a]"
          >
            다시 시도
          </button>
        </div>
      </div>
    );

  return (
    <main className="w-full">
      <div className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-12">
        <MyPageHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <BasicInfoCard
            email={user?.email}
            nickname={user?.nickname ?? user?.user}
            birth={user?.birthday}
            gender={user?.gender}
            onEdit={() => setEditOpen(true)}
          />
          <RiotAccountsCard user={user} setUser={setUser} />
        </div>
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            disabled
            className="px-4 py-2 rounded-lg bg-[#3F3E3E] border border-[#787878] text-[#eaeaea] cursor-not-allowed"
          >
            회원 탈퇴
          </button>
        </div>
      </div>

      {editOpen && (
        <EditProfileModal
          initial={{
            email: user?.email ?? '',
            nickname: user?.nickname ?? user?.user ?? '',
            gender: user?.gender ?? null,
            birthday: user?.birthday ?? '',
          }}
          onClose={() => setEditOpen(false)}
          onUpdated={(patch) => setUser((prev) => ({ ...prev, ...patch }))}
        />
      )}
    </main>
  );
}
