import { useEffect, useState } from 'react';
import MyPageForm from '@/components/MyPageForm';
import { getUserMe, addRiotAccount, removeRiotAccount } from '@/api/user';

export default function MyPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await getUserMe();
      setUser(data);
    } catch (err) {
      console.error('유저 정보 불러오기 실패:', err);
    }
  };

  const handleAddRiot = async () => {
    const game_name = prompt('게임 닉네임 입력 (예: Hide on bush)');
    const tag_line = prompt('태그 입력 (예: KR1)');
    if (!game_name || !tag_line) return;

    try {
      const newAcct = await addRiotAccount({ game_name, tag_line });
      setUser((prev) => ({
        ...prev,
        riot_accounts: [...(prev.riot_accounts || []), newAcct],
      }));
    } catch (err) {
      console.error('추가 실패:', err);
      alert('계정 추가 실패!');
    }
  };

  const handleRemoveRiot = async (accountId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await removeRiotAccount(accountId);
      setUser((prev) => ({
        ...prev,
        riot_accounts: prev.riot_accounts.filter(
          (acct) => acct.id !== accountId,
        ),
      }));
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제 실패!');
    }
  };

  if (!user) return <p className="text-white">로딩 중...</p>;

  return (
    <MyPageForm
      email={user.email}
      riotAccounts={user.riot_accounts.map(
        (acct) => `${acct.game_name}#${acct.tag_line}`,
      )}
      onAddRiot={handleAddRiot}
      onRemoveRiot={(i) => handleRemoveRiot(user.riot_accounts[i].id)}
    />
  );
}
