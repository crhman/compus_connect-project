import mongoose from "mongoose";
import { env } from "./config/env.js";
import { Faculty } from "./models/Faculty.js";
import { User } from "./models/User.js";

const seedFaculties = [
  {
    name: "Engineering",
    description: "Software, electrical, and mechanical engineering programs."
  },
  {
    name: "Business",
    description: "Entrepreneurship, accounting, and management."
  },
  {
    name: "Health Sciences",
    description: "Nursing, public health, and clinical sciences."
  },
  {
    name: "Humanities",
    description: "Languages, history, and social sciences."
  }
];

async function ensureFaculty() {
  const results = [];
  for (const faculty of seedFaculties) {
    const existing = await Faculty.findOne({ name: faculty.name });
    if (existing) {
      results.push(existing);
      continue;
    }
    const created = await Faculty.create({
      ...faculty,
      semesters: Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`)
    });
    results.push(created);
  }
  return results;
}

async function ensureAdmin(defaultFacultyId: mongoose.Types.ObjectId) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@campusconnect.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    return existing;
  }

  return User.create({
    name: "Campus Admin",
    email: adminEmail,
    password: adminPassword,
    role: "admin",
    faculty: defaultFacultyId,
    bio: "System administrator"
  });
}

async function run() {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is missing");
  }

  await mongoose.connect(env.mongoUri);

  const faculties = await ensureFaculty();
  const admin = await ensureAdmin(faculties[0]._id);

  console.log("Seed completed:");
  console.log(`Faculties: ${faculties.length}`);
  console.log(`Admin: ${admin.email}`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
