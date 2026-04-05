import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGroup extends Document {
  name: string;
  subject: string;
  faculty: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  classLevel: string;
  materials: { title: string; url?: string; createdAt: Date }[];
  assignments: { title: string; description?: string; dueDate?: Date; createdAt: Date }[];
}

const groupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    classLevel: { type: String, required: true },
    materials: [
      {
        title: { type: String, required: true },
        url: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    assignments: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        dueDate: { type: Date },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const Group: Model<IGroup> = mongoose.model<IGroup>("Group", groupSchema);
