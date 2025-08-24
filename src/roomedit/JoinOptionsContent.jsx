import Switch from './Switch';

export default function JoinOptionsContent({
  asModal,
  titleText,
  onClose,

  // 상단 입력
  riotTags,
  riotTag,
  onChangeRiotTag,
  title,
  onChangeTitle,

  // 포지션/큐/스위치
  POSITIONS,
  QUEUES,
  myPos,
  toggleMy,
  queue,
  setQueue,
  discord,
  setDiscord,
  mic,
  setMic,
  listenOnly,
  setListenOnly,

  // 찾는 포지션
  lookingPos,
  toggleLooking,

  // 호스트/락 관련
  isHost = false,
  locks = {},
  capacity,
  onChangeCapacity,
  capacityOptions = [2, 3, 4, 5],

  // 제출
  onSubmit,
}) {
  // 🔹 API 요청 스펙에 맞게 payload 변환
  const buildApiPayload = () => {
    return {
      name: title, // 방 제목
      max_members: capacity, // 최대 인원
      queue_type: queue, // 큐 타입
      use_discord: discord, // 디스코드 여부
      mic_required: mic, // 마이크 필수 여부
      listen_only_allowed: listenOnly, // 듣기만 허용
      riot_account_id: riotTag, // 선택된 라이엇 계정 (id)
      position: Array.from(myPos)[0] || null, // 내 포지션 (단일)
      hashtags: Array.from(lookingPos ?? []), // 찾는 포지션 배열
    };
  };

  // 🔹 등록 시 처리
  const handleSubmit = () => {
    const apiPayload = buildApiPayload();
    console.log('📦 최종 API Payload:', apiPayload);

    onSubmit(apiPayload); // 부모에서 fetch 실행
  };

  const isLocked = (k) => Boolean(locks?.[k]);
  const clsLocked = 'opacity-50 cursor-not-allowed pointer-events-none';
  const clsField =
    'w-full rounded-md border border-[#2b3240] bg-[#0b0f14] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BBA3]';

  const canToggleLooking = !isLocked('looking');

  return (
    <div className="p-5 text-[#eaeaea]">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 id="join-options-title" className="text-lg font-semibold">
          {titleText}
        </h2>
        {asModal && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#2b3240] px-2 py-1 text-sm hover:bg-white/5 cursor-pointer"
          >
            닫기
          </button>
        )}
      </div>

      {/* 라이엇 태그 + 방 제목 */}
      <div className="mb-4 rounded-lg border border-[#2b3240] bg-[#0f141b] p-3">
        <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3">
            <select
              value={riotTag}
              onChange={(e) => onChangeRiotTag(Number(e.target.value))}
              className={clsField}
            >
              {riotTags?.length ? (
                riotTags.map((acc) => (
                  <option key={acc.id} value={Number(acc.id)}>
                    {acc.tag}
                  </option>
                ))
              ) : (
                <option value="">연동된 태그 없음</option>
              )}
            </select>
          </div>

          <div className="md:col-span-8 lg:col-span-9">
            {/* 방 제목 입력 */}
            <input
              value={title}
              onChange={(e) => (isLocked('title') ? null : onChangeTitle(e))}
              placeholder="예: 골드 정글 같이 할 분?"
              className={`${clsField} ${isLocked('title') ? clsLocked : ''}`}
              aria-disabled={isLocked('title')}
            />
          </div>
        </div>
      </div>

      {/* 상단 그리드: 내 포지션 / 큐 / 스위치 */}
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
        {/* 내 포지션 */}
        <div className="min-w-0 md:col-span-5 lg:col-span-5">
          <p className="mb-2 text-sm text-slate-300">나의 포지션</p>
          <div className="flex flex-nowrap gap-2 overflow-x-auto">
            {POSITIONS.map((p) => {
              const selected = myPos.has(p.key);
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => toggleMy(p.key)}
                  title={p.label}
                  className={[
                    'relative grid size-10 place-items-center rounded-md border transition',
                    selected
                      ? 'border-[#00BBA3] bg-[#00BBA3]/15 shadow-[0_0_0_1px_rgba(0,187,163,0.25)_inset]'
                      : 'border-[#2b3240] bg-[#0f141b] hover:bg-[#131a22]',
                  ].join(' ')}
                >
                  <img src={p.icon} alt={p.label} className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* 큐 선택 */}
        <div className="md:col-span-3 lg:col-span-3">
          <label className="mb-2 block text-sm text-slate-300">큐 선택</label>
          <select
            value={queue}
            onChange={(e) =>
              isLocked('queue') ? null : setQueue(e.target.value)
            }
            className={`${clsField} ${isLocked('queue') ? clsLocked : ''}`}
            aria-disabled={isLocked('queue')}
          >
            {QUEUES.map((q) => (
              <option key={q.key} value={q.key}>
                {q.label}
              </option>
            ))}
          </select>
        </div>

        {/* 옵션 스위치 */}
        <div className="md:col-span-4 lg:col-span-4">
          <div className={isLocked('options') ? 'opacity-50' : ''}>
            <Switch
              label="디스코드"
              checked={discord}
              onChange={(v) => (isLocked('options') ? null : setDiscord(v))}
              size="sm"
              disabled={isLocked('options')}
            />
            <Switch
              label="마이크"
              checked={mic}
              onChange={(v) => (isLocked('options') ? null : setMic(v))}
              size="sm"
              disabled={isLocked('options')}
            />
            <Switch
              label="듣기만"
              checked={listenOnly}
              onChange={(v) => (isLocked('options') ? null : setListenOnly(v))}
              size="sm"
              disabled={isLocked('options')}
            />
          </div>
        </div>
      </div>

      {/* 찾는 포지션 */}
      <div className="mt-3">
        <p className="mb-2 text-sm text-slate-300">찾는 포지션</p>
        <div className="flex flex-wrap gap-2">
          {POSITIONS.map((p) => {
            const active = lookingPos?.has?.(p.key);
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => (canToggleLooking ? toggleLooking(p.key) : null)}
                className={[
                  'relative grid size-10 place-items-center rounded-md border transition',
                  active
                    ? 'border-[#00BBA3] bg-[#00BBA3]/15'
                    : 'border-[#2b3240] bg-[#0f141b] hover:bg-[#131a22]',
                  canToggleLooking ? 'cursor-pointer' : clsLocked,
                ].join(' ')}
                aria-disabled={!canToggleLooking}
              >
                <img src={p.icon} alt={p.label} className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* (추가) 호스트 전용: 최대 인원 수 */}
      {isHost && (
        <div className="mt-4">
          <div className="mb-2 text-sm text-[#b9c2d0]">최대 인원 수</div>
          <div className="flex gap-2">
            {capacityOptions.map((n) => {
              const active = capacity === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChangeCapacity?.(n)}
                  className={[
                    'w-10 h-9 rounded-md border transition cursor-pointer',
                    active
                      ? 'border-[#69e5cf] bg-white/5 text-white'
                      : 'border-[#6b7280]/40 text-[#b9c2d0]/80 hover:bg-white/5',
                  ].join(' ')}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 경고 + 등록 */}
      <p className="mt-5 mb-3 text-xs leading-5 text-rose-400">
        타인에 대한 모욕, 명예훼손, 성희롱 등의 행위는 법적 처벌을 받을 수
        있습니다.
        <br />
        정지 사유에 해당하는 단어 언급 시 1년간 이용이 불가할 수 있습니다.
      </p>
      <div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-lg bg-[#00BBA3] px-4 py-3 text-sm font-semibold text-[#0b0f14] hover:opacity-90 cursor-pointer"
        >
          {isHost ? '방 만들기' : '참가'}
        </button>
      </div>
    </div>
  );
}
