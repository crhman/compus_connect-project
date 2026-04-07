import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Role, useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpg";

interface SidebarItem {
  label: string;
  to: string;
  icon: "grid" | "chart" | "book" | "calendar" | "users" | "settings" | "bus" | "search";
}

interface SidebarProps {
  role: Role;
  isOpen?: boolean;
  onNavigate?: () => void;
  onSupportClick?: () => void;
}

const navByRole: Record<Role, SidebarItem[]> = {
  student: [
    { label: "nav_dashboard", to: "/dashboard", icon: "grid" },
    { label: "nav_events", to: "/events", icon: "calendar" },
    { label: "nav_groups", to: "/groups", icon: "users" },
    { label: "nav_bookings", to: "/booking", icon: "book" },
    { label: "nav_lost_found", to: "/lost-found", icon: "search" },
    { label: "nav_buses", to: "/buses", icon: "bus" }
  ],
  teacher: [
    { label: "nav_dashboard", to: "/dashboard", icon: "grid" },
    { label: "nav_bookings", to: "/teacher/bookings", icon: "calendar" },
    { label: "nav_availability", to: "/teacher/availability", icon: "settings" },
    { label: "nav_students", to: "/teacher/students", icon: "users" },
    { label: "nav_groups", to: "/groups", icon: "book" },
    { label: "nav_lost_found", to: "/lost-found", icon: "search" }
  ],
  admin: [
    { label: "nav_overview", to: "/admin/overview", icon: "grid" },
    { label: "nav_users", to: "/admin/users", icon: "users" },
    { label: "nav_faculties", to: "/admin/faculties", icon: "book" },
    { label: "nav_events", to: "/admin/events", icon: "calendar" },
    { label: "nav_buses", to: "/admin/buses", icon: "chart" },
    { label: "nav_lost_found", to: "/lost-found", icon: "search" }
  ]
};

const Icon: React.FC<{ name: SidebarItem["icon"] }> = ({ name }) => {
  const base = "h-4 w-4";
  switch (name) {
    case "grid": return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>;
    case "chart": return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19V5M10 19V9M16 19V13M22 19H2" /></svg>;
    case "book": return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5h11a3 3 0 0 1 3 3v11H7a3 3 0 0 0-3 3zM4 5v14" /></svg>;
    case "calendar": return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
    case "users": return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "settings": return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
    case "bus": return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="3" width="16" height="13" rx="2" /><path d="M4 11h16" /><circle cx="8" cy="18" r="2" /><circle cx="16" cy="18" r="2" /></svg>;
    case "search": return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ role, onNavigate, onSupportClick }) => {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const links = navByRole[role];
  const roleLabel = role === "admin" ? t("admin_portal") : role === "teacher" ? t("faculty_portal") : t("student_portal");

  return (
    <aside className="flex flex-col h-full bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm lg:sticky lg:top-8 overflow-y-auto">
      <div className="mb-10 text-center lg:text-left">
        <div className="flex flex-col items-center lg:items-start gap-4">
          <img src={logo} alt="SIMAD" className="h-12 w-12 rounded-full border border-slate-100 shadow-sm" />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">SIMAD University</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 mt-1">{roleLabel}</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-2xl px-5 py-3.5 text-xs font-bold uppercase tracking-widest transition-all ${
                isActive ? "bg-slate-900 text-white shadow-xl translate-x-1" : "text-slate-500 hover:bg-slate-50"
              }`
            }
          >
            <Icon name={link.icon} />
            {t(link.label)}
          </NavLink>
        ))}
      </nav>

      <div className="mt-10 pt-8 border-t border-slate-50 space-y-4">
        <button 
          onClick={onSupportClick} 
          className="flex w-full items-center gap-4 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
        >
          {t("support")}
        </button>
        <button
          onClick={() => { if (window.confirm(t("logout_confirm"))) logout(); }}
          className="flex w-full items-center gap-4 px-5 text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 transition-colors"
        >
          {t("logout")}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
