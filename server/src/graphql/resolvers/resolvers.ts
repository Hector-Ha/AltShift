import queryResolvers from "./query/queryResolvers.js";
import mutationResolvers from "./mutation/mutationResolvers.js";
import {
  Resolvers,
  UserResolvers,
  DocumentResolvers,
} from "../../generated/graphql.js";

const resolvers: Resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,

  User: {
    id: (parent) => (parent as any)._id.toString(),
  },

  Document: {
    id: (parent) => (parent as any)._id.toString(),
  },
};

export default resolvers;
