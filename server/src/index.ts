import "dotenv/config";
import express from "express";
import http from "http";
import ws, { WebSocketServer } from "ws";

import { Server, Socket } from "socket.io";

const app = express();
const httpServer = http.createServer(app);

//PORT
const appPort: string = process.env.APP_PORT || "4000";

const io: Server = new Server(httpServer, {
  cors: { origin: "*" },
  wsEngine: WebSocketServer, //connect io.wsEngine to ws.WebSocketServer for improve performance
});

io.on("connection", (socket: Socket) => {
  console.log("IOSocket established");
  console.log(`IO Socket ID: ${socket.id}`);
});

try {
  httpServer.listen(appPort, () => {
    console.log(`App Init Successfully | App Is On ${appPort}`);
  });
} catch (e) {
  console.log(e);
}
