import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBus extends Document {
  name: string;
  route?: string;
  from: string;
  to: string;
  faculty: mongoose.Types.ObjectId;
  schedule: string;
}

const busSchema = new Schema<IBus>(
  {
    name: { type: String, required: true, trim: true },
    route: { type: String, trim: true, default: "" },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    schedule: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Bus: Model<IBus> = mongoose.model<IBus>("Bus", busSchema);
