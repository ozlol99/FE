import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
});

// 방 목록 조회
export async function getChatRooms() {
  const res = await API.get('/chat/rooms');
  return res.data;
}

// 방 생성
export async function createChatRoom(data) {
  const res = await API.post('/chat/rooms', data);
  return res.data;
}

// 방 참가
export async function joinChatRoom(roomId, data) {
  const res = await API.post(`/chat/rooms/${roomId}/join`, data);
  return res.data;
}

// 방 상세 조회
export async function getChatRoom(roomId) {
  const res = await API.get(`/chat/rooms/${roomId}`);
  return res.data;
}

// 방 수정
export async function updateChatRoom(roomId, data) {
  const res = await API.put(`/chat/rooms/${roomId}`, data);
  return res.data;
}

// 방 나가기
export async function leaveChatRoom(roomId) {
  const res = await API.post(`/chat/rooms/${roomId}/leave`);
  return res.data;
}

// 방 삭제
export async function deleteChatRoom(roomId) {
  const res = await API.delete(`/chat/rooms/${roomId}`);
  return res.status === 204;
}
