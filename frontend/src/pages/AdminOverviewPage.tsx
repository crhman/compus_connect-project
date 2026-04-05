import React, { useEffect, useState } from "react";
import api from "../api/client";

const AdminOverviewPage: React.FC = () => {
  const [stats, setStats] = useState({ users: 0, faculties: 0, events: 0, buses: 0 });

  useEffect(() => {
    Promise.all([api.get("/users"), api.get("/faculties"), api.get("/events"), api.get("/buses")])
      .then(([users, faculties, events, buses]) => {
        setStats({
          users: users.data.length,
          faculties: faculties.data.length,
          events: events.data.length,
          buses: buses.data.length
        });
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Admin analytics</h3>
        <p className="text-sm text-slate-500">Full system visibility across faculties.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(stats).map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverviewPage;
