import { emitAck } from '@/lib/emitAck';

// 방 만들기 (호스트 전용)
export function createRoom(socket, payload) {
  // payload: { title, queue, myPositions, lookingFor, capacity, options:{discord,mic,listenOnly}, riotTag }
  return emitAck(socket, 'room:create', payload);
}

// 방 참가 (게스트 전용)
export function joinRoom(socket, { roomId, riotTag, myPositions }) {
  return emitAck(socket, 'room:join', { roomId, riotTag, myPositions });
}

// 방 옵션 수정 (호스트 전용)
export function updateOptions(
  socket,
  { roomId, queue, capacity, options, lookingFor },
) {
  return emitAck(socket, 'room:update_options', {
    roomId,
    queue,
    capacity,
    options,
    lookingFor,
  });
}

// 내 상태 수정 (게스트: 내 포지션/계정)
export function updateMe(socket, { roomId, riotTag, myPositions }) {
  return emitAck(socket, 'room:update_me', { roomId, riotTag, myPositions });
}

// 실시간 상태 구독 (컴포넌트에서 호출)
export function subscribeRoom(socket, { onState, onError, onKicked } = {}) {
  const off = [];

  if (onState) {
    const fn = (data) => onState(data); // { room, role, members, ... }
    socket.on('room:state', fn);
    off.push(() => socket.off('room:state', fn));
  }

  if (onError) {
    const fn = (err) => onError(err);
    socket.on('room:error', fn);
    off.push(() => socket.off('room:error', fn));
  }

  if (onKicked) {
    const fn = (data) => onKicked(data);
    socket.on('room:kicked', fn);
    off.push(() => socket.off('room:kicked', fn));
  }

  return () => off.forEach((f) => f());
}
