export function emitAck(socket, event, payload, { timeout = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('ACK timeout')), timeout);
    socket.emit(event, payload, (res) => {
      clearTimeout(timer);
      // 서버가 { ok: boolean, ... } 형태로 내려주면 처리 쉬움
      if (res?.ok) resolve(res);
      else reject(res?.error || new Error('Unknown socket error'));
    });
  });
}
