import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;
  title: string;
  message: string;
  status: "unread" | "read";
  type: "booking" | "event" | "system" | "lost_found";
  link?: string;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["unread", "read"], default: "unread" },
    type: { type: String, enum: ["booking", "event", "system", "lost_found"], default: "system" },
    link: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Notification: Model<INotification> = mongoose.model<INotification>("Notification", notificationSchema);
