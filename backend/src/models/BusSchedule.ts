import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBusSchedule extends Document {
  bus: mongoose.Types.ObjectId;
  faculty: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  capacity: number;
  price: number;
  createdBy?: mongoose.Types.ObjectId;
}

const busScheduleSchema = new Schema<IBusSchedule>(
  {
    bus: { type: Schema.Types.ObjectId, ref: "Bus", required: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    capacity: { type: Number, default: 30 },
    price: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export const BusSchedule: Model<IBusSchedule> = mongoose.model<IBusSchedule>(
  "BusSchedule",
  busScheduleSchema
);
