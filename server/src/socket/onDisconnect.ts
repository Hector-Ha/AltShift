import { Socket, Server } from "socket.io";
import { SOCKET_EVENTS } from "./events.js";

export const onDisconnect = (socket: Socket, io: Server) => {
  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log(`Socket disconnected: ${socket.id}`);
    // Additional cleanup logic can go here (e.g., removing user from presence list)
  });
};
