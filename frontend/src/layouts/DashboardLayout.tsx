import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[256px_1fr]">
        <Sidebar role={user.role} />
        <main className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-slate-50/80 p-8 shadow-sm">
          <TopBar />
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
