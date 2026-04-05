import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  appUrl: process.env.APP_URL || "http://localhost:5173"
};

if (!env.mongoUri) {
  console.warn("MONGO_URI is not set. API will fail to connect to database.");
}
