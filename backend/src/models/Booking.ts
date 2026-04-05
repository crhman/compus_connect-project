import mongoose, { Schema, Document, Model } from "mongoose";

export type BookingStatus = "pending" | "accepted" | "rejected" | "completed";

export interface IBooking extends Document {
  student: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  faculty: mongoose.Types.ObjectId;
  time: Date;
  status: BookingStatus;
  studentName: string;
  studentWhatsapp: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    time: { type: Date, required: true },
    studentName: { type: String, required: true, trim: true },
    studentWhatsapp: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export const Booking: Model<IBooking> = mongoose.model<IBooking>("Booking", bookingSchema);
