import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import logo from "../assets/logo.jpg";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isReady } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  if (!isReady) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row p-4 sm:p-6 lg:p-8 gap-6">
      {/* Mobile Toggle & Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between rounded-3xl bg-white px-6 shadow-sm border border-slate-100 lg:hidden">
        <div className="flex items-center gap-3">
          <img src={logo} className="h-9 w-9 rounded-full" alt="" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">SIMAD Uni</span>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar - Mobile Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar - Container */}
      <div className={`fixed inset-y-0 left-0 z-[110] w-72 transform transition-transform duration-500 ease-in-out lg:relative lg:inset-auto lg:z-0 lg:w-64 lg:translate-x-0 ${
        isMenuOpen ? "translate-x-0 p-4" : "-translate-x-full"
      }`}>
        <Sidebar
          role={user.role}
          isOpen={true} // Inside the container it should be visible
          onNavigate={() => setIsMenuOpen(false)}
          onSupportClick={() => setShowSupport(true)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-8 min-w-0">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm min-h-full">
          <TopBar />
          <div className="mt-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
