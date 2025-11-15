import { UserModel } from "../../../models/MUser.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { MutationResolvers } from "../../../generated/graphql.js";

const userMutationResolvers: MutationResolvers = {
  // createUser(input: createUserInput!): AuthPayload!
  createUser: async (_parent, { input }, context) => {
    const hashedPassword = await bcrypt.hash(input.password, 13);
    const newUser = await UserModel.create({
      ...input,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!);

    return {
      user: newUser as any,
      token: token,
    };
  },
  // updateUser(userID: ID!, input: updateUserInput!): User!
  // deleteUser(userID: ID!): DateTime!

  // login(email: String!, password: String!): AuthToken!
  // logout: Boolean!
};

export default userMutationResolvers;
