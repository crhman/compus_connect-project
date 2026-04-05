import React, { useEffect, useState } from "react";
import api from "../api/client";

interface BookingItem {
  _id: string;
  time: string;
  status: string;
  studentName?: string;
  studentWhatsapp?: string;
  student?: { name: string; email: string };
}

const TeacherBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [selected, setSelected] = useState<BookingItem | null>(null);

  const loadBookings = () => {
    api.get("/teacher/bookings").then((res) => setBookings(res.data)).catch(() => undefined);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatus = async (id: string, status: string) => {
    await api.patch(`/bookings/${id}/status`, { status });
    loadBookings();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Booking requests</h3>
        <p className="text-sm text-slate-500">Approve or reject sessions in your faculty.</p>
      </div>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {booking.studentName || booking.student?.name || "Student"}
              </p>
              <p className="text-xs text-slate-500">{new Date(booking.time).toLocaleString()}</p>
              <p className="text-xs text-slate-500">Status: {booking.status}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelected(booking)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
              >
                View Details
              </button>
              <button
                onClick={() => handleStatus(booking._id, "accepted")}
                disabled={booking.status === "accepted" || booking.status === "completed"}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  booking.status === "accepted" || booking.status === "completed"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {booking.status === "accepted" ? "Accepted" : "Accept"}
              </button>
              <button
                onClick={() => handleStatus(booking._id, "rejected")}
                disabled={booking.status === "rejected" || booking.status === "completed"}
                className={`rounded-full px-3 py-1 text-xs ${
                  booking.status === "rejected" || booking.status === "completed"
                    ? "border border-slate-200 text-slate-400"
                    : "border border-slate-200 text-slate-600"
                }`}
              >
                {booking.status === "rejected" ? "Rejected" : "Reject"}
              </button>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-sm text-slate-500">No booking requests.</p>}
      </div>

      {selected && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">Booking details</h4>
            <button
              type="button"
              className="text-xs text-slate-500"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
          <div className="mt-3 grid gap-2 text-xs text-slate-600">
            <p>
              <span className="font-semibold text-slate-800">Student:</span>{" "}
              {selected.studentName || selected.student?.name || "Student"}
            </p>
            <p>
              <span className="font-semibold text-slate-800">Email:</span>{" "}
              {selected.student?.email || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-slate-800">WhatsApp:</span>{" "}
              {selected.studentWhatsapp || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-slate-800">Time:</span>{" "}
              {new Date(selected.time).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold text-slate-800">Status:</span> {selected.status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherBookingsPage;
