import { io, Socket } from "socket.io-client";

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log(`Client is on Socket: ${socket.id}`);
});
