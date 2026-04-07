import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import logo from "../assets/logo.jpg";

const TopBar: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      api.get("/notifications/unread-count").then(res => setUnreadCount(res.data.count)).catch(() => null);
      api.get("/notifications").then(res => setNotifications(res.data)).catch(() => null);
    }
    const interval = setInterval(() => {
      if (user) {
        api.get("/notifications/unread-count").then(res => setUnreadCount(res.data.count)).catch(() => null);
        api.get("/notifications").then(res => setNotifications(res.data)).catch(() => null);
      }
    }, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  const handleNotificationsClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      await api.post("/notifications/read-all");
      setUnreadCount(0);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const res = await api.post("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data) {
        updateUser({ ...user, avatar: res.data.avatar });
      }
    } catch (err) {
      console.error("Avatar upload failed", err);
    }
  };

  const portalLabel =
    user?.role === "admin" ? t("admin_portal") : user?.role === "teacher" ? t("faculty_portal") : t("student_portal");

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="SIMAD University logo"
            className="h-9 w-9 rounded-full border border-slate-200 object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-emerald-600">SIMAD University</p>
            <p className="text-xs text-slate-400">Academic Hub</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-3 lg:justify-end">
        <div className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500 sm:max-w-xs">
          <span>Search</span>
          <input
            className="w-full bg-transparent text-xs text-slate-600 outline-none"
            placeholder={t("search_resources")}
          />
        </div>
        <select 
          className="h-9 rounded-full border border-slate-200 bg-white px-2 py-0 text-xs text-slate-500 outline-none"
          value={i18n.language}
          onChange={(e) => {
            const lang = e.target.value;
            i18n.changeLanguage(lang);
            localStorage.setItem("cc_lang", lang);
          }}
        >
          <option value="en">EN</option>
          <option value="so">SO</option>
          <option value="ar">AR</option>
        </select>
        <div className="relative">
          <button 
            onClick={handleNotificationsClick}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 border border-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 z-[60] w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
              <div className="mb-2 flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
              </div>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n._id} className="rounded-xl bg-slate-50 p-2 text-[11px]">
                    <p className="font-semibold text-slate-800">{n.title}</p>
                    <p className="text-slate-500">{n.message}</p>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="py-4 text-center text-xs text-slate-400">No notifications yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-emerald-600 text-xs text-white"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            user?.name?.[0] || "U"
          )}
        </div>
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          style={{ display: "none" }} 
          onChange={handleFileChange} 
        />
        <button className="w-full rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white sm:w-auto">
          {portalLabel}
        </button>
      </div>
    </header>
  );
};

export default TopBar;
