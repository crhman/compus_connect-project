import React, { useEffect, useMemo, useState } from "react";
import api from "../api/client";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

interface EventItem {
  _id: string;
  title: string;
  date: string;
}

interface FacultyItem {
  _id: string;
  name: string;
}

interface BusItem {
  _id: string;
  name: string;
  route: string;
}

const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [faculties, setFaculties] = useState<FacultyItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [buses, setBuses] = useState<BusItem[]>([]);

  useEffect(() => {
    Promise.all([api.get("/users"), api.get("/faculties"), api.get("/events"), api.get("/buses")])
      .then(([usersRes, facultiesRes, eventsRes, busesRes]) => {
        setUsers(usersRes.data || []);
        setFaculties(facultiesRes.data || []);
        setEvents(eventsRes.data || []);
        setBuses(busesRes.data || []);
      })
      .catch(() => undefined);
  }, []);

  const upcomingEvents = useMemo(() => {
    const now = Date.now();
    return [...events]
      .filter((event) => new Date(event.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  }, [events]);

  const recentUsers = useMemo(() => {
    return [...users].slice(0, 4);
  }, [users]);

  const stats = [
    { label: "Total Users", value: users.length.toLocaleString(), meta: "Active accounts" },
    { label: "Faculties", value: faculties.length.toLocaleString(), meta: "Registered schools" },
    { label: "Events", value: events.length.toLocaleString(), meta: "Scheduled" },
    { label: "Buses", value: buses.length.toLocaleString(), meta: "Active routes" }
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-slate-500">Admin Dashboard</p>
        <h2 className="text-3xl font-semibold text-slate-900">Executive Overview</h2>
        <p className="text-sm text-slate-500">Live operational snapshot across all faculties.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{stat.value}</p>
            <p className="text-xs text-emerald-500">{stat.meta}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Latest Users</h3>
              <p className="text-xs text-slate-500">Newest accounts created in the system</p>
            </div>
            <button className="text-xs font-semibold text-emerald-500">View all</button>
          </div>
          <div className="mt-4 grid gap-3">
            {recentUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] text-emerald-600">
                  {user.role}
                </span>
              </div>
            ))}
            {recentUsers.length === 0 && <p className="text-sm text-slate-500">No users yet.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Upcoming Events</h3>
          <p className="text-xs text-slate-500">Next events across faculties</p>
          <div className="mt-4 space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-800">{event.title}</p>
                <p className="text-[11px] text-slate-500">{new Date(event.date).toLocaleString()}</p>
              </div>
            ))}
            {upcomingEvents.length === 0 && <p className="text-sm text-slate-500">No upcoming events.</p>}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Active Transport</h3>
            <p className="text-xs text-slate-500">Latest bus routes and schedules</p>
          </div>
          <button className="text-xs font-semibold text-emerald-500">Manage buses</button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {buses.slice(0, 4).map((bus) => (
            <div key={bus._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-900">{bus.name}</p>
              <p className="text-[11px] text-slate-500">{bus.route}</p>
            </div>
          ))}
          {buses.length === 0 && <p className="text-sm text-slate-500">No buses configured.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
