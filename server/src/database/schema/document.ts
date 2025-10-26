import mongoose, { Schema, Document, model, Types } from "mongoose";
import { randomUUID } from "crypto";

export interface IDocs extends Document {
  uuid: mongoose.Types.UUID;
  owner: Types.ObjectId;
}

// Docs Schema
const docsSchema = new Schema<IDocs>({
  uuid: {
    type: Schema.Types.UUID,
    unique: true,
    required: true,
    default: () => randomUUID(),
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Model
export const Docs = model<IDocs>("Docs", docsSchema);
