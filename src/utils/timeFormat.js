// 과거 매치 현시점으로 부터 시간 계산
export function timeAgoTimestamp(timestamp) {
  if (!timestamp) return '';

  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return '방금전';
  if (diffMinutes < 60) return `${diffMinutes} 분전`;
  if (diffHours < 24) return `${diffHours} 시간전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  const date = new Date(timestamp);
  return date.toLocaleDateString('ko-KR');
}

// 한 매치의 게임 순수 시간
export function formatGameDuration(seconds) {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}분 ${secs.toString().padStart(2, '0')}초`;
}

// 채팅방 개설하면 이런식으로 채팅방 카드에 띄어주면 될듯
