import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatSection from '@/roomedit/ChatSection';
import RightPanel from '@/chat/RightPanel';
import { addLikeAPI } from '@/api/user';

export default function RoomPage() {
  const { room_id } = useParams(); // URL에서 방 ID 가져오기
  const [title, setTitle] = useState('');
  const [members, setMembers] = useState([]);
  const [ownerId, setOwnerId] = useState(null); // 방장 ID
  const [myUserId, setMyUserId] = useState(null); // 현재 로그인한 유저 ID

  // 방 정보 불러오기
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(
          `http://api.lol99.kro.kr/chat/rooms/${room_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        );
        if (!res.ok) throw new Error('방 정보를 불러오지 못했습니다.');
        const data = await res.json();
        console.log('방 정보:', data);

        setTitle(data.name); // 방 제목
        setOwnerId(data.owner_id); // 방장 ID 저장

        // 참여자 세팅
        setMembers(
          data.participants.map((p) => ({
            id: p.user_id,
            name: `${p.riot_account?.game_name}#${p.riot_account?.tag_line}`,
            lp: p.league_points,
            wins: p.wins,
            losses: p.losses,
            rate:
              p.wins + p.losses > 0
                ? Math.round((p.wins / (p.wins + p.losses)) * 100)
                : 0,
            likes: p.likes_received,
            profile: p.tier_icon_url || 'P',
          })),
        );
      } catch (err) {
        console.error('Room API 오류:', err);
      }
    };

    if (room_id) fetchRoom();

    // 🔹 로그인 유저 ID (임시: 로컬스토리지에서 가져오기)
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setMyUserId(Number(storedUserId));
    }
  }, [room_id]);

  // 강퇴 (방장 전용)
  const removeMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // 좋아요
  const addLike = async (toUserId) => {
    try {
      if (!myUserId) throw new Error('로그인 유저 ID가 없습니다.');
      await addLikeAPI(Number(myUserId), Number(toUserId));
      setMembers((prev) =>
        prev.map((m) =>
          m.id === toUserId ? { ...m, likes: (m.likes ?? 0) + 1 } : m,
        ),
      );
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
    }
  };

  // 내가 방장인지 체크
  const isHost = myUserId === ownerId;

  return (
    <div className="h-screen w-screen flex">
      {/* 채팅 영역 */}
      <ChatSection
        title={title}
        roomId={room_id}
        token={localStorage.getItem('accessToken')}
        role={isHost ? 'host' : 'guest'}
      />

      {/* 오른쪽 패널 */}
      <RightPanel
        members={members}
        onRemove={isHost ? removeMember : undefined} // 방장만 강퇴 가능
        onAddLike={addLike}
      />
    </div>
  );
}
