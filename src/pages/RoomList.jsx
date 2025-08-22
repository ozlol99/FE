import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Fab from '@/components/Fab';
import RoomsGridSection from '@/components/RoomsGridSection';
import TabOptions from '@/components/TabOptions';
import JoinOptions from '@/components/JoinOptions';

// 기본 큐 옵션
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

  // ✅ WebSocket 상태 저장
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtaWthbjMxQG5hdmVyLmNvbSIsImV4cCI6MTc1NTc4ODI5MH0.PM-Rm2VrYagr_YmDHwAIsiwM2krHOwA2cfvLNqNag7M',
    ); // 🔑 토큰 가져오기
    if (!token) {
      console.error('❌ access_token 없음. 로그인 먼저 필요');
      return;
    }

    // ✅ 토큰을 쿼리스트링으로 붙여서 연결
    const socket = new WebSocket(
      `wss://api.lol99.kro.kr/chat/ws/1?token=${token}`,
    );

    socket.addEventListener('open', () => {
      console.log('✅ WebSocket 연결됨');
      socket.send(JSON.stringify({ type: 'rooms:get' })); // 연결되면 방 리스트 요청
    });

    socket.addEventListener('message', (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log('📩 서버 메시지:', msg);

        if (msg.type === 'rooms:list') {
          setRooms(msg.payload);
        }

        if (msg.type === 'room:created') {
          setRooms((prev) => [msg.payload, ...prev]);
        }
      } catch (e) {
        console.error('WS 메시지 파싱 실패:', e);
      }
    });

    socket.addEventListener('close', () => {
      console.log('⚠️ WebSocket 연결 종료됨');
    });

    socket.addEventListener('error', (err) => {
      console.error('❌ WebSocket 에러:', err);
    });

    setWs(socket);

    // cleanup
    return () => {
      socket.close();
    };
  }, []);

  // ✅ 메시지 안전하게 보내는 함수
  const safeSend = (msg) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    } else {
      console.warn('⚠️ WebSocket 아직 준비 안됨');
    }
  };

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
    safeSend({
      type: 'room:join',
      payload: {
        roomId: room.id,
        riotAccountId: 123, // 더미값 (로그인 연동되면 실제 사용자 ID)
        position: 'mid', // 선택된 포지션
      },
    });

    console.log('방 참가 요청 ✅', room.id);
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
