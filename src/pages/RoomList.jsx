import { useState } from 'react';
import Fab from '@/components/Fab';
import RoomsGridSection from '@/components/RoomsGridSection';
import TabOptions from '@/components/TabOptions';

const DEFAULT_QUEUES = [
  { key: 'all', label: '전체' },
  { key: 'solo', label: '솔로랭크' },
  { key: 'flex', label: '자유랭크' },
  { key: 'aram', label: '칼바람 나락' },
];

export default function RoomList({
  selectedQueue,
  onChangeQueue,
  onCreateRoom,
  queues,
}) {
  const items = queues?.length ? queues : DEFAULT_QUEUES;

  // - selectedQueue prop이 없을 때만 내부 상태로 탭을 관리
  // - 초기값은 items[0]의 key 또는 'all'
  const [internal, setInternal] = useState(items[0]?.key ?? 'all');

  // 현재 활성 탭 값(active)
  // - selectedQueue가 주어지면(컨트롤드) 그 값을 우선 사용
  // - 아니면 내부 상태(internal)를 사용
  const active = selectedQueue ?? internal;

  const setActive = (key) =>
    onChangeQueue ? onChangeQueue(key) : setInternal(key);

  // 배열에서 랜덤값 하나 뽑기(더미 데이터용)
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // 더미 방
  const [rooms] = useState(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id: String(i + 1), // 방 고유 ID
      title: i % 2 ? '같이 하실분' : '원딜/서폿 구해요', // 방 제목
      queue: pick(['solo', 'flex', 'aram']), // 큐 타입(솔로/자유/칼바람)
      members: 1 + (i % 4), // 현재 인원(1~4)
      capacity: 5, // 최대 인원
      tags: ['실버', '골드', '사람']
        .sort(() => 0.5 - Math.random())
        .slice(0, 3), // 해시태그 3개
      discord: pick(['green', 'yellow']), // 디스코드 상태(더미)
      mic: pick(['on', 'off', 'no']), // 마이크 상태(더미)
      createdAt: Date.now() - pick([5, 12, 30, 45, 90, 180]) * 60 * 1000, // 생성 시간(몇 분 전)
      host: i % 2 ? '닉네임' : 'CaptainLee', // 방장 닉네임
    })),
  );
  const visibleRooms =
    active === 'all' ? rooms : rooms.filter((r) => r.queue === active);

  return (
    <div className="min-h-dvh bg-[#0f1115] text-[#eaeaea]">
      <TabOptions items={items} value={active} onChange={setActive} />

      {/* 방 리스트 그리드 */}
      <RoomsGridSection
        rooms={visibleRooms}
        onClick={(id) => console.log('open room', id)}
        onJoin={(id) => console.log('join room', id)}
        // gridCols="sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5"  // 필요시 변경
      />

      {/* 플로팅 + 버튼 */}
      <Fab onClick={onCreateRoom} ariaLabel="방 만들기" />
    </div>
  );
}
