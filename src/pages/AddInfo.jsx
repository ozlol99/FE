import React, { useState } from 'react';
import CustomInput from '@/components/CustomInput';
import GenderToggle from '@/components/ToggleButton';

const Form = ({ form, setForm }) => (
  <div className="flex items-center justify-center bg-[#181818] w-full">
    <form className="w-full max-w-[570px] flex flex-col gap-3 bg-[#232222] rounded-xl shadow-lg p-8">
      {/* 제목 */}
      <h2 className="text-2xl font-extrabold text-white mb-6 text-center">
        추가정보입력
      </h2>

      {/* 닉네임 */}
      <CustomInput
        label="닉네임"
        value={form.nickname}
        onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
        placeholder="닉네임 입력"
      />

      {/* 라이엇태그 + #KR */}
      <div className="relative">
        <CustomInput
          label="라이엇태그"
          value={form.riotTag}
          onChange={(e) => setForm((f) => ({ ...f, riotTag: e.target.value }))}
          placeholder="라이엇태그를 입력해주세요"
          className="pr-14"
        />
      </div>
      {form.riotTag && !/^[a-zA-Z0-9가-힣]+#[0-9]{2,5}$/.test(form.riotTag) && (
        <div className="text-red-500 text-xs">
          올바른 라이엇태그를 입력하세요 (예: 알 아#뭘알아12)
        </div>
      )}

      {/* 생년월일 + 성별 한 줄 */}
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <CustomInput
            label="생년월일"
            value={form.birth}
            onChange={(e) => setForm((f) => ({ ...f, birth: e.target.value }))}
            type="date"
            className="min-w-0"
          />
        </div>
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
      </div>

      {/* 약관 텍스트 */}
      <textarea
        className="w-full border border-[#787878] rounded-md bg-[#3F3E3E] text-[#B0B0B0] text-xs p-3 resize-none mt-2"
        rows={3}
        value="여기에 이용약관 내용이 들어갑니다. (수정불가)"
        disabled
      />

      {/* 확인 버튼 */}
      <button
        type="submit"
        className="w-full mx-auto bg-[#3F3E3E] border border-[#787878] text-white font-extrabold text-lg rounded-md py-2 mt-2 transition hover:bg-[#484848] hover:border-[#a0a0a0] cursor-pointer"
        disabled={
          !form.nickname ||
          !form.riotTag ||
          !form.birth ||
          !form.gender ||
          !form.agree
        }
      >
        확인
      </button>
    </form>
  </div>
);

export default function AdditionalInfo() {
  const [form, setForm] = useState({
    nickname: '',
    riotTag: '',
    birth: '',
    gender: '',
    agree: false,
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#181818]">
      <Form form={form} setForm={setForm} />
    </div>
  );
}
