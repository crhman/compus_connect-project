import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.jpg";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div 
          className="flex cursor-pointer flex-col items-center gap-4 text-center transition-all hover:scale-105"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="SIMAD"
            className="h-20 w-20 rounded-full border-4 border-white shadow-xl object-cover"
          />
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">SIMAD University</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">{t("academic_hub")}</p>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 sm:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t("welcome_back")}</h2>
            <p className="mt-2 text-sm text-slate-400 font-medium">{t("hero_description")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t("email_address")}</label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                  <span className="text-slate-400 group-focus-within:text-emerald-500 transition-colors">@</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-12 py-5 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  placeholder="student@simad.edu.so"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("password")}</label>
                <button 
                  type="button" 
                  onClick={() => navigate("/forgot-password")}
                  className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700"
                >
                  {t("forgot_password", "Forgot?")}
                </button>
              </div>
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                  <span className="text-slate-400 group-focus-within:text-emerald-500 transition-colors">#</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-12 py-5 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-rose-50 p-4 text-xs font-bold text-rose-600 border border-rose-100 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-rose-600" />
                {error}
              </div>
            )}

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-5 w-5 rounded-lg border-2 border-slate-200 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">{t("remember_device")}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl transition-all hover:bg-emerald-600 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {loading ? "..." : t("login")}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
            {t("dont_have_account")}{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
            >
              {t("register_now")}
            </button>
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 pb-10">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            <button className="hover:text-emerald-600 transition-colors">{t("privacy")}</button>
            <button className="hover:text-emerald-600 transition-colors">{t("terms")}</button>
            <button className="hover:text-emerald-600 transition-colors">{t("help")}</button>
          </div>
          <p>© 2026 SIMAD UNIVERSITY. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
