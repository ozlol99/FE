const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtaWthbjMxQG5hdmVyLmNvbSIsImV4cCI6MTc1NTc3OTU5OH0.aUhTG-JBel1ZVnqkRMcfZfbfdhPSQvo55_EAIqON0UA';
const roomId = 1; // 실제로 DB에 존재하는 방 id 값

export const ws = new WebSocket(
  `wss://api.lol99.kro.kr/chat/ws/${roomId}?token=${token}`,
);

ws.onopen = () => console.log('✅ WebSocket 연결 성공');
ws.onerror = (err) => console.error('❌ WebSocket 에러:', err);
ws.onclose = () => console.warn('⚠️ WebSocket 연결 종료됨');
ws.onmessage = (event) => console.log('📩 메시지:', event.data);

// 안전하게 메시지 보내는 함수
export function safeSend(data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  } else {
    ws.addEventListener('open', () => ws.send(JSON.stringify(data)), {
      once: true,
    });
  }
}
