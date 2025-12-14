import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserModel } from "../models/MUser.js";
import { DocumentModel } from "../models/MDocument.js";
import { NotificationModel } from "../models/MNotification.js";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI missing");
  process.exit(1);
}

async function debugState() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected");

  const alice = await UserModel.findOne({ email: "alice@gmail.com" });
  const user1 = await UserModel.findOne({ email: "user1@gmail.com" });

  console.log("Alice ID:", alice?._id.toString());
  console.log("User1 ID:", user1?._id.toString());

  // Find document
  const docs = await DocumentModel.find({ title: /Project Alpha Roadmap/ });
  console.log(`Found ${docs.length} documents matching title.`);

  for (const doc of docs) {
    console.log(`Doc ID: ${doc._id}`);
    console.log(`  Owner: ${doc.owner}`);
    console.log(
      `  Collaborators: ${doc.collaborators.map((c) => c.toString())}`
    );

    const isUser1Collab = doc.collaborators.some(
      (c) => c.toString() === user1?._id.toString()
    );
    console.log(`  Is User1 Collab? ${isUser1Collab}`);
  }

  // Find Notifications for Hec
  const notifs = await NotificationModel.find({ recipient: user1?._id }).sort({
    createdAt: -1,
  });
  console.log(`Found ${notifs.length} notifications for User1.`);
  for (const n of notifs) {
    console.log(
      `  - [${n.createdAt.toISOString()}] Type: ${n.type} From: ${
        n.sender
      } Msg: ${n.message}`
    );
  }

  await mongoose.disconnect();
}

debugState();
