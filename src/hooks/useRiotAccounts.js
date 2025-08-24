import { useState } from 'react';
import { addRiotAccount, removeRiotAccount } from '@/api/user';

export default function useRiotAccounts({ user, setUser }) {
  const [isAddOpen, setAddOpen] = useState(false);

  const addOne = async ({ game_name, tag_line }) => {
    const tempId = `temp-${Date.now()}`;
    const temp = { id: tempId, game_name, tag_line };

    setUser((prev) => ({
      ...prev,
      riot_accounts: [...(prev?.riot_accounts ?? []), temp],
    }));

    try {
      const created = await addRiotAccount({ game_name, tag_line });
      setUser((prev) => ({
        ...prev,
        riot_accounts: (prev?.riot_accounts ?? []).map((a) =>
          a.id === tempId ? created : a,
        ),
      }));
    } catch (e) {
      console.error('useRiotAccounts 추가 실패', e);
      alert('계정 추가 실패');
      setUser((prev) => ({
        ...prev,
        riot_accounts: (prev?.riot_accounts ?? []).filter(
          (a) => a.id !== tempId,
        ),
      }));
      throw e;
    }
  };

  const removeOne = async (id) => {
    const snapshot = user?.riot_accounts ?? [];
    setUser((prev) => ({
      ...prev,
      riot_accounts: snapshot.filter((a) => a.id !== id),
    }));
    try {
      await removeRiotAccount(id);
    } catch (e) {
      console.error('useRiotAccounts 삭제 실패', e);
      alert('삭제 실패');
      setUser((prev) => ({ ...prev, riot_accounts: snapshot }));
    }
  };

  return { addOne, removeOne, isAddOpen, setAddOpen };
}
