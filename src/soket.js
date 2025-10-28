import { io } from "socket.io-client";
// const socket = io("http://localhost:5000", {
//   transports: ["websocket"],
//   auth: { user_id: localStorage.getItem("id") },
// });
const socket = io(
  "https://buddy-hub-backend-85sk7kc4d-pritam-mandals-projects-73e03c4f.vercel.app",
  {
    transports: ["websocket"],
    auth: { user_id: localStorage.getItem("id") },
  }
);

export default socket;
