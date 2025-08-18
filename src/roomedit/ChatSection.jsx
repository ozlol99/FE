import { useEffect, useRef, useState } from 'react';
import Chat from '@/chat/Chat';
import { IconSettings, IconSend, IconEdit, IconCheck, IconX } from '@/icons'; // 아이콘 따로 빼면 더 깔끔해짐

export default function ChatSection({ title, setTitle }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const titleInputRef = useRef(null);

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

  /* --- 채팅 메시지 --- */
  const [messages, setMessages] = useState([
    { id: 's1', system: true, text: '방이 생성되었습니다', time: '' },
    { id: 1, mine: false, text: '같이 하실 분 구해요!', time: '10:25' },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

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
