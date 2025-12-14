import { io, Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "./interfaces";

const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  {
    autoConnect: false,
    auth: (cb) => {
      const token = localStorage.getItem("token");
      cb({ token });
    },
  }
);
