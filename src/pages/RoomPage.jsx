import { useState } from 'react';
import ChatSection from '@/roomedit/ChatSection';
import RightPanel from '@/chat/RightPanel';

export default function RoomPage() {
  const removeMember = (id) =>
    setMembers((prev) => prev.filter((m) => m.id !== id));

  const addLike = (id) =>
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          console.log('before:', m.likes);
          return { ...m, likes: (m.likes ?? 0) + 1 };
        }
        return m;
      }),
    );

  const [title, setTitle] = useState('아무나 들어오세요');
  const [members, setMembers] = useState([
    {
      id: 1,
      name: '동글#123',
      lp: 40,
      wins: 603,
      losses: 608,
      rate: 50,
      likes: 0,
      initial: 'P',
    },
    {
      id: 2,
      name: '동글#123',
      lp: 30,
      wins: 603,
      losses: 608,
      rate: 50,
      likes: 0,
      initial: 'P',
    },
    {
      id: 3,
      name: '동글#123',
      lp: 22,
      wins: 603,
      losses: 608,
      rate: 50,
      likes: 0,
      initial: 'P',
    },
    {
      id: 4,
      name: '동글#123',
      lp: 10,
      wins: 603,
      losses: 608,
      rate: 50,
      likes: 0,
      initial: 'P',
    },
  ]);

  return (
    <div className="h-screen w-screen grid grid-cols-[minmax(0,1fr)_570px]">
      <ChatSection title={title} setTitle={setTitle} />
      <RightPanel
        members={members}
        onRemove={removeMember}
        onAddLike={addLike}
      />
    </div>
  );
}
