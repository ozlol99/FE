import { useCallback, useState } from 'react';
import { updateUserMe } from '../api/user';

export default function useProfile({ user, setUser }) {
  const [editOpen, setEditOpen] = useState(false);

  const openEdit = useCallback(() => setEditOpen(true), []);
  const closeEdit = useCallback(() => setEditOpen(false), []);

  const updateProfile = useCallback(
    async ({ nickname, gender, birthday }) => {
      const payload = {
        user: nickname?.trim?.() ?? undefined,
        gender:
          typeof gender === 'string'
            ? gender === 'true'
              ? true
              : gender === 'false'
                ? false
                : null
            : gender,
        birthday: birthday || null,
      };

      const snapshot = user;
      try {
        setUser((prev) => ({
          ...prev,
          nickname: payload.user ?? prev?.nickname,
          gender: payload.gender ?? prev?.gender,
          birthday: payload.birthday ?? prev?.birthday,
        }));
        await updateUserMe(payload);
      } catch (e) {
        console.error('useProfile update failed', e);
        alert('회원정보 수정 실패');
        setUser(snapshot);
        throw e;
      }
    },
    [setUser, user],
  );

  return { editOpen, openEdit, closeEdit, updateProfile };
}
