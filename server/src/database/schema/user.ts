import { Document, Schema, Types, model } from "mongoose";

// Interface
interface IPersonalInformation {
  firstName: string;
  lastName?: string;
  DOB?: Date;
}

export interface IUser extends Document {
  uuid: Types.UUID;

  email: string;
  password: string;

  personalInformation?: IPersonalInformation;

  ownership: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Schema
const userSchema = new Schema<IUser>({
  uuid: {
    type: Schema.Types.UUID,
    required: true,
    unique: true,
    default: () => new Types.UUID(),
  },

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
  personalInformation: {
    firstName: { type: String, required: true },
    lastName: { type: String },
    DOB: { type: Date },
  },
  ownership: [
    {
      type: Schema.Types.ObjectId,
      ref: "Doc",
    },
  ],
  deletedAt: {
    type: Date,
  },
});

// Model
export const User = model<IUser>("User", userSchema);
