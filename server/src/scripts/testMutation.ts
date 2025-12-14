import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserModel } from "../models/MUser.js";
import { DocumentModel } from "../models/MDocument.js";
import documentMutationResolvers from "../graphql/resolvers/mutation/documentMutationResolvers.js";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI missing");
  process.exit(1);
}

async function testMutation() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected");

  const alice = await UserModel.findOne({ email: "alice@gmail.com" });
  if (!alice) throw new Error("Alice not found");

  const doc = await DocumentModel.findOne({ title: /Project Alpha Roadmap/ });
  if (!doc) throw new Error("Doc not found");

  const context = {
    user: alice,
    UserModel, // Mocking other context parts if needed
    DocumentModel,
  };

  console.log("--- START MUTATION SIMULATION ---");
  console.log(`Context User: ${alice.email} (${alice._id})`);
  console.log(`Doc Owner: ${doc.owner}`);
  console.log(`Doc Collabs: ${doc.collaborators}`);

  try {
    // @ts-ignore
    const result = await documentMutationResolvers.updateDocument(
      {},
      {
        documentID: doc._id.toString(),
        input: { content: "Updated by Script" },
      },
      context as any
    );
    console.log("Mutation Result:", result.title);
  } catch (e) {
    console.error("Mutation Failed:", e);
  }

  console.log("--- END ---");
  await mongoose.disconnect();
}

testMutation();
