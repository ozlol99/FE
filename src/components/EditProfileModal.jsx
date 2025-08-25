import React, { useMemo, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { updateUserMe } from '@/api/user';
import GenderToggle from '@/components/ToggleButton';

function dateInputToUTCISO(yyyyMmDd) {
  if (!yyyyMmDd) return null;
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0)).toISOString();
}

export default function EditProfileModal({ initial, onClose, onUpdated }) {
  const [form, setForm] = useState({
    nickname: initial?.nickname ?? '',
    gender: initial?.gender ?? null,
    birthday: initial?.birthday ? initial.birthday.slice(0, 10) : '',
  });

  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => form.nickname.trim().length > 0, [form]);
  const onChange = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const payload = {
      user: form.nickname.trim(),
      gender: form.gender,
      birthday: form.birthday ? dateInputToUTCISO(form.birthday) : null,
    };

    try {
      if (typeof updateUserMe === 'function') {
        await updateUserMe(payload);
      } else {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE || 'https://api.lol99.kro.kr'}/user/me`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
          },
        );
        if (!res.ok) throw new Error('PATCH /user/me failed');
      }
      onUpdated?.({
        nickname: payload.user,
        gender: payload.gender,
        birthday: payload.birthday,
      });
      onClose();
    } catch (e) {
      console.error('[EditProfileModal] update failed', e);
      alert('회원정보 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="absolute inset-0 grid place-items-center p-4">
        <form
          onSubmit={submit}
          className="w-full max-w-md rounded-2xl bg-[#2e2e2e] border border-[#565656] shadow-xl"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#4a4a4a]">
            <h3
              id="edit-profile-title"
              className="text-lg font-semibold text-white"
            >
              회원 정보 수정
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-5 py-4 space-y-4">
            <label className="block">
              <span className="block text-sm text-[#bdbdbd] mb-1">닉네임</span>
              <input
                value={form.nickname}
                onChange={onChange('nickname')}
                className="w-full rounded-xl text-white bg-[#3A3A3A] border border-[#575757] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              />
            </label>

            <div>
              <span className="block text-sm text-[#bdbdbd] mb-1">성별</span>
              <GenderToggle
                value={form.gender}
                onChange={(g) => setForm((f) => ({ ...f, gender: g }))}
              />
            </div>

            <label className="block">
              <span className="block text-sm text-[#bdbdbd] mb-1">생일</span>
              <input
                type="date"
                value={form.birthday}
                onChange={onChange('birthday')}
                className="w-full rounded-xl text-white bg-[#3A3A3A] border border-[#575757] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              />
            </label>
          </div>

          <div className="px-5 py-4 border-t border-[#4a4a4a] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-white rounded-lg border border-[#5b5b5b] hover:bg-[#3a3a3a]"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500/90 hover:bg-teal-400 text-black font-medium disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> 저장 중
                </>
              ) : (
                <>저장</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
