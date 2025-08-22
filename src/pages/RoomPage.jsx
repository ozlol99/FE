import { useState } from 'react';
import ChatSection from '@/roomedit/ChatSection';
import RightPanel from '@/chat/RightPanel';
import { addLikeAPI } from '@/api/user';

export default function RoomPage() {
  const removeMember = (id) =>
    setMembers((prev) => prev.filter((m) => m.id !== id));

  const addLike = async (toUserId) => {
    try {
      const fromUserId = 999; // 실제 로그인 유저 ID
      await addLikeAPI(Number(fromUserId), Number(toUserId)); // 👈 double check
      setMembers((prev) =>
        prev.map((m) =>
          m.id === toUserId ? { ...m, likes: (m.likes ?? 0) + 1 } : m,
        ),
      );
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
    }
  };

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
      profile: 'P',
    },
    {
      id: 2,
      name: '동글#123',
      lp: 30,
      wins: 603,
      losses: 608,
      rate: 50,
      likes: 0,
      profile: 'P',
    },
    {
      id: 3,
      name: '동글#123',
      lp: 22,
      wins: 603,
      losses: 608,
      rate: 50,
      likes: 0,
      profile: 'P',
    },
    {
      id: 4,
      name: '동글#123',
      lp: 10,
      wins: 603,
      losses: 608,
      rate: 50,
      likes: 0,
      profile: 'P',
    },
  ]);

  return (
    <div className="h-screen w-screen flex">
      <ChatSection title={title} setTitle={setTitle} />
      <RightPanel
        members={members}
        onRemove={removeMember}
        onAddLike={addLike} // ✅ API + state 업데이트 연결됨
      />
    </div>
  );
}
