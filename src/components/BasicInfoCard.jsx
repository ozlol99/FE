function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-3 items-center">
      <dt className="text-sm text-[#9e9e9e]">{label}</dt>
      <dd className="col-span-2">
        <div className="w-full rounded-xl bg-[#3A3A3A] border border-[#575757] px-4 py-2 text-sm text-[#eaeaea]">
          {value ?? '-'}
        </div>
      </dd>
    </div>
  );
}

export default function BasicInfoCard({
  email,
  nickname,
  birth,
  gender,
  onEdit,
}) {
  return (
    <section className="bg-[#2f2f2f] border border-[#575757] rounded-3xl p-6 md:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base text-[#a7a7a7]">기본정보</h2>
        <button
          type="button"
          onClick={onEdit}
          className="px-3 py-1.5 text-white rounded-xl border border-[#5b5b5b] hover:bg-[#3a3a3a] text-sm"
        >
          수정
        </button>
      </div>
      {/* api 추가해주면 정보 뜸 */}
      <InfoRow label="E-mail" value={email ?? '-'} />
      <InfoRow label="닉네임" value={nickname ?? '-'} />
      <InfoRow label="성별" value={fmtGender(gender)} />
      <InfoRow label="생일" value={birth ? birth.slice(0, 10) : '-'} />
    </section>
  );
}

function fmtGender(g) {
  if (g === true) return '남';
  if (g === false) return '여';
  if (typeof g === 'string') {
    const map = { male: '남', female: '여', other: '기타' };
    return map[g] ?? g;
  }
  return '-';
}
