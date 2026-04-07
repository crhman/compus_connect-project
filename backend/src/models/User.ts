import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "student" | "teacher" | "admin";

export interface AvailabilitySlot {
  day: string;
  from: string;
  to: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  faculty: mongoose.Types.ObjectId;
  classLevel?: string;
  phone?: string;
  bio?: string;
  subjects: string[];
  availability: AvailabilitySlot[];
  createdAt: Date;
  avatar?: string;
  comparePassword: (candidate: string) => Promise<boolean>;
}

const availabilitySchema = new Schema<AvailabilitySlot>(
  {
    day: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true }
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["student", "teacher", "admin"], required: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    classLevel: { type: String, default: "" },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    subjects: { type: [String], default: [] },
    availability: { type: [availabilitySchema], default: [] },
    avatar: { type: String, default: "" }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
