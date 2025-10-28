import { io } from "socket.io-client";
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  auth: { user_id: localStorage.getItem("id") },
});
// const socket = io("https://buddy-hub-backend-vaoj.onrender.com", {
//   transports: ["websocket"],
//   auth: { user_id: localStorage.getItem("id") },
// });

export default socket;
