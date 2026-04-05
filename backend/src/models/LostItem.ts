import mongoose, { Schema, Document, Model } from "mongoose";

export type LostStatus = "lost" | "found";

export interface ILostItem extends Document {
  title: string;
  description?: string;
  image?: string;
  faculty: mongoose.Types.ObjectId;
  status: LostStatus;
}

const lostItemSchema = new Schema<ILostItem>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    status: { type: String, enum: ["lost", "found"], default: "lost" }
  },
  { timestamps: true }
);

export const LostItem: Model<ILostItem> = mongoose.model<ILostItem>("LostItem", lostItemSchema);
