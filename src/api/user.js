import axios from 'axios';

const BASE_URL = 'http://api.lol99.kro.kr'; // 실제 API 주소로 변경

export async function addLikeAPI(fromUserId, toUserId) {
  try {
    const res = await axios.post(
      `${BASE_URL}/user/like/${fromUserId}/${toUserId}`,
    );
    return res.data;
  } catch (err) {
    console.error('❌ 좋아요 실패:', err);
    throw err;
  }
}
