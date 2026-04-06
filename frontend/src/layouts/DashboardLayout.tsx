import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isReady } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isReady) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6" />
                <path d="M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </svg>
            )}
          </button>
          <span className="text-xs font-semibold text-slate-400">SIMAD University</span>
        </div>
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[256px_1fr]">
          <Sidebar
            role={user.role}
            isOpen={isMenuOpen}
            onNavigate={() => setIsMenuOpen(false)}
          />
          <main className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm sm:p-8">
            <TopBar />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
