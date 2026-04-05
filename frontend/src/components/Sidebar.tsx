import React from "react";
import { NavLink } from "react-router-dom";
import { Role, useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpg";

interface SidebarItem {
  label: string;
  to: string;
  icon: "grid" | "chart" | "book" | "calendar" | "users" | "settings";
}

interface SidebarProps {
  role: Role;
}

const navByRole: Record<Role, SidebarItem[]> = {
  student: [
    { label: "Dashboard", to: "/dashboard", icon: "grid" },
    { label: "Events", to: "/events", icon: "calendar" },
    { label: "Groups", to: "/groups", icon: "users" },
    { label: "Bookings", to: "/booking", icon: "book" }
  ],
  teacher: [
    { label: "Dashboard", to: "/dashboard", icon: "grid" },
    { label: "Bookings", to: "/teacher/bookings", icon: "calendar" },
    { label: "Availability", to: "/teacher/availability", icon: "settings" },
    { label: "Students", to: "/teacher/students", icon: "users" },
    { label: "Groups", to: "/groups", icon: "book" }
  ],
  admin: [
    { label: "Overview", to: "/admin/overview", icon: "grid" },
    { label: "Users", to: "/admin/users", icon: "users" },
    { label: "Faculties", to: "/admin/faculties", icon: "book" },
    { label: "Events", to: "/admin/events", icon: "calendar" },
    { label: "Buses", to: "/admin/buses", icon: "chart" }
  ]
};

const Icon: React.FC<{ name: SidebarItem["icon"] }> = ({ name }) => {
  const base = "h-4 w-4";
  switch (name) {
    case "grid":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="3" width="7" height="7" rx="2" />
          <rect x="3" y="14" width="7" height="7" rx="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" />
        </svg>
      );
    case "chart":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19V5" />
          <path d="M10 19V9" />
          <path d="M16 19V13" />
          <path d="M22 19H2" />
        </svg>
      );
    case "book":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 5h11a3 3 0 0 1 3 3v11H7a3 3 0 0 0-3 3z" />
          <path d="M4 5v14" />
        </svg>
      );
    case "calendar":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
        </svg>
      );
    case "users":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "settings":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
  }
};

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const { logout } = useAuth();
  const links = navByRole[role];
  const roleLabel =
    role === "admin" ? "Admin Control" : role === "teacher" ? "Faculty Portal" : "Student Portal";

  return (
    <aside className="sticky top-8 flex h-[calc(100vh-4rem)] w-64 flex-col gap-6 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="SIMAD University logo"
            className="h-10 w-10 rounded-full border border-slate-200 object-cover"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">SIMAD University</p>
            <p className="text-[11px] text-slate-400">Academic Hub</p>
          </div>
        </div>
        <p className="text-xs text-slate-400">{roleLabel}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-2 text-xs font-semibold transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-500 hover:bg-indigo-50"
              }`
            }
          >
            <Icon name={link.icon} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button className="rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white">
        Generate Reports
      </button>

      <div className="space-y-2 text-xs text-slate-500">
        <button className="w-full text-left">Support</button>
        <button className="w-full text-left" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
