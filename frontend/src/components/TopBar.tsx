import React from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpg";

const TopBar: React.FC = () => {
  const { user } = useAuth();

  const portalLabel =
    user?.role === "admin" ? "Admin Portal" : user?.role === "teacher" ? "Faculty Portal" : "Student Portal";

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="SIMAD University logo"
            className="h-9 w-9 rounded-full border border-slate-200 object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-indigo-600">SIMAD University</p>
            <p className="text-xs text-slate-400">Academic Hub</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center gap-4 lg:justify-end">
        <div className="flex w-full max-w-xs items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
          <span>Search</span>
          <input
            className="w-full bg-transparent text-xs text-slate-600 outline-none"
            placeholder="Search resources..."
          />
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-xs text-slate-500">
          N
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
          {user?.name?.[0] || "U"}
        </div>
        <button className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white">
          {portalLabel}
        </button>
      </div>
    </header>
  );
};

export default TopBar;
