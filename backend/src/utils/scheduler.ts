import cron from "node-cron";
import { Booking } from "../models/Booking.js";
import { sendNotification } from "./notifications.js";

export function startSchedulers() {
  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();
    const soon = new Date(now.getTime() + 60 * 60 * 1000);

    const dueBookings = await Booking.find({
      status: { $in: ["pending", "accepted"] },
      time: { $lte: now }
    }).populate("student teacher", "name email");

    for (const booking of dueBookings) {
      booking.status = "completed";
      await booking.save();
    }

    const reminders = await Booking.find({
      status: { $in: ["pending", "accepted"] },
      time: { $gte: now, $lte: soon }
    }).populate("student teacher", "name");

    for (const booking of reminders) {
      sendNotification({
        type: "booking_reminder",
        userId: String(booking.student),
        message: `Reminder: tutoring session at ${booking.time.toISOString()}`
      });
      sendNotification({
        type: "booking_reminder",
        userId: String(booking.teacher),
        message: `Reminder: tutoring session at ${booking.time.toISOString()}`
      });
    }
  });
}
