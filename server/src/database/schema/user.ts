import { randomUUID } from "crypto";
import mongoose, { Document, Schema, Types, model } from "mongoose";

// Interface
interface IPersonalInformation {
  firstName: string;
  lastName?: string;
  DOB?: Date;
}

export interface IUser extends Document {
  uuid: string;
  personalInformation: Map<string, IPersonalInformation>;
  createdAt: Date;
  updatedAt: Date;
  ownership: Types.ObjectId[];
}

// Schema
const userSchema = new Schema<IUser>({
  uuid: {
    type: Schema.Types.UUID,
    required: true,
    unique: true,
    default: () => randomUUID(),
  },

  personalInformation: {
    type: Map,
    of: new Schema<IPersonalInformation>({
      firstName: { type: String, required: true },
      lastName: { type: String },
      DOB: { type: Date },
    }),
  },

  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },

  ownership: {
    type: [Schema.Types.ObjectId],
    ref: "Docs",
  },
});

// Model
export const User = model<IUser>("User", userSchema);
