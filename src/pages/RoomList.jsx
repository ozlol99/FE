import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Fab from '@/components/Fab';
import RoomsGridSection from '@/components/RoomsGridSection';
import TabOptions from '@/components/TabOptions';
import JoinOptions from '@/components/JoinOptions';

const DEFAULT_QUEUES = [
  { key: 'all', label: '전체' },
  { key: 'solo_lank', label: '솔로랭크' },
  { key: 'flex', label: '자유랭크' },
  { key: 'aram', label: '칼바람 나락' },
];

export default function RoomList({ queues }) {
  const [openCreate, setOpenCreate] = useState(false); // 방 만들기 모달
  const [openJoin, setOpenJoin] = useState(false); // 참가 모달
  const [joinTargetRoom, setJoinTargetRoom] = useState(null); // 참가할 방 정보

  const [rooms, setRooms] = useState([]);
  const [riotTags, setRiotTags] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState('all');
  const wsRef = useRef(null);

  const items = queues?.length ? queues : DEFAULT_QUEUES;

  // ✅ URL 쿼리스트링에서 초기 큐 값 가져오기
  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialQueue = queryParams.get('queue') || 'all';
    setSelectedQueue(initialQueue);
  }, [location.search]);

  // ✅ 초기 방 목록 불러오기
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('https://api.lol99.kro.kr/chat/rooms', {
          credentials: 'include', // ✅ 쿠키 포함
        });
        if (!res.ok) throw new Error('방 목록 불러오기 실패');
        const data = await res.json();
        console.log('✅ 초기 방 목록:', data);
        setRooms(data);
      } catch (err) {
        console.error('❌ Rooms API 오류:', err);
      }
    };
    fetchRooms();
  }, []);

  // ✅ Riot 계정 불러오기
  useEffect(() => {
    const fetchRiotAccounts = async () => {
      try {
        const res = await fetch('http://api.lol99.kro.kr/user/riot-accounts', {
          credentials: 'include', // ✅ 쿠키 포함
        });
        if (!res.ok) throw new Error('계정 불러오기 실패');
        const data = await res.json();
        console.log('연동된 라이엇 계정:', data);

        setRiotTags(
          data.map((acc) => ({
            id: acc.id,
            tag: `${acc.game_name}#${acc.tag_line}`,
          })),
        );
      } catch (err) {
        console.error('❌ Riot Account API 오류:', err);
      }
    };
    fetchRiotAccounts();
  }, []);

  // WebSocket 연결 (순수 WebSocket)
  useEffect(() => {
    const ws = new WebSocket(`wss://api.lol99.kro.kr/chat/ws`); // 토큰 필요 없는 경우
    wsRef.current = ws;

    ws.onopen = () => console.log('🔌 WebSocket 연결 성공');
    ws.onclose = () => console.log('❌ WebSocket 연결 종료');
    ws.onerror = (err) => console.error('⚠️ WebSocket 에러:', err);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log('WS 이벤트 수신:', msg);

        switch (msg.type) {
          case 'room_created':
            setRooms((prev) => [...prev, msg.payload]);
            break;
          case 'room_updated':
            setRooms((prev) =>
              prev.map((r) =>
                r.id === msg.payload.id ? { ...r, ...msg.payload } : r,
              ),
            );
            break;
          case 'room_deleted':
            setRooms((prev) => prev.filter((r) => r.id !== msg.payload.id));
            break;
          default:
            console.log('알 수 없는 이벤트:', msg);
        }
      } catch (err) {
        console.error('❌ WS 메시지 파싱 오류:', err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // ✅ 방 생성 성공 핸들러
  const handleCreate = (room) => {
    console.log('방 생성 성공:', room);
    setRooms((prev) => [...prev, room]);
    setOpenCreate(false);

    window.open(
      `/room/${room.id}`,
      '_blank',
      'width=670,height=820,left=100,top=100,resizable=no,scrollbars=yes',
    );
  };

  // ✅ 방 참가 핸들러
  const handleJoin = (payload) => {
    console.log('방 참가 시도:', payload, joinTargetRoom);
    setOpenJoin(false);

    fetch(`https://api.lol99.kro.kr/chat/rooms/${joinTargetRoom.id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ✅ 쿠키 포함
      body: JSON.stringify({
        riot_account_id: payload.riotTag,
        position: payload.myPositions[0],
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('참가 실패');
        return res.json();
      })
      .then((data) => {
        console.log('참가 성공:', data);
        window.open(
          `/room/${joinTargetRoom.id}`,
          '_blank',
          'width=670,height=820,left=100,top=100,resizable=no,scrollbars=yes',
        );
      })
      .catch((err) => {
        console.error('❌ 참가 API 오류:', err);
      });
  };

  // ✅ 큐 필터링
  const filteredRooms =
    selectedQueue === 'all'
      ? rooms
      : rooms.filter((room) => room.queue_type === selectedQueue);

  return (
    <div>
      {/* 큐 탭 */}
      <TabOptions
        items={items}
        value={selectedQueue}
        onChange={(key) => setSelectedQueue(key)}
      />

      {/* 필터링된 방 목록 */}
      <RoomsGridSection
        rooms={filteredRooms}
        onJoin={(roomId) => {
          const room = rooms.find((r) => r.id === roomId);
          setJoinTargetRoom(room);
          setOpenJoin(true);
        }}
      />

      {/* 플로팅 버튼 */}
      <Fab onClick={() => setOpenCreate(true)}>+</Fab>

      {/* 방 만들기 (Host) */}
      <JoinOptions
        mode="host"
        asModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        riotTags={riotTags}
        onSubmit={(action, payload) => {
          if (action === 'create') handleCreate(payload);
        }}
      />

      {/* 방 참가 (Guest) */}
      <JoinOptions
        mode="guest"
        asModal
        open={openJoin}
        onClose={() => setOpenJoin(false)}
        riotTags={riotTags}
        onSubmit={(action, payload) => {
          if (action === 'join') handleJoin(payload);
        }}
      />
    </div>
  );
}
