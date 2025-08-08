import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import CustomInput from '@/components/CustomInput';

export default function MyPageForm({
  email = '-',
  riotAccounts = [],
  onAddRiot, // 플러스 버튼 클릭 핸들러
  onRemoveRiot, // 삭제 버튼 핸들러(옵션)
}) {
  return (
    <form className="space-y-16" onSubmit={(e) => e.preventDefault()}>
      {/* 기본정보 */}
      <section className="space-y-3">
        <h3 className="text-sm text-[#a7a7a7]">기본정보</h3>
        <div className="w-full max-w-md">
          <CustomInput
            label="E-mail"
            value={email ?? '-'}
            readOnly
            className="bg-[#3A3A3A] border-[#575757] rounded-xl px-5"
          />
        </div>
      </section>

      {/* 회원 정보 추가 */}
      <section className="space-y-2">
        <h3 className="text-sm text-[#a7a7a7]">회원 정보 추가</h3>
        <Link
          to="/add-info"
          className="text-[#22c1a3] hover:underline font-semibold"
        >
          추가 정보 입력
        </Link>
      </section>

      {/* 연결된 계정 */}
      <section className="space-y-4">
        <h3 className="text-sm text-[#a7a7a7]">연결된 계정</h3>

        <div className="bg-[#3A3A3A] border border-[#575757] rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold">라이엇 게임즈</h4>

            <button
              type="button"
              onClick={onAddRiot}
              aria-label="라이엇 계정 추가"
              className="relative inline-flex items-center justify-center w-10 h-10
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70
                          transition-transform hover:scale-110 active:scale-95"
            >
              <Plus
                className="w-6 h-6 drop-shadow-[0_0_10px_rgba(34,193,163,0.85)] cursor-pointer"
                strokeWidth={2.25}
              />
              <span className="sr-only">라이엇 계정 추가</span>
            </button>
          </div>

          <ul className="space-y-2 list-none">
            {riotAccounts.length === 0 ? (
              <li className="text-sm text-[#bdbdbd]">
                연결된 계정이 없습니다.
              </li>
            ) : (
              riotAccounts.map((acct, i) => (
                <li
                  key={`${acct}-${i}`}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="tracking-wide">
                    {i + 1}. {acct}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveRiot?.(i)}
                    disabled={!onRemoveRiot}
                    className={`text-[#e0e0e0] ${onRemoveRiot ? 'hover:underline' : 'opacity-60 cursor-pointer'}`}
                  >
                    삭제
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {/* 회원 탈퇴 (모양만) */}
      <div className="pt-4 border-t border-[#575757] flex justify-end">
        <button
          type="button"
          disabled
          className="px-4 py-2 rounded-md bg-[#3F3E3E] border border-[#787878] text-[#eaeaea]
                      hover:bg-[#4a4949] hover:border-[#a0a0a0] cursor-not-allowed"
        >
          회원 탈퇴
        </button>
      </div>
    </form>
  );
}
