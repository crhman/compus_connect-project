import mongoose, { Schema, Document, Model } from "mongoose";

export type LostStatus = "lost" | "found" | "claimed";

export interface ILostItem extends Document {
  title: string;
  description?: string;
  image?: string;
  faculty: mongoose.Types.ObjectId;
  status: LostStatus;
  reportedBy?: mongoose.Types.ObjectId;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  claimedAt?: Date;
}

const lostItemSchema = new Schema<ILostItem>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    status: { type: String, enum: ["lost", "found", "claimed"], default: "lost" },
    reportedBy: { type: Schema.Types.ObjectId, ref: "User" },
    contactName: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    claimedAt: { type: Date }
  },
  { timestamps: true }
);

export const LostItem: Model<ILostItem> = mongoose.model<ILostItem>("LostItem", lostItemSchema);
