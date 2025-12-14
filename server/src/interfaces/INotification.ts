import { Types, Document as MongooseDocument } from "mongoose";
import { IUser } from "./IUser.js";
import { IDocument } from "./IDocument.js";

export enum NotificationType {
  DOCUMENT_INVITE = "DOCUMENT_INVITE",
  DOCUMENT_UPDATE = "DOCUMENT_UPDATE",
  DOCUMENT_DELETE = "DOCUMENT_DELETE",
  OWNERSHIP_TRANSFER = "OWNERSHIP_TRANSFER",
}

export interface INotification {
  _id: Types.ObjectId;
  recipient: Types.ObjectId | IUser; // User who receives the notification
  sender: Types.ObjectId | IUser; // User who caused the notification
  type: NotificationType;
  document: Types.ObjectId | IDocument; // Related document
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
