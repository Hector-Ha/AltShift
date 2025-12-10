import { UserModel } from "../../../models/MUser.js";
import { QueryResolvers } from "../../../generated/graphql.js";

const userQueryResolvers: QueryResolvers = {
  getUserByID: async (_, { id }, context) => {
    // Simple access
    const user = await UserModel.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  },

  getAllUsers: async (_, __, context) => {
    // Admin only in real app?
    // Or used for searching collaborators
    return await UserModel.find({});
  },

  // getMe: async (_, __, context) => {
  //   if (!context.user) return null;
  //   return await UserModel.findById(context.user._id) as any;
  // }
};

export default userQueryResolvers;
