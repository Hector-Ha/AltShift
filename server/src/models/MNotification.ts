import { Schema, model, Types, HydratedDocument } from "mongoose";
import {
  INotification,
  NotificationType,
} from "../interfaces/INotification.js";

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Efficiently query my notifications
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    document: {
      type: Schema.Types.ObjectId,
      ref: "Doc",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema
);
export type NotificationDocument = HydratedDocument<INotification>;
