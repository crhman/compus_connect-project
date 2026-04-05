import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description?: string;
  date: Date;
  faculty: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  attendees: mongoose.Types.ObjectId[];
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    attendees: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export const Event: Model<IEvent> = mongoose.model<IEvent>("Event", eventSchema);
