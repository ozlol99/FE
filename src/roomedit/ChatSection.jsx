import { useEffect, useRef, useState } from 'react';
import Chat from '@/chat/Chat';
import { IconSettings, IconSend } from '@/icons';
import JoinOptions from '@/components/JoinOptions';

export default function ChatSection({
  title,
  roomId,
  token,
  role = 'guest',
  onLeave,
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openMenu, setOpenMenu] = useState(false); // ⚙️ 설정 메뉴 열림 여부

  /* --- 채팅 메시지 --- */
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
      `ws://localhost:3001/chat/ws/${roomId}?token=${token}`,
    );

    wsRef.current = ws;

    ws.onopen = () => console.log('✅ WebSocket 연결 성공');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📩 받은 데이터:', data);

      if (data.type === 'chat_message') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            mine: false,
            text: data.content,
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
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
    };

    ws.onclose = () => console.log('❌ WebSocket 연결 종료');

    return () => ws.close();
  }, [roomId, token]);

  /* --- 메시지 전송 --- */
  const send = () => {
    const text = input.trim();
    if (!text) return;

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

    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(text);
    }
  };

  return (
    <>
      <section className="relative flex flex-col border-r border-[#2b2b2b] w-[350px]">
        {/* 헤더 */}
        <header className="flex items-center justify-between px-4 h-12 border-b border-[#2b2b2b]">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-semibold text-white">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* 설정 버튼 */}
            <div className="relative flex">
              <button
                className="text-[#9a9a9a] hover:text-white cursor-pointer"
                title="설정"
                onClick={() => setOpenMenu((prev) => !prev)}
              >
                <IconSettings />
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-[#242424] border border-[#333] rounded shadow-lg z-10">
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-[#333] cursor-pointer"
                    onClick={() => {
                      setOpenEdit(true);
                      setOpenMenu(false);
                    }}
                  >
                    설정 열기
                  </button>
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-[#333] cursor-pointer"
                    onClick={() => {
                      onLeave?.();
                      setOpenMenu(false);
                    }}
                  >
                    방 나가기
                  </button>
                </div>
              )}
            </div>

            {/* 게스트일 때만 헤더에 "나가기" 버튼 */}
            {role === 'guest' && (
              <button
                onClick={onLeave}
                className="px-3 py-1.5 text-xs rounded-md border border-[#3a3a3a] 
                          bg-[#1e1e1e] text-red-400 hover:bg-[#2b2b2b] 
                          transition-colors cursor-pointer"
              >
                나가기
              </button>
            )}
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
