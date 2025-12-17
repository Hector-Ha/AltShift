import { Schema, model, Types, HydratedDocument } from "mongoose";
import {
  IUser,
  IPersonalInformation,
  IAuthPayload,
} from "../interfaces/IUser.js";

const personalInfoSchema = new Schema<IPersonalInformation>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    DOB: { type: Date },
    profilePicture: { type: String }, // URL
  },
  { _id: false } // prevent nested _id
);

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    personalInformation: personalInfoSchema,

    ownership: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doc",
      },
    ],
    isCollaborating: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doc",
      },
    ],
    isFavorite: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doc",
      },
    ],

    deletedAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

const authPayloadSchema = new Schema<IAuthPayload>({
  user: { type: userSchema, required: true },
  token: { type: String, required: true },
});

export const UserModel = model<IUser>("User", userSchema);
export type UserDocument = HydratedDocument<IUser>;
