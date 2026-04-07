import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface GroupItem { _id: string; name: string; subject: string; members?: string[]; }
interface EventItem { _id: string; title: string; date: string; }
interface BookingItem { _id: string; time: string; status: string; }
interface LostItem { _id: string; title: string; status: string; createdAt: string; }

const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState<{
    groups: GroupItem[];
    events: EventItem[];
    bookings: BookingItem[];
    lostItems: LostItem[];
  }>({ groups: [], events: [], bookings: [], lostItems: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [g, e, b, l] = await Promise.all([
          api.get("/groups"),
          api.get("/events"),
          api.get("/bookings"),
          api.get("/lost-items")
        ]);
        setData({
          groups: g.data || [],
          events: e.data || [],
          bookings: b.data || [],
          lostItems: l.data?.slice(0, 3) || []
        });
      } catch (error) {
        console.error("Dashboard fetch error", error);
      }
    };
    fetchData();
  }, []);

  const upcomingEvents = useMemo(() => {
    return (data.events || [])
      .filter((ev) => new Date(ev.date).getTime() >= Date.now())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [data.events]);

  const statusBars = useMemo(() => {
    const counts: Record<string, number> = { pending: 0, accepted: 0, completed: 0, rejected: 0 };
    (data.bookings || []).forEach((b) => {
      if (counts[b.status] !== undefined) counts[b.status]++;
    });
    const max = Math.max(1, ...Object.values(counts));
    return Object.entries(counts).map(([label, val]) => ({
      label: t(`status_${label}`),
      height: 20 + (val / max) * 60,
      val
    }));
  }, [data.bookings, t]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">{t("student_db_title")}</p>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t("welcome_back")}, <span className="text-emerald-500">{user?.name?.split(' ')[0] || t("student_default")}</span>
          </h2>
          <p className="text-sm text-slate-400 font-medium">{t("faculty_resources_up_to_date")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onClick={() => navigate("/groups")} className="rounded-2xl bg-slate-900 px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-600 transition-all shadow-lg active:scale-95">{t("join_study_group")}</button>
          <button onClick={() => navigate("/booking")} className="rounded-2xl border-2 border-slate-100 px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95">{t("schedule_tutor")}</button>
          <button onClick={() => navigate("/buses")} className="rounded-2xl border-2 border-slate-100 px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95">{t("bus_schedule")}</button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.groups.slice(0, 3).map((group) => (
              <div key={group._id} className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{group.subject}</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-black text-emerald-600">{group.members?.length || 0} {t("members")}</span>
                </div>
                <h3 className="text-sm font-black text-slate-800 line-clamp-1">{group.name}</h3>
                <p className="mt-2 text-xs text-slate-400 font-medium leading-relaxed">{t("faculty_group_collaboration")}</p>
              </div>
            ))}
            {data.groups.length === 0 && <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-100 p-8 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">{t("no_groups_yet")}</div>}
          </div>

          <div className="rounded-[2.5rem] bg-slate-50 p-8 sm:p-10 border border-slate-100 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{t("session_performance")}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t("booking_status_summary")}</p>
              </div>
              <div className="inline-flex rounded-2xl bg-white px-5 py-2.5 text-xs font-black text-emerald-600 shadow-sm ring-1 ring-slate-100">
                {data.bookings.length} {t("total")}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-end">
              {statusBars.map((bar) => (
                <div key={bar.label} className="flex flex-col items-center gap-4">
                  <div 
                    className="w-10 rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-200 transition-all hover:scale-110" 
                    style={{ height: bar.height }} 
                  />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">{t("upcoming_deadlines")}</h3>
              <div className="h-1.5 w-8 rounded-full bg-emerald-500" />
            </div>
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="flex items-center gap-4 group cursor-pointer">
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 w-12 h-14 border border-slate-100 group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-all">
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase">{new Date(event.date).toLocaleDateString(undefined, { month: "short" })}</span>
                    <span className="text-sm font-black text-slate-800 group-hover:text-white">{new Date(event.date).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-black text-slate-800">{event.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && <p className="text-xs text-slate-400 font-bold uppercase text-center py-6">{t("no_upcoming_events")}</p>}
              <button onClick={() => navigate("/events")} className="w-full rounded-2xl border-2 border-slate-50 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 hover:border-emerald-50 transition-all">{t("view_all_events")}</button>
            </div>
          </div>

          <div className="rounded-3xl bg-emerald-600 p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-black tracking-tight">{t("need_help")}</h3>
                <p className="text-[11px] font-medium leading-relaxed text-emerald-100">{t("peer_tutor_network")}</p>
              </div>
              <div className="space-y-3">
                <button onClick={() => navigate("/booking")} className="w-full rounded-2xl bg-white py-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-slate-900 hover:text-white transition-all shadow-xl">{t("book_peer_tutor")}</button>
                <button onClick={() => navigate("/groups")} className="w-full rounded-2xl border-2 border-white/20 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">{t("resource_library")}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
