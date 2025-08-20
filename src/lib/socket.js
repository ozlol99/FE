import { io } from 'socket.io-client';

// 서버 WS 주소: env로 관리 권장
const WS_URL = import.meta.env.VITE_WS_URL;

export const socket = io(WS_URL, {
  autoConnect: false,
  transports: ['websocket'], // 폴백 불필요하면 유지
});

export function connectSocket(token) {
  // 백엔드에서 토큰으로 인증한다면 이렇게 auth에 실어 보내기
  socket.auth = { token };
  if (!socket.connected) socket.connect();
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}
