export type NotificationPayload = {
  type: "booking_reminder" | "event_alert";
  userId: string;
  message: string;
};

export function sendNotification(payload: NotificationPayload) {
  console.log(`[notification] ${payload.type} -> ${payload.userId}: ${payload.message}`);
}
