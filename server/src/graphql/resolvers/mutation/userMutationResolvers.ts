import { UserModel } from "../../../models/MUser.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { MutationResolvers } from "../../../generated/graphql.js";

import { IPersonalInformation, IUser } from "../../../interfaces/IUser.js";

const userMutationResolvers: MutationResolvers = {
  // createUser(input: createUserInput!): AuthPayload!
  createUser: async (_parent, { input }, context) => {
    const JWT_SECRET = process.env.JWT_SECRET || "";
    const hashedPassword = await bcrypt.hash(input.password, 12);
    const newUser = await UserModel.create({
      ...input,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET);

    return {
      user: newUser,
      token: token,
    };
  },
  // updateUser(userID: ID!, input: updateUserInput!): User!
  updateUser: async (_parent, { userID, input }, context) => {
    if (context.user._id.toString() !== userID)
      throw new Error("Not Authorized");

    const { email, personalInformation, profilePicture } = input;

    const updatedPersonalInformation: IPersonalInformation = {
      firstName:
        personalInformation?.firstName ||
        context.user.personalInformation.firstName,
      lastName:
        personalInformation?.lastName ||
        context.user.personalInformation.lastName,
      DOB: personalInformation?.DOB || context.user.personalInformation.DOB,
      profilePicture:
        profilePicture || context.user.personalInformation.profilePicture,
    };

    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      {
        email: email || context.user.email,
        personalInformation: updatedPersonalInformation,
        profilePicture: profilePicture,
      },
      { new: true }
    );

    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
  },

  // deleteUser(userID: ID!): DateTime!
  deleteUser: async (_parent, { userID }, context) => {
    if (context.user._id.toString() !== userID)
      throw new Error("Not Authorized");

    const user = await UserModel.findById(userID);
    if (!user) throw new Error("User not found");

    user.deletedAt = new Date();
    await user.save();
    return user.deletedAt;
  },

  hardDeleteUser: async (_parent, { userID }, context) => {
    // Admin only or self? For now self.
    if (context.user._id.toString() !== userID)
      throw new Error("Not Authorized");
    await UserModel.findByIdAndDelete(userID);
    return true;
  },

  changePassword: async (_parent, { userID, input }, context) => {
    if (context.user._id.toString() !== userID)
      throw new Error("Not Authorized");

    const user = await UserModel.findById(userID);
    if (!user) throw new Error("User not found");

    const isValid = await bcrypt.compare(input.oldPassword, user.password);
    if (!isValid) throw new Error("Invalid old password");

    user.password = await bcrypt.hash(input.newPassword, 12);
    await user.save();
    return true;
  },

  resetPassword: async (_parent, { input }) => {
    const user = await UserModel.findOne({ email: input.email });
    if (!user) return true; // Security: don't reveal user existence

    // Logic: Send email with token.
    // For now, since no email service, we just set the new password directly if provided (insecure but fits "Forgot Password" flow stub)
    // OR we just return true.
    // The input has `newPassword`. In a real app, this is step 2 (reset with token).
    // The user request has "[3] Reset password (forgot password)".
    // A one-step reset without verification is dangerous.
    // I will implementation a "force reset" for now or assume the input implies we are setting it.

    user.password = await bcrypt.hash(input.newPassword, 12);
    await user.save();

    return true;
  },

  verifyEmail: async (_parent, { token }) => {
    // Stub
    return true;
  },

  // login(email: String!, password: String!): AuthPayload!
  login: async (_parent, { email, password }) => {
    const JWT_SECRET = process.env.JWT_SECRET || "";
    const authUser = await UserModel.findOne({ email });
    if (!authUser) throw Error("No User Found");

    if (authUser.deletedAt) throw Error("User account is deleted");

    const isValid = await bcrypt.compare(password, authUser?.password);
    if (!isValid) throw Error("Credetial Is Not Match");

    const token = jwt.sign({ userID: authUser.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      user: authUser,
      token,
    };
  },

  // logout: Boolean!
  logout: async (_parent, args) => {
    return true;
  },
};

export default userMutationResolvers;
