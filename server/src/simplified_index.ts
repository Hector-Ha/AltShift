import "dotenv/config";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServer } from "@apollo/server";
import cors from "cors";

import resolvers from "./graphql/resolvers/resolvers.js";
import schema from "./graphql/schema/schema.js";
import apolloContext from "./graphql/context/apolloContext.js";

const app = express();
const appPort = process.env.APP_PORT || "4000";

const apolloServer = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const startServer = async () => {
  await apolloServer.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(apolloServer, { context: apolloContext })
  );

  app.listen(appPort, () => {
    console.log(`GraphQL endpoint: http://localhost:${appPort}/graphql`);
  });
};

startServer();
