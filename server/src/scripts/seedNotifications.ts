import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserModel } from "../models/MUser.js";
import { DocumentModel } from "../models/MDocument.js";
import { NotificationModel } from "../models/MNotification.js";
import { NotificationType } from "../interfaces/INotification.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI must be set");
  process.exit(1);
}

async function seedNotifications() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB");

  try {
    // 1. Find or Create Recipient (user1@gmail.com)
    let recipient = await UserModel.findOne({ email: "user1@gmail.com" });
    if (!recipient) {
      console.log("user1@gmail.com not found, creating dummy user...");
      recipient = await UserModel.create({
        email: "user1@gmail.com",
        password: "password123",
        personalInformation: { firstName: "Test", lastName: "User" },
      });
    }
    console.log("Recipient found:", recipient.email);

    // 2. Find or Create Check Senders
    let sender1 = await UserModel.findOne({ email: "alice@gmail.com" });
    if (!sender1) {
      sender1 = await UserModel.create({
        email: "alice@gmail.com",
        password: "password123",
        personalInformation: { firstName: "Alice", lastName: "Wonder" },
      });
    }

    let sender2 = await UserModel.findOne({ email: "bob@gmail.com" });
    if (!sender2) {
      sender2 = await UserModel.create({
        email: "bob@gmail.com",
        password: "password123",
        personalInformation: { firstName: "Bob", lastName: "Builder" },
      });
    }

    // 3. Create a dummy document
    const doc = await DocumentModel.create({
      title: "Project Alpha Roadmap",
      content: "Draft content...",
      owner: sender1._id,
      visibility: "SHARED",
      collaborators: [recipient._id],
    });

    // 4. Create Notifications
    const notifications = [
      {
        recipient: recipient._id,
        sender: sender1._id,
        type: NotificationType.DOCUMENT_INVITE,
        document: doc._id,
        message: `${sender1.email} invited you to edit "Project Alpha Roadmap"`,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        recipient: recipient._id,
        sender: sender2._id,
        type: NotificationType.DOCUMENT_UPDATE,
        document: doc._id,
        message: `${sender2.email} updated the document "Project Alpha Roadmap"`,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      },
      {
        recipient: recipient._id,
        sender: sender1._id,
        type: NotificationType.OWNERSHIP_TRANSFER,
        document: doc._id,
        message: `${sender1.email} transferred ownership of "Project Alpha Roadmap" to you`,
        read: true, // Read one
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
    ];

    await NotificationModel.insertMany(notifications);
    console.log(
      `Seeded ${notifications.length} notifications for ${recipient.email}`
    );
  } catch (error) {
    console.error("Error seeding notifications:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
  }
}

seedNotifications();
