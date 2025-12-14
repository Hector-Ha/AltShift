import { NotificationModel } from "../../../models/MNotification.js";
import { MutationResolvers } from "../../../generated/graphql.js";

const notificationMutationResolvers: MutationResolvers = {
  markNotificationAsRead: async (_, { notificationId }, context) => {
    if (!context.user) throw new Error("Not Authenticated");

    const notification = await NotificationModel.findById(notificationId);
    if (!notification) throw new Error("Notification not found");

    // Security Check: Only recipient can mark as read
    if (notification.recipient.toString() !== context.user._id.toString()) {
      throw new Error("Not Authorized");
    }

    notification.read = true;
    await notification.save();

    // Explicitly populate for return
    await notification.populate(["sender", "recipient", "document"]);

    return notification as any;
  },

  markAllNotificationsAsRead: async (_, __, context) => {
    if (!context.user) throw new Error("Not Authenticated");

    await NotificationModel.updateMany(
      { recipient: context.user._id, read: false },
      { $set: { read: true } }
    );

    return true;
  },
};

export default notificationMutationResolvers;
