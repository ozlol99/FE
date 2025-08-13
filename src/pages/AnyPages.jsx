// import { useNavigate, useParams } from "react-router-dom";
// import { useSocket } from "@/context/SocketProvider";
// import JoinOptions from "@/roomedit/JoinOptions";
// import { createRoom, joinRoom } from "@/api/roomSocketApi";

// export default function AnyPage() {
//   const socket = useSocket();
//   const navigate = useNavigate();
//   const { roomId } = useParams(); // 참가 버튼 눌러서 들어온 경우

//   // 방 만들기 (호스트)
//   const handleHostSubmit = async (payload) => {
//     try {
//       const res = await createRoom(socket, payload);
//       navigate(`/rooms/${res.roomId}`);
//     } catch (err) {
//       alert(err?.message || "방 만들기 실패");
//     }
//   };

//   // 참가 (게스트)
//   const handleGuestSubmit = async (payload) => {
//     try {
//       const res = await joinRoom(socket, {
//         roomId,
//         riotTag: payload.riotTag,
//         myPositions: payload.myPositions
//       });
//       navigate(`/rooms/${roomId}`);
//     } catch (err) {
//       alert(err?.message || "참가 실패");
//     }
//   };

//   return null;
// }
