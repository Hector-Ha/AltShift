import { Types } from "mongoose";

export interface IDocument {
  _id?: Types.ObjectId;

  title: string;
  content: string;
  isPublic: boolean;
  visibility: "PUBLIC" | "SHARED" | "PRIVATE";
  invitations: Types.ObjectId[];
  versions: {
    _id?: Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];

  owner: Types.ObjectId;
  collaborators: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
