import React, { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface BookingItem {
  _id: string;
  time: string;
  status: string;
}

interface StudentItem {
  _id: string;
  name: string;
}

const TeacherDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);

  useEffect(() => {
    api.get("/teacher/bookings").then((res) => setBookings(res.data || [])).catch(() => undefined);
    api.get("/teacher/students").then((res) => setStudents(res.data || [])).catch(() => undefined);
  }, []);

  const pendingBookings = bookings.filter((booking) => booking.status === "pending");
  const upcomingBookings = useMemo(() => {
    const now = Date.now();
    return [...bookings]
      .filter((booking) => new Date(booking.time).getTime() >= now)
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      .slice(0, 3);
  }, [bookings]);

  const recentBookings = bookings.slice(0, 4);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-slate-500">Teacher Dashboard</p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Professor {user?.name || "Faculty"}
          </h2>
          <p className="text-sm text-slate-500">Faculty bookings and student progress</p>
        </div>
        <div className="flex gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
            Total Students
            <div className="text-2xl text-indigo-600">{students.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
            Pending
            <div className="text-2xl text-indigo-600">{pendingBookings.length}</div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Upcoming Sessions</h3>
              <button className="text-xs font-semibold text-indigo-500">View All Bookings</button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {upcomingBookings.map((booking) => (
                <div key={booking._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Booking</p>
                  <h4 className="mt-2 text-sm font-semibold text-slate-900">
                    {new Date(booking.time).toLocaleString()}
                  </h4>
                  <p className="mt-2 text-xs text-slate-500">Status: {booking.status}</p>
                </div>
              ))}
              {upcomingBookings.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-xs text-slate-500">
                  No upcoming sessions scheduled.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Class Performance</h3>
                <p className="text-xs text-slate-500">Booking status overview</p>
              </div>
              <div className="flex gap-2 text-[11px]">
                <button className="rounded-full bg-indigo-600 px-3 py-1 font-semibold text-white">By Status</button>
                <button className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-500">
                  Attendance
                </button>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-5 gap-3">
              {["Pending", "Accepted", "Completed", "Rejected", "Total"].map((label, index) => {
                const value =
                  index === 4
                    ? bookings.length
                    : bookings.filter((booking) => booking.status === label.toLowerCase()).length;
                return (
                  <div key={label} className="flex flex-col items-center gap-2 text-[10px] text-slate-400">
                    <div className="w-8 rounded-full bg-indigo-200" style={{ height: 20 + value * 6 }} />
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Recent Bookings</h3>
            <div className="mt-4 space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-800">{new Date(booking.time).toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500">Status: {booking.status}</p>
                </div>
              ))}
              {recentBookings.length === 0 && <p className="text-sm text-slate-500">No bookings yet.</p>}
            </div>
          </div>

          <div className="rounded-2xl bg-indigo-700 p-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Today's Schedule</h3>
              <span className="text-xs text-indigo-200">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="mt-4 space-y-3">
              {upcomingBookings.map((booking) => (
                <div key={booking._id} className="rounded-2xl bg-white/10 px-3 py-2">
                  <p className="text-[11px] text-indigo-100">
                    {new Date(booking.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="text-xs font-semibold text-white">Tutoring Session</p>
                </div>
              ))}
              {upcomingBookings.length === 0 && (
                <p className="text-xs text-indigo-100">No sessions scheduled today.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
