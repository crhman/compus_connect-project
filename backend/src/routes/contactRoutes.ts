import express from "express";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.post("/", asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Please provide name, email and message");
  }

  // Simulate sending email
  console.log("------------------------------------------");
  console.log("NEW CONTACT MESSAGE (SIMULATED EMAIL)");
  console.log(`From: ${name} <${email}>`);
  console.log(`Message: ${message}`);
  console.log("------------------------------------------");

  res.status(200).json({ message: "Message sent successfully!" });
}));

export default router;
