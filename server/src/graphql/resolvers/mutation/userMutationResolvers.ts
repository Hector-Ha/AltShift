import { UserModel } from "../../../models/MUser.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { MutationResolvers } from "../../../generated/graphql.js";
import crypto from "crypto";
import { sendEmail } from "../../../utils/emailService.js";

import { IPersonalInformation, IUser } from "../../../interfaces/IUser.js";

const userMutationResolvers: MutationResolvers = {
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

  forgotPassword: async (_parent, { email }) => {
    const user = await UserModel.findOne({ email });
    if (!user) return true; // Security: don't reveal existence

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      title: "Reset Your Password",
      message:
        "You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click the button below to complete the process.",
      actionLink: resetUrl,
      actionText: "Reset Password",
    });

    return true;
  },

  resetPassword: async (_parent, { input }) => {
    const user = await UserModel.findOne({
      resetPasswordToken: input.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      throw new Error("Password reset token is invalid or has expired.");

    user.password = await bcrypt.hash(input.newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return true;
  },

  verifyEmail: async (_parent, { token }) => {
    // Stub
    return true;
  },

  login: async (_parent, { email, password }) => {
    const JWT_SECRET = process.env.JWT_SECRET || "";
    const authUser = await UserModel.findOne({ email });
    if (!authUser) throw Error("No User Found");

    if (authUser.deletedAt) throw Error("User account is deleted");

    const isValid = await bcrypt.compare(password, authUser?.password);
    if (!isValid) throw Error("Credetial Is Not Match");

    const token = jwt.sign({ id: authUser.id }, JWT_SECRET, {
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
