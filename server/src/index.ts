import "dotenv/config";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

import cors from "cors";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServer } from "@apollo/server";
import { Server } from "socket.io";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { ioOnConnect } from "./socket/onConnect.js";
import resolvers from "./graphql/resolvers/resolvers.js";
import schema from "./graphql/schema/schema.js";
import apolloContext from "./graphql/context/apolloContext.js";

// CONFIGURATION
const appPort: string = process.env.APP_PORT || "4000";
const dbURI: string | undefined = process.env.MONGODB_URI;

// SERVER SETUP
const app = express();
const httpServer = http.createServer(app);

const apolloServer = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

// SOCKET.IO SETUP
const io: Server = new Server(httpServer, {
  cors: { origin: "*" },
  wsEngine: WebSocketServer,
});

// MONGO DB SETUP
const connectDB = async () => {
  try {
    if (dbURI) {
      await mongoose.connect(dbURI);
      console.log("MongoDB connected");
    } else {
      console.log("No DB URI found");
      process.exit(1);
    }
  } catch (e) {
    console.error("MongoDB error:", e);
    process.exit(1);
  }
};

// SERVER INIT
const startServer = async () => {
  try {
    // await connectDB();
    await apolloServer.start();

    app.use(
      "/graphql",
      cors(),
      express.json(),
      expressMiddleware(apolloServer, { context: apolloContext })
    );

    ioOnConnect(io);

    httpServer.listen(appPort, () => {
      console.log(`Server Started Succesfully\n====================`);
      console.log(`Server running on http://localhost:${appPort}`);
      console.log(`GraphQL endpoint: http://localhost:${appPort}/graphql`);
    });
  } catch (e) {
    console.error("Server error:", e);
    process.exit(1);
  }
};

startServer();
