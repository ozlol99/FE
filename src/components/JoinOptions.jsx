import { useMemo, useState } from 'react';
import ModalShell from '@/roomedit/ModalShell';
import JoinOptionsContent from '@/roomedit/JoinOptionsContent';
import { POSITIONS, QUEUES } from '@/roomedit/constants';

const CAPACITY_OPTIONS = [2, 3, 4, 5];

// 👉 API 요청 스펙에 맞게 payload 변환
function mapPayloadToAPI(payload) {
  return {
    name: payload.title, // 방 제목
    max_members: payload.capacity, // 인원수
    queue_type: payload.queue, // 큐 타입
    use_discord: payload.options.discord, // 디스코드 사용 여부
    mic_required: payload.options.mic, // 마이크 필수 여부
    listen_only_allowed: payload.options.listenOnly, // 듣기 전용 허용 여부
    riot_account_id: payload.riotTag, // 선택된 라이엇 계정 id
    position: payload.myPositions[0] || null, // 내 포지션(단일)
    hashtags: payload.lookingFor, // 찾는 포지션 배열
  };
}

export default function JoinOptions({
  mode = 'guest',
  asModal = false,
  open = false,
  onClose,
  backdropClosable = false,
  titleText,
  riotTags = [],
  defaultRiotTag = '',
  defaultTitle = '',
  defaultQueue = 'solo',
  defaultMyPositions = [],
  defaultLookingFor = [],
  defaultDiscord = false,
  defaultMic = true,
  defaultListenOnly = false,
  defaultCapacity = 5,
  maxMyPositions = 1,
  onSubmit,
}) {
  const isHost = mode === 'host' || mode === 'edit';

  // 🔹 상태값 관리
  const [riotTag, setRiotTag] = useState(defaultRiotTag || riotTags[0] || '');
  const [title, setTitle] = useState(defaultTitle);
  const [queue, setQueue] = useState(defaultQueue);
  const [myPos, setMyPos] = useState(() => new Set(defaultMyPositions));
  const [lookingPos, setLookingPos] = useState(
    () => new Set(defaultLookingFor),
  );
  const [discord, setDiscord] = useState(defaultDiscord);
  const [mic, setMic] = useState(defaultMic);
  const [listenOnly, setListenOnly] = useState(defaultListenOnly);
  const [capacity, setCapacity] = useState(defaultCapacity);

  const myCount = myPos.size;
  const myLimitReached = myCount >= maxMyPositions;

  const titleMap = {
    host: '방 만들기',
    guest: '방 참가하기',
    edit: '방 수정하기',
  };

  const titleLabel = titleText || titleMap[mode];

  const locks = {
    host: {
      title: false,
      queue: false,
      looking: false,
      options: false,
      capacity: false,
    },
    edit: {
      title: false,
      queue: false,
      looking: false,
      options: false,
      capacity: false,
    },
    guest: {
      title: true,
      queue: true,
      looking: true,
      options: true,
      capacity: true,
    },
  };

  const currentLocks = locks[mode] || locks.guest;

  const allow =
    (fn, allow) =>
    (...args) =>
      allow ? fn(...args) : undefined;

  const toggleMy = (k) => {
    setMyPos((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else {
        if (next.size >= maxMyPositions) return next;
        next.add(k);
      }
      return next;
    });
  };

  const toggleLooking = allow((k) => {
    setLookingPos((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  }, isHost);

  const onTitleChange = allow((eOrValue) => {
    setTitle(
      typeof eOrValue === 'string' ? eOrValue : (eOrValue?.target?.value ?? ''),
    );
  }, isHost);

  const setQueueGuard = allow(setQueue, isHost);
  const setDiscordGuard = allow(setDiscord, isHost);
  const setMicGuard = allow(setMic, isHost);
  const setListenOnlyGuard = allow(setListenOnly, isHost);
  const setCapacityGuard = allow(setCapacity, isHost);

  // 🔹 내부 관리용 payload
  const payload = useMemo(
    () => ({
      role: isHost ? 'host' : 'guest',
      riotTag,
      title,
      queue,
      myPositions: Array.from(myPos),
      lookingFor: Array.from(lookingPos),
      capacity,
      options: { discord, mic, listenOnly },
    }),
    [
      isHost,
      riotTag,
      title,
      queue,
      myPos,
      lookingPos,
      capacity,
      discord,
      mic,
      listenOnly,
    ],
  );

  // 🔹 API 요청 핸들러
  const submitHandler = async () => {
    const apiPayload = mapPayloadToAPI(payload);

    if (mode === 'host') {
      try {
        const res = await fetch('https://api.lol99.kro.kr/chat/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', //  쿠키 자동 포함
          body: JSON.stringify(apiPayload),
        });

        if (!res.ok) throw new Error('방 생성 실패');
        const data = await res.json();
        console.log('방 생성 성공:', data);
        onSubmit?.('create', data);
      } catch (err) {
        console.error('❌ API 오류:', err);
      }
    }

    if (mode === 'guest') onSubmit?.('join', payload);
    if (mode === 'edit') onSubmit?.('update', payload);
  };

  const card = (
    <div className="w-full max-w-[620px] rounded-2xl border border-[#2b3240]/80 bg-gradient-to-b from-[#1a1f29] to-[#0f141b] shadow-[0_12px_28px_rgba(0,0,0,0.55)]">
      <JoinOptionsContent
        asModal={asModal}
        titleText={titleLabel}
        onClose={onClose}
        locks={currentLocks}
        riotTags={riotTags}
        riotTag={riotTag}
        onChangeRiotTag={setRiotTag}
        title={title}
        onChangeTitle={onTitleChange}
        POSITIONS={POSITIONS}
        QUEUES={QUEUES}
        myCount={myCount}
        maxMyPositions={maxMyPositions}
        myPos={myPos}
        toggleMy={toggleMy}
        myLimitReached={myLimitReached}
        queue={queue}
        setQueue={setQueueGuard}
        discord={discord}
        setDiscord={setDiscordGuard}
        mic={mic}
        setMic={setMicGuard}
        listenOnly={listenOnly}
        setListenOnly={setListenOnlyGuard}
        lookingPos={lookingPos}
        toggleLooking={toggleLooking}
        isHost={isHost}
        capacity={capacity}
        onChangeCapacity={setCapacityGuard}
        capacityOptions={CAPACITY_OPTIONS}
        submitLabel={
          mode === 'host' ? '방 만들기' : mode === 'edit' ? '수정 완료' : '참가'
        }
        onSubmit={submitHandler}
      />
    </div>
  );

  if (!asModal) return card;
  console.log('JoinOptions open:', open, 'mode:', mode);
  return (
    <ModalShell
      open={!!open}
      onClose={onClose}
      backdropClosable={backdropClosable}
    >
      {card}
    </ModalShell>
  );
}
