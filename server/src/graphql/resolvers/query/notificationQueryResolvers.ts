import { NotificationModel } from "../../../models/MNotification.js";
import { QueryResolvers } from "../../../generated/graphql.js";

const notificationQueryResolvers: QueryResolvers = {
  myNotifications: async (_, { filter }, context) => {
    if (!context.user) throw new Error("Not Authenticated");

    const query: any = { recipient: context.user._id };

    if (filter) {
      if (filter.read !== undefined && filter.read !== null) {
        query.read = filter.read;
      }
    }

    // Sort by newest first
    const notifications = await NotificationModel.find(query)
      .sort({ createdAt: -1 })
      .populate("sender")
      .populate("recipient")
      .populate("document");

    return notifications as any;
  },
};

export default notificationQueryResolvers;
