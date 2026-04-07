import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import PublicNavbar from "../components/PublicNavbar";
import logo from "../assets/logo.jpg";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error" | null; msg: string }>({ type: null, msg: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      await api.post("/auth/forgot-password", { email });
      setStatus({ type: "success", msg: "Excellent! A 6-digit code was sent to your email. Redirecting you to the verification page..." });
      // Short delay before redirect
      setTimeout(() => navigate("/reset-password", { state: { email } }), 2000);
    } catch (error: any) {
      setStatus({ type: "error", msg: error.response?.data?.message || "Email address not found in our system." });
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
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Account Recovery</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">{t("academic_hub")}</p>
            </div>
          </div>

          <div className="rounded-[3rem] bg-white p-10 sm:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100/50">
            <h2 className="mb-10 text-center text-sm font-black uppercase tracking-widest text-slate-400">Security Verification</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Institutional Email address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">@</div>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[1.5rem] border-2 border-slate-50 bg-slate-50 px-14 py-5 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
                    placeholder="student@simad.edu.so"
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
                {loading ? "SENDING..." : "SEND VERIFICATION CODE"}
              </button>
            </form>

            <button
              onClick={() => navigate("/login")}
              className="mt-10 w-full text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-emerald-600 transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
