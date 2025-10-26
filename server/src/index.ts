import "dotenv/config";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

import { Server } from "socket.io";
import mongoose from "mongoose";

import { ioOnConnect } from "./handler/socket/onConnect.js";

const app = express();
const httpServer = http.createServer(app);

//PORT
const appPort: string = process.env.APP_PORT || "4000";
const dbURI: string | undefined = process.env.MONGODB_URI;

// IO
const io: Server = new Server(httpServer, {
  cors: { origin: "*" },
  wsEngine: WebSocketServer, //connect io.wsEngine to ws.WebSocketServer for improve performance
});

// MongoDB
const connectDB = async () => {
  try {
    if (dbURI) {
      await mongoose.connect(dbURI);
      console.log("MongoDB connected successfully");
    } else {
      console.log("No DB URI was found");
      process.exit(1);
    }
  } catch (e) {
    console.error("MongoDB connection error:", e);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(appPort, () => {
      console.log(`App Init Successfully | App Is On Port ${appPort}`);
    });
  } catch (e) {
    console.error("Server startup error:", e);
    process.exit(1);
  }
};

ioOnConnect(io);
startServer();
