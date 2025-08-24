import React, { useMemo, useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function AddRiotModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ game_name: '', tag_line: '' });
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => form.game_name.trim().length > 0 && form.tag_line.trim().length > 0,
    [form],
  );

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        game_name: form.game_name.trim(),
        tag_line: form.tag_line.trim(),
      });
      onClose();
    } catch (err) {
      console.error('submit failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-riot-title"
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
              id="add-riot-title"
              className="text-lg text-white font-semibold"
            >
              라이엇 계정 추가
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
              <span className="block text-sm text-[#bdbdbd] mb-1">
                게임 닉네임
              </span>
              <input
                value={form.game_name}
                onChange={handle('game_name')}
                placeholder="예: Hide on bush"
                className="w-full rounded-xl text-white bg-[#3A3A3A] border border-[#575757] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-[#bdbdbd] mb-1">태그</span>
              <input
                value={form.tag_line}
                onChange={handle('tag_line')}
                placeholder="예: KR1"
                className="w-full rounded-xl text-white bg-[#3A3A3A] border border-[#575757] px-4 py-2 text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              />
            </label>
            <p className="text-xs text-[#9b9b9b]">
              계정명은 <span className="font-medium">닉네임#태그</span> 형태로
              표시됩니다.
            </p>
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
