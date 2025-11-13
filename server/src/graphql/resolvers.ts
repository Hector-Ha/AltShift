import { IUser, User } from "../database/schema/user.js";

export const resolvers = {
  Query: {
    hello: () => "Hello World",

    //TODO: Implement actually Doc Query
    doc: () => "return doc",

    //TODO: Implement actually User Query
    user: () => "return user",
  },

  Mutation: {
    createUser: async (parent: unknown, args: unknown): Promise<IUser> => {
      const newUser = new User({
        ...args,
      });

      await newUser.save();
      return newUser;
    },
  },
};
