import { useState, useMemo } from 'react';
import { useSocket } from '@/context/SocketProvider'; // ✅
import Fab from '@/components/Fab';
import RoomsGridSection from '@/components/RoomsGridSection';
import TabOptions from '@/components/TabOptions';
import JoinOptions from '@/components/JoinOptions';

// (옵션) 공용 ACK 유틸을 이미 만들었으면 그걸 사용
// import { createRoom } from "@/api/roomSocketApi";

const DEFAULT_QUEUES = [
  { key: 'all', label: '전체' },
  { key: 'solo', label: '솔로랭크' },
  { key: 'flex', label: '자유랭크' },
  { key: 'aram', label: '칼바람 나락' },
];

// fallback: 간단 ACK 헬퍼 (roomSocketApi 없을 때)
const emitAck = (socket, event, payload) =>
  new Promise((resolve, reject) => {
    socket.emit(event, payload, (res) => {
      if (res?.ok) resolve(res);
      else reject(res?.error || new Error('Socket ACK failed'));
    });
  });

export default function RoomList({ selectedQueue, onChangeQueue, queues }) {
  const [openCreate, setOpenCreate] = useState(false); // 방 만들기
  const [openJoin, setOpenJoin] = useState(false); // 방 참가하기
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleJoin = (roomId) => {
    setSelectedRoom(roomId);
    setOpenJoin(true);
  };

  const socket = useSocket(); // ✅

  const items = queues?.length ? queues : DEFAULT_QUEUES;
  const [internal, setInternal] = useState(items[0]?.key ?? 'all');
  const active = selectedQueue ?? internal;
  const setActive = (key) =>
    onChangeQueue ? onChangeQueue(key) : setInternal(key);

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // 🔽 rooms를 setRooms로 변경 (생성 성공 시 바로 prepend)
  const [rooms, setRooms] = useState(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      id: String(i + 1),
      title: i % 2 ? '같이 하실분' : '원딜/서폿 구해요',
      queue: pick(['solo', 'flex', 'aram']),
      members: 1 + (i % 4),
      capacity: pick([2, 3, 4, 5]),
      tags: ['실버', '골드', '사람']
        .sort(() => 0.5 - Math.random())
        .slice(0, 3),
      discord: pick(['green', 'yellow']),
      mic: pick(['on', 'off', 'no']),
      createdAt: Date.now() - pick([5, 12, 30, 45, 90, 180]) * 60 * 1000,
      host: i % 2 ? '닉네임' : 'CaptainLee',
      lookingFor: ['top', 'jungle', 'mid', 'bottom', 'support']
        .sort(() => 0.5 - Math.random())
        .slice(0, 2),
    })),
  );

  const visibleRooms = useMemo(
    () => (active === 'all' ? rooms : rooms.filter((r) => r.queue === active)),
    [active, rooms],
  );

  // ✅ 방 만들기 submit (ACK 받고 리스트에 추가)
  const handleCreate = async (payload) => {
    try {
      // roomSocketApi가 있다면: const res = await createRoom(socket, payload);
      const res = await emitAck(socket, 'room:create', payload);
      // res 예시: { ok:true, roomId, room: { id, title, queue, capacity, ... } }

      const newRoom = res.room ?? { id: res.roomId, ...payload, members: 1 };
      setRooms((prev) => [newRoom, ...prev]); // 목록에 즉시 반영
      setOpenCreate(false);

      // (선택) alert/토스트로도 확인
      console.log('created:', res);
      alert(`방 생성 완료! ID: ${res.roomId || newRoom.id}`);
    } catch (e) {
      console.error(e);
      alert(e?.message || '방 생성 실패');
    }
  };

  return (
    <div className="min-h-dvh bg-[#0f1115] text-[#eaeaea]">
      <TabOptions items={items} value={active} onChange={setActive} />

      <RoomsGridSection
        rooms={visibleRooms}
        onClick={(id) => console.log('open room', id)}
        onJoin={handleJoin}
      />

      {/* 방 만들기: host 모드로 오픈 */}
      <Fab onClick={() => setOpenCreate(true)} ariaLabel="방 만들기" />

      <JoinOptions
        mode="host"
        asModal
        open={openCreate} // host는 openCreate
        onClose={() => setOpenCreate(false)}
        onSubmit={(action, payload) => {
          if (action === 'create') {
            handleCreate(payload);
          }
        }}
      />

      {/* 방 참가하기 (guest) */}
      <JoinOptions
        mode="guest"
        asModal
        open={openJoin} // guest는 openJoin
        onClose={() => setOpenJoin(false)}
        defaultTitle={selectedRoom?.title}
        defaultQueue={selectedRoom?.queue}
        defaultLookingFor={selectedRoom?.lookingFor}
        onSubmit={(action, payload) => {
          if (action === 'join') {
            handleJoin(payload);
          }
        }}
      />
    </div>
  );
}
