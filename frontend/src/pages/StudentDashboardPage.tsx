import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface GroupItem {
  _id: string;
  name: string;
  subject: string;
  members?: string[];
}

interface EventItem {
  _id: string;
  title: string;
  date: string;
}

interface BookingItem {
  _id: string;
  time: string;
  status: string;
}

const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);

  useEffect(() => {
    api.get("/groups").then((res) => setGroups(res.data || [])).catch(() => undefined);
    api.get("/events").then((res) => setEvents(res.data || [])).catch(() => undefined);
    api.get("/bookings").then((res) => setBookings(res.data || [])).catch(() => undefined);
  }, []);

  const upcomingEvents = useMemo(() => {
    const now = Date.now();
    return [...events]
      .filter((event) => new Date(event.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [events]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { pending: 0, accepted: 0, completed: 0, rejected: 0 };
    bookings.forEach((booking) => {
      counts[booking.status] = (counts[booking.status] || 0) + 1;
    });
    return counts;
  }, [bookings]);

  const statusBars = [
    { label: "Pending", value: statusCounts.pending || 0 },
    { label: "Accepted", value: statusCounts.accepted || 0 },
    { label: "Completed", value: statusCounts.completed || 0 },
    { label: "Rejected", value: statusCounts.rejected || 0 }
  ];

  const maxStatus = Math.max(1, ...statusBars.map((bar) => bar.value));

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-slate-500">Student Dashboard</p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Welcome back, <span className="text-indigo-600">{user?.name || "Student"}</span>.
          </h2>
          <p className="text-sm text-slate-500">Your faculty resources are up to date.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
            onClick={() => navigate("/groups")}
          >
            Join Study Group
          </button>
          <button
            className="rounded-full border border-indigo-200 px-4 py-2 text-xs font-semibold text-indigo-600"
            onClick={() => navigate("/booking")}
          >
            Schedule Tutor
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {groups.slice(0, 3).map((group) => (
              <div key={group._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{group.subject}</span>
                  <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-600">
                    {(group.members?.length || 0).toString()} members
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{group.name}</h3>
                <p className="mt-2 text-xs text-slate-500">Faculty group collaboration</p>
              </div>
            ))}
            {groups.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-xs text-slate-500">
                No groups yet. Create or join a faculty group.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Session Performance</h3>
                <p className="text-xs text-slate-500">Booking status summary</p>
              </div>
              <div className="rounded-2xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
                {bookings.length} total
              </div>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-4">
              {statusBars.map((bar) => (
                <div key={bar.label} className="text-center text-[10px] text-slate-400">
                  <div
                    className="mx-auto mb-2 w-8 rounded-full bg-indigo-200"
                    style={{ height: 20 + (bar.value / maxStatus) * 60 }}
                  />
                  {bar.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Upcoming Deadlines</h3>
            <div className="mt-4 space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="flex items-start gap-3">
                  <div className="rounded-2xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600">
                    {new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "2-digit" })}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{event.title}</p>
                    <p className="text-[11px] text-slate-400">{new Date(event.date).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-slate-500">No upcoming events.</p>
              )}
              <button
                className="w-full rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                onClick={() => navigate("/events")}
              >
                View All Events
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-indigo-700 p-5 text-white shadow-sm">
            <h3 className="text-sm font-semibold">Need Help?</h3>
            <p className="mt-2 text-xs text-indigo-100">
              Our peer-tutoring network is available 24/7 for support.
            </p>
            <button
              className="mt-4 w-full rounded-full bg-white px-3 py-2 text-xs font-semibold text-indigo-700"
              onClick={() => navigate("/booking")}
            >
              Book a Peer Tutor
            </button>
            <button
              className="mt-3 w-full rounded-full border border-white/30 px-3 py-2 text-xs font-semibold text-white"
              onClick={() => navigate("/groups")}
            >
              Resource Library
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
