import mongoose, { Schema, Document, Model } from "mongoose";

export type BusBookingStatus = "pending" | "paid" | "cancelled" | "completed";

export interface IBusBooking extends Document {
  student: mongoose.Types.ObjectId;
  bus: mongoose.Types.ObjectId;
  schedule: mongoose.Types.ObjectId;
  faculty: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod?: string;
  status: BusBookingStatus;
  paidAt?: Date;
}

const busBookingSchema = new Schema<IBusBooking>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bus: { type: Schema.Types.ObjectId, ref: "Bus", required: true },
    schedule: { type: Schema.Types.ObjectId, ref: "BusSchedule", required: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    amount: { type: Number, default: 0 },
    paymentMethod: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "completed"],
      default: "pending"
    },
    paidAt: { type: Date }
  },
  { timestamps: true }
);

export const BusBooking: Model<IBusBooking> = mongoose.model<IBusBooking>(
  "BusBooking",
  busBookingSchema
);
