import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import PublicNavbar from "../components/PublicNavbar";
import logo from "../assets/logo.jpg";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || "";
  
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error" | null; msg: string }>({ type: null, msg: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setStatus({ type: "error", msg: "Please enter the 6-digit OTP code." });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ type: "error", msg: "Passwords do not match." });
      return;
    }
    if (password.length < 6) {
      setStatus({ type: "error", msg: "Password must be at least 6 characters." });
      return;
    }
    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      await api.post("/auth/reset-password", { otp, password });
      setStatus({ type: "success", msg: "Your password has been successfully updated! Redirecting to login..." });
      setTimeout(() => navigate("/login"), 3000);
    } catch (error: any) {
      setStatus({ type: "error", msg: error.response?.data?.message || "Invalid or expired OTP code." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Manrope']">
      <PublicNavbar />
      <div className="flex items-center justify-center p-4 py-20 lg:py-32">
        <div className="w-full max-w-xl space-y-10 animate-in fade-in zoom-in duration-700">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl animate-pulse" />
              <img src={logo} className="relative h-24 w-24 rounded-full border-4 border-white shadow-2xl object-cover" alt="SIMAD" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Verify Identity
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">{t("academic_hub")}</p>
            </div>
          </div>

          <div className="rounded-[3rem] bg-white p-10 sm:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100/50">
            <div className="mb-10 text-center">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">OTP Verification</h2>
              {initialEmail && <p className="text-[10px] text-slate-400 font-bold mt-2">Sent to: {initialEmail}</p>}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">6-Digit OTP Code</label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-3xl font-black tracking-[0.5em] rounded-[1.5rem] border-2 border-slate-50 bg-slate-50 py-6 text-emerald-600 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
                  placeholder="000000"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">New Password</label>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Confirm</label>
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {status.type && (
                <div className={`rounded-3xl p-6 text-[10px] font-black uppercase tracking-widest border animate-in slide-in-from-top-4 duration-300 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-4 ring-emerald-50' : 'bg-rose-50 text-rose-600 border-rose-100 ring-4 ring-rose-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${status.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {status.msg}
                  </div>
                </div>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full rounded-[1.5rem] bg-slate-900 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-2xl transition-all hover:bg-emerald-600 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {loading ? "VERIFYING..." : "UPDATE CREDENTIALS"}
              </button>
            </form>
          </div>
          
          <button onClick={() => navigate("/forgot-password")} className="w-full text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-emerald-600 transition-colors">
            Didn't receive a code? Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
