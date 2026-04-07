import React, { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useTranslation } from "react-i18next";
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

interface LostItem {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
}

const TeacherDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);

  const load = () => {
    api.get("/teacher/bookings").then((res) => setBookings(res.data || [])).catch(() => undefined);
    api.get("/teacher/students").then((res) => setStudents(res.data || [])).catch(() => undefined);
    api.get("/lost-items").then((res) => setLostItems(res.data?.slice(0, 3) || [])).catch(() => undefined);
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      load();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Action failed");
    }
  };

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
          <p className="text-sm text-slate-500">{t("teacher_db_title")}</p>
          <h2 className="text-3xl font-semibold text-slate-900">
            {t("professor")} {user?.name || t("faculty_default")}
          </h2>
          <p className="text-sm text-slate-500">{t("faculty_bookings_progress")}</p>
        </div>
        <div className="flex gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
            {t("total_students")}
            <div className="text-2xl text-emerald-600">{students.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
            {t("pending")}
            <div className="text-2xl text-emerald-600">{pendingBookings.length}</div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">{t("upcoming_sessions")}</h3>
              <button className="text-xs font-semibold text-emerald-500">{t("view_all_bookings")}</button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {upcomingBookings.map((booking) => (
                <div key={booking._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">{t("booking")}</p>
                  <h4 className="mt-2 text-sm font-semibold text-slate-900">
                    {new Date(booking.time).toLocaleString()}
                  </h4>
                  <p className="mt-2 text-xs text-slate-500">{t("status")} {booking.status === "pending" ? t("status_pending") : booking.status === "accepted" ? t("status_accepted") : booking.status === "completed" ? t("status_completed") : t("status_rejected")}</p>
                  {booking.status === "pending" && (
                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => handleStatus(booking._id, "accepted")}
                        className="flex-1 rounded-xl bg-emerald-600 py-2 text-[10px] font-bold text-white transition-opacity hover:opacity-90"
                      >
                        {t("accept")}
                      </button>
                      <button 
                        onClick={() => handleStatus(booking._id, "rejected")}
                        className="flex-1 rounded-xl border border-slate-200 py-2 text-[10px] font-bold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        {t("reject")}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {upcomingBookings.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-xs text-slate-500">
                  {t("no_upcoming_sessions")}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{t("class_performance")}</h3>
                <p className="text-xs text-slate-500">{t("booking_status_overview")}</p>
              </div>
              <div className="flex gap-2 text-[11px]">
                <button className="rounded-full bg-emerald-600 px-3 py-1 font-semibold text-white">{t("by_status")}</button>
                <button className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-500">
                  {t("attendance")}
                </button>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-5 gap-3">
              {[
                { label: t("status_pending"), status: "pending" },
                { label: t("status_accepted"), status: "accepted" },
                { label: t("status_completed"), status: "completed" },
                { label: t("status_rejected"), status: "rejected" },
                { label: t("total"), status: "total" }
              ].map((item, index) => {
                const value =
                  index === 4
                    ? bookings.length
                    : bookings.filter((booking) => booking.status === item.status).length;
                return (
                  <div key={item.label} className="flex flex-col items-center gap-2 text-[10px] text-slate-400 text-center">
                    <div className="w-8 rounded-full bg-emerald-200" style={{ height: 20 + value * 6 }} />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">{t("recent_bookings")}</h3>
            <div className="mt-4 space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-800">{new Date(booking.time).toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500">{t("status")} {booking.status === "pending" ? t("status_pending") : booking.status === "accepted" ? t("status_accepted") : booking.status === "completed" ? t("status_completed") : t("status_rejected")}</p>
                </div>
              ))}
              {recentBookings.length === 0 && <p className="text-sm text-slate-500">{t("no_bookings_yet")}</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Lost & Found</h3>
              <button className="text-xs font-semibold text-emerald-500 hover:text-emerald-600" onClick={() => window.location.href = '/lost-found'}>View all</button>
            </div>
            <div className="mt-4 space-y-4">
              {lostItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="max-w-[70%]">
                    <p className="truncate text-xs font-semibold text-slate-800">{item.title}</p>
                    <p className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase ${item.status === 'lost' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
              {lostItems.length === 0 && <p className="text-xs text-slate-500">No recent reports.</p>}
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-700 p-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{t("todays_schedule")}</h3>
              <span className="text-xs text-emerald-200">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="mt-4 space-y-3">
              {upcomingBookings.map((booking) => (
                <div key={booking._id} className="rounded-2xl bg-white/10 px-3 py-2">
                  <p className="text-[11px] text-emerald-100">
                    {new Date(booking.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="text-xs font-semibold text-white">{t("tutoring_session")}</p>
                </div>
              ))}
              {upcomingBookings.length === 0 && (
                <p className="text-xs text-emerald-100">{t("no_sessions_today")}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
