import { useMemo, useState } from 'react';
import ModalShell from '@/roomedit/ModalShell';
import JoinOptionsContent from '@/roomedit/JoinOptionsContent';
import { POSITIONS, QUEUES } from '@/roomedit/constants';

const CAPACITY_OPTIONS = [2, 3, 4, 5];

export default function JoinOptions({
  mode = 'guest',
  asModal = false,
  open = false,
  onClose,
  backdropClosable = false,
  titleText = '방 만들기',
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
  maxMyPositions = 2,
  onSubmit,
}) {
  const isHost = mode === 'host';

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

  const submitHandler = () => onSubmit?.(payload);

  const card = (
    <div className="w-full max-w-[620px] rounded-2xl border border-[#2b3240]/80 bg-gradient-to-b from-[#1a1f29] to-[#0f141b] shadow-[0_12px_28px_rgba(0,0,0,0.55)]">
      <JoinOptionsContent
        asModal={asModal}
        titleText={titleText}
        onClose={onClose}
        locks={{
          title: !isHost,
          queue: !isHost,
          looking: !isHost,
          options: !isHost,
        }}
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
        // 🔽 여기만 추가해서 Content가 "찾는 포지션" 아래에 렌더하도록
        isHost={isHost}
        capacity={capacity}
        onChangeCapacity={setCapacityGuard}
        capacityOptions={CAPACITY_OPTIONS}
        onSubmit={submitHandler}
      />
    </div>
  );

  if (!asModal) return card;

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
