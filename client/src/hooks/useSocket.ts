import { useEffect } from "react";
import type { Socket } from "socket.io-client";

export const useSocket = (socket: Socket) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log(`Socket connect on:`, socket.id);
    });

    socket.on("disconnect", () => {
      console.log(`Disconnect from:`, socket.id);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
};
