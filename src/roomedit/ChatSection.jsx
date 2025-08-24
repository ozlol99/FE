import { useEffect, useRef, useState } from 'react';
import Chat from '@/chat/Chat';
import { IconSend } from '@/icons';
import JoinOptions from '@/components/JoinOptions';

export default function ChatSection({
  title,
  roomId,
  token,
  role = 'guest', // 'host' | 'guest'
  onLeave, // RoomPage에서 처리 (리스트로 이동)
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const [messages, setMessages] = useState([
    { id: 's1', system: true, text: '방이 생성되었습니다', time: '' },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);
  const wsRef = useRef(null);

  /* --- 메시지 스크롤 유지 --- */
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  /* --- WebSocket 연결 --- */
  useEffect(() => {
    if (!roomId || !token) return;

    const ws = new WebSocket(
      `wss://api.lol99.kro.kr/chat/ws/${roomId}?token=${token}`,
    );
    wsRef.current = ws;

    ws.onopen = () => console.log('✅ WebSocket 연결 성공');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📩 받은 데이터:', data);

        if (data.type === 'chat_message') {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              mine: false,
              username: data.username, // 🔹 추가
              text: data.content, // 🔹 추가
              time: new Date(data.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }), // 🔹 timestamp → HH:MM
            },
          ]);
        }

        if (data.type === 'user_join') {
          setMessages((prev) => [
            ...prev,
            {
              id: `join-${data.user_id}`,
              system: true,
              text: `${data.username}님이 입장하였습니다.`,
              time: '',
            },
          ]);
        }

        if (data.type === 'user_leave') {
          setMessages((prev) => [
            ...prev,
            {
              id: `leave-${data.user_id}`,
              system: true,
              text: `${data.username}님이 퇴장하였습니다.`,
              time: '',
            },
          ]);
        }
      } catch (err) {
        console.error(' WS 메시지 파싱 오류:', err);
      }
    };

    ws.onclose = () => console.log('❌ WebSocket 연결 종료');

    return () => ws.close();
  }, [roomId, token]);

  /* --- 메시지 전송 --- */
  const send = () => {
    const text = input.trim();
    if (!text) return;

    // 내 메시지 UI에 추가
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        mine: true,
        text,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    setInput('');

    // 서버로 전송 (API 스펙에 맞춰 JSON)
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(
        JSON.stringify({
          type: 'chat_message',
          content: text,
        }),
      );
    }
  };

  /* --- 나가기 동작 --- */
  const handleLeave = async () => {
    try {
      if (role === 'host') {
        // ✅ 방장 → 방 삭제
        const res = await fetch(
          `http://api.lol99.kro.kr/chat/rooms/${roomId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!res.ok) throw new Error('방 삭제 실패');
        console.log('✅ 방 삭제 성공');
      } else {
        // ✅ 게스트 → 방 퇴장
        const res = await fetch(
          `http://api.lol99.kro.kr/chat/rooms/${roomId}/leave`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!res.ok) throw new Error('방 퇴장 실패');
        console.log('✅ 방 퇴장 성공');
      }
    } catch (err) {
      console.error('❌ 나가기 오류:', err);
    } finally {
      onLeave?.(); // RoomList로 이동
    }
  };

  return (
    <>
      <section className="relative flex flex-col border-r border-[#2b2b2b] w-[350px]">
        {/* 헤더 */}
        <header className="flex items-center justify-between px-4 h-12 border-b border-[#2b2b2b]">
          <h1 className="text-sm sm:text-base font-semibold text-white">
            {title}
          </h1>

          <div className="flex items-center gap-2">
            {/* 방장일 때만 설정 버튼 */}
            {role === 'host' && (
              <div className="relative flex">
                <button onClick={() => setOpenMenu((prev) => !prev)}>⚙️</button>
                {openMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-[#242424] border border-[#333] rounded shadow-lg z-10">
                    <button onClick={() => setOpenEdit(true)}>설정 열기</button>
                    <button onClick={handleLeave}>방 삭제</button>
                  </div>
                )}
              </div>
            )}

            {/* 게스트는 무조건 나가기 버튼 */}
            {role === 'guest' && <button onClick={handleLeave}>나가기</button>}
          </div>
        </header>

        {/* 메시지 리스트 */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-4 py-2 space-y-1"
        >
          {messages.map((m) => (
            <Chat key={m.id} {...m} />
          ))}
        </div>

        {/* 입력창 */}
        <footer className="border-t border-[#2b2b2b] p-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="메시지를 입력하세요…"
              className="flex-1 h-10 rounded-xl text-white bg-[#242424] border border-[#333] px-3 text-sm"
            />
            <button
              onClick={send}
              className="flex items-center h-10 px-3 rounded-xl bg-[#5d5cf5] text-white cursor-pointer"
            >
              <IconSend /> 전송
            </button>
          </div>
        </footer>
      </section>

      {/* 방 수정 모달 */}
      <JoinOptions
        mode="edit"
        asModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSubmit={(action) => {
          if (action === 'update') {
            setOpenEdit(false);
          }
        }}
      />
    </>
  );
}
