import { useEffect, useRef, useState } from 'react';
import Chat from '@/chat/Chat';
import { IconSettings, IconSend, IconEdit, IconCheck, IconX } from '@/icons';

export default function ChatSection({ title, setTitle, roomId, token }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const titleInputRef = useRef(null);

  /* --- 채팅 메시지 --- */
  const [messages, setMessages] = useState([
    { id: 's1', system: true, text: '방이 생성되었습니다', time: '' },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);
  const wsRef = useRef(null); // 웹소켓 ref

  /* --- 제목 편집 --- */
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const saveTitle = () => {
    const next = tempTitle.trim().slice(0, 30);
    if (!next) {
      setTempTitle(title);
      setIsEditingTitle(false);
      return;
    }
    setTitle(next);
    setIsEditingTitle(false);
  };

  const cancelEdit = () => {
    setTempTitle(title);
    setIsEditingTitle(false);
  };

  const onTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTitle();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

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

    ws.onopen = () => {
      console.log('✅ WebSocket 연결 성공');
    };

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

    ws.onclose = () => {
      console.log('❌ WebSocket 연결 종료');
    };

    return () => {
      ws.close();
    };
  }, [roomId, token]);

  /* --- 메시지 전송 --- */
  const send = () => {
    const text = input.trim();
    if (!text || !wsRef.current) return;

    // 서버에 전송
    wsRef.current.send(text);

    // 내 메시지는 바로 추가
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
  };

  return (
    <section className="relative flex flex-col border-r border-[#2b2b2b]">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 h-12 border-b border-[#2b2b2b]">
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            // 제목 수정 폼
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveTitle();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={titleInputRef}
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={onTitleKeyDown}
                onBlur={saveTitle}
                maxLength={30}
                className="h-8 rounded-md bg-[#242424] border border-[#333] px-2 text-sm placeholder:text-[#fff]"
                placeholder="방 제목을 입력하세요"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-2 h-8 text-xs text-white"
              >
                <IconCheck /> 저장
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center gap-1 px-2 h-8 text-xs text-white"
              >
                <IconX /> 취소
              </button>
            </form>
          ) : (
            <>
              <h1 className="text-sm sm:text-base font-semibold text-white">
                {title}
              </h1>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="ml-1 inline-flex items-center gap-1 px-2 h-8 text-xs text-white"
              >
                <IconEdit />
              </button>
            </>
          )}
        </div>
        <button className="text-[#9a9a9a] hover:text-white" title="설정">
          <IconSettings />
        </button>
      </header>

      {/* 메시지 리스트 */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
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
            onKeyDown={(e) => (e.key === 'Enter' ? send() : null)}
            placeholder="메시지를 입력하세요…"
            className="flex-1 h-10 rounded-xl text-white bg-[#242424] border border-[#333] px-3 text-sm"
          />
          <button
            onClick={send}
            className="flex items-center h-10 px-3 rounded-xl bg-[#5d5cf5] text-white"
          >
            <IconSend /> 전송
          </button>
        </div>
      </footer>
    </section>
  );
}
