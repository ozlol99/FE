export async function joinRoomAndConnect(roomId, riotAccountId, position) {
  const token = localStorage.getItem(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtaWthbjMxQG5hdmVyLmNvbSIsImV4cCI6MTc1NTc4NzQ1NH0.f5uay6u-lvLzmoQnSd9u7MRrGzzWbI4zyJ5fzidhlSY',
  ); // 로그인 때 저장해둔 JWT

  try {
    // 1. REST API로 방 참가
    const res = await fetch(
      `http://api.lol99.kro.kr/chat/rooms/${roomId}/join`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ 여기서는 Bearer 헤더
        },
        body: JSON.stringify({
          riot_account_id: riotAccountId,
          position: position,
        }),
      },
    );

    if (!res.ok) {
      throw new Error('방 참가 실패');
    }

    const roomData = await res.json();
    console.log('✅ 방 참가 성공:', roomData);

    // 2. 참가 성공 → WebSocket 연결
    const ws = new WebSocket(
      `wss://api.lol99.kro.kr/chat/ws/${roomId}?token=${token}`, // ✅ 여기서는 쿼리파라미터
    );

    ws.onopen = () => {
      console.log('✅ WebSocket 연결 성공');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📩 서버 메시지:', data);
    };

    ws.onclose = (e) => {
      console.warn('⚠️ WebSocket 연결 종료', e.code, e.reason);
    };

    ws.onerror = (err) => {
      console.error('❌ WebSocket 에러:', err);
    };

    return ws; // 필요하면 컴포넌트에서 이 ws 객체 사용 가능
  } catch (err) {
    console.error(err);
  }
}
