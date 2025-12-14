import queryResolvers from "./query/queryResolvers.js";
import mutationResolvers from "./mutation/mutationResolvers.js";
import notificationQueryResolvers from "./query/notificationQueryResolvers.js";
import notificationMutationResolvers from "./mutation/notificationMutationResolvers.js";
import { Resolvers } from "../../generated/graphql.js";

const resolvers: Resolvers = {
  Query: {
    ...queryResolvers,
    ...notificationQueryResolvers,
  },
  Mutation: {
    ...mutationResolvers,
    ...notificationMutationResolvers,
  },

  User: {
    id: (parent) => (parent as any)._id.toString(),
  },

  Document: {
    id: (parent) => (parent as any)._id.toString(),
    owner: async (parent: any, _, context) => {
      if (parent.owner && parent.owner.email) return parent.owner;
      return await context.UserModel.findById(parent.owner);
    },
  },

  Notification: {
    id: (parent) => (parent as any)._id.toString(),
  },
};

export default resolvers;
