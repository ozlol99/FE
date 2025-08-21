import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Fab from '@/components/Fab';
import RoomsGridSection from '@/components/RoomsGridSection';
import TabOptions from '@/components/TabOptions';
import JoinOptions from '@/components/JoinOptions';
import { ws, safeSend } from '@/ws'; // ✅ 우리가 만든 WebSocket 클라이언트

const DEFAULT_QUEUES = [
  { key: 'all', label: '전체' },
  { key: 'solo_lank', label: '솔로랭크' },
  { key: 'flex', label: '자유랭크' },
  { key: 'aram', label: '칼바람 나락' },
];

export default function RoomList({ selectedQueue, onChangeQueue, queues }) {
  const [openCreate, setOpenCreate] = useState(false);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const items = queues?.length ? queues : DEFAULT_QUEUES;

  // ✅ URL 쿼리스트링에서 초기 탭 값 가져오기
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQueue = queryParams.get('queue') || 'all';

  const [internal, setInternal] = useState(initialQueue);
  const active = selectedQueue ?? internal;
  const setActive = (key) =>
    onChangeQueue ? onChangeQueue(key) : setInternal(key);

  // ✅ WebSocket 이벤트 리스너
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'rooms:list') {
          setRooms(msg.payload);
        }

        if (msg.type === 'room:created') {
          setRooms((prev) => [msg.payload, ...prev]);
        }
      } catch (e) {
        console.error('WS 메시지 파싱 실패:', e);
      }
    };

    ws.addEventListener('open', () => {
      console.log('✅ WebSocket 연결됨');
      safeSend({ type: 'rooms:get' }); // 서버에 방 리스트 요청
    });

    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, []);

  // ✅ 현재 탭에 맞는 방만 보여주기
  const visibleRooms = useMemo(
    () =>
      active === 'all' ? rooms : rooms.filter((r) => r.queue_type === active),
    [active, rooms],
  );

  // ✅ 방 만들기 (WebSocket 전송)
  const handleCreate = (payload) => {
    safeSend({
      type: 'room:create',
      payload,
    });
    setOpenCreate(false);
  };

  // ✅ 방 참가
  const handleJoin = (room) => {
    navigate(`/room/${room.id}`);
  };

  return (
    <div className="min-h-dvh bg-[#0f1115] text-[#eaeaea]">
      <TabOptions items={items} value={active} onChange={setActive} />

      <RoomsGridSection
        rooms={visibleRooms}
        onClick={(room) => console.log('방 열기', room)}
        onJoin={handleJoin}
      />

      <Fab onClick={() => setOpenCreate(true)} ariaLabel="방 만들기" />

      <JoinOptions
        mode="host"
        asModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={(action, payload) => {
          if (action === 'create') handleCreate(payload);
        }}
      />
    </div>
  );
}
