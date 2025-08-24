import { useState, useEffect } from 'react';
import ModalShell from '@/roomedit/ModalShell';
import JoinOptionsContent from '@/roomedit/JoinOptionsContent';
import { POSITIONS, QUEUES } from '@/roomedit/constants';

const CAPACITY_OPTIONS = [2, 3, 4, 5];

// API 요청 스펙에 맞게 payload 변환
function mapPayloadToAPI(payload) {
  return {
    name: payload.title || '',
    max_members: Number(payload.capacity) || 2,
    queue_type: payload.queue || 'solo_lank',
    use_discord: Boolean(payload.options?.discord ?? payload.discord),
    mic_required: Boolean(payload.options?.mic ?? payload.mic),
    listen_only_allowed: Boolean(
      payload.options?.listenOnly ?? payload.listenOnly,
    ),
    riot_account_id: Number(payload.riotTag), // ⚠️ 숫자 필수
    position:
      Array.isArray(payload.myPos) && payload.myPos.length
        ? payload.myPos[0]
        : 'top',
    hashtags: Array.isArray(payload.lookingFor) ? payload.lookingFor : [],
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
  defaultQueue = 'solo_lank',
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

  const [riotTag, setRiotTag] = useState(
    Number(defaultRiotTag) || Number(riotTags?.[0]?.id) || 0,
  );
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

  useEffect(() => {
    if (
      (!riotTag || riotTag === 0) &&
      Array.isArray(riotTags) &&
      riotTags.length
    ) {
      setRiotTag(Number(riotTags[0].id));
    }
  }, [riotTags]); // riotTag를 의존성에 넣지 말 것 (무한루프 방지)

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

      if (next.has(k)) {
        next.delete(k);
      } else {
        if (next.size >= 3) {
          alert('최대 3개까지만 선택할 수 있습니다.');
          return next; //
        }
        next.add(k);
      }

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

  // const payload = useMemo(
  //   () => ({
  //     role: isHost ? 'host' : 'guest',
  //     riotTag,
  //     title,
  //     queue,
  //     myPositions: Array.from(myPos),
  //     lookingFor: Array.from(lookingPos),
  //     capacity,
  //     options: { discord, mic, listenOnly },
  //   }),
  //   [isHost, riotTag, title, queue, myPos, lookingPos, capacity, discord, mic, listenOnly],
  // );

  const submitHandler = async (raw) => {
    if (mode === 'host') {
      if (!raw?.riotTag) {
        alert('라이엇 계정을 선택하세요.');
        return;
      }
      if (!Array.isArray(raw?.myPos) || raw.myPos.length === 0) {
        alert('나의 포지션을 1개 이상 선택하세요.');
        return;
      }

      const apiPayload = mapPayloadToAPI(raw);
      console.log('📦 최종 API Payload (서버 전송):', apiPayload);

      try {
        const res = await fetch('https://api.lol99.kro.kr/chat/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(apiPayload),
        });

        if (!res.ok) {
          try {
            console.log('❗서버 응답:', await res.json());
          } catch (e) {
            console.warn('서버 응답 JSON 파싱 실패', e);
          }
          throw new Error('방 생성 실패');
        }

        const data = await res.json();
        console.log('방 생성 성공:', data);
        onSubmit?.('create', data);
      } catch (err) {
        console.error('❌ API 오류:', err);
      }
      return;
    }

    if (mode === 'guest') {
      onSubmit?.('join', raw);
    } else if (mode === 'edit') {
      onSubmit?.('update', raw);
    }
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
