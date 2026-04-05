import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFaculty extends Document {
  name: string;
  description?: string;
  semesters: string[];
}

const facultySchema = new Schema<IFaculty>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    semesters: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const Faculty: Model<IFaculty> = mongoose.model<IFaculty>("Faculty", facultySchema);
