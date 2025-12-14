import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/MUser.js";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./interfaces.js";

// Define the Typed Socket
type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export const authMiddleware = async (
  socket: TypedSocket,
  next: (err?: Error) => void
) => {
  const token =
    socket.handshake.auth.token || socket.handshake.headers["authorization"];

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const tokenString = token.replace("Bearer ", "");
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");

    const decoded: any = jwt.verify(tokenString, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id || decoded.userID).select(
      "-password"
    );

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    socket.data.user = user;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
};
