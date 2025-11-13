import { Socket, Server } from "socket.io";

export const ioOnConnect = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("IOSocket established");
    console.log(`IO Socket ID: ${socket.id} `);
    socket.join("Test Room");
    const socketsInRoom = io.sockets.adapter.rooms.get("Test Room");
    console.log(
      "Socket IDs in 'Test Room':",
      socketsInRoom ? Array.from(socketsInRoom) : []
    );
    socket.emit("room-joined", {
      data: socketsInRoom,
    });
  });
};
