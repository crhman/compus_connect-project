import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.jpg";

interface FacultyItem { _id: string; name: string; semesters?: string[]; }

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [faculties, setFaculties] = useState<FacultyItem[]>([]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", role: "student", faculty: "", classLevel: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/faculties").then((res) => setFaculties(res.data)).catch(() => undefined);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        ...formData,
        classLevel: formData.role === "student" ? formData.classLevel : undefined
      });
      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Left Panel - Branding */}
        <div className="relative bg-slate-900 p-12 text-white flex flex-col justify-between hidden lg:flex overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 cursor-pointer flex items-center gap-4" onClick={() => navigate("/")}>
            <img src={logo} alt="SIMAD" className="h-12 w-12 rounded-full border-2 border-white/20" />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em]">SIMAD University</p>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{t("academic_hub")}</p>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <h1 className="text-5xl font-black leading-tight tracking-tighter">
              Start your <span className="text-emerald-500">academic</span> journey today.
            </h1>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
              Access the most advanced university platform in the region. One account, limitless possibilities.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-8 border-t border-white/10 pt-8 mt-12">
            <div>
              <p className="text-2xl font-black">10k+</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Active Students</p>
            </div>
            <div>
              <p className="text-2xl font-black">500+</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Expert Faculty</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="p-8 sm:p-14 lg:p-16 overflow-y-auto max-h-[90vh]">
          <div className="lg:hidden flex items-center gap-4 mb-10" onClick={() => navigate("/")}>
            <img src={logo} alt="SIMAD" className="h-10 w-10 rounded-full" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-900">SIMAD University</p>
          </div>

          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{t("register_now")}</h2>
          <p className="text-sm text-slate-400 font-medium mb-10">{t("sign_up_to_get_started")}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t("full_name")}</label>
                <input required className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all" placeholder="Jane Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t("email_address")}</label>
                <input type="email" required className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all" placeholder="jane.doe@simad.edu.so" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t("phone_number")}</label>
                <input required className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all" placeholder="+252 ..." value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t("nav_faculties")}</label>
                <select required className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none" value={formData.faculty} onChange={(e) => setFormData({...formData, faculty: e.target.value, classLevel: ""})}>
                  <option value="">{t("select_faculty")}</option>
                  {faculties.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t("account_type")}</label>
              <div className="flex gap-4">
                {["student", "teacher"].map((role) => (
                  <button key={role} type="button" onClick={() => setFormData({...formData, role})} className={`flex-1 rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest transition-all ${formData.role === role ? "bg-slate-900 text-white shadow-xl scale-105" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}>
                    {role === "student" ? t("student_default") : t("professor")}
                  </button>
                ))}
              </div>
            </div>

            {formData.role === "student" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t("select_semester")}</label>
                <select required className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none" value={formData.classLevel} onChange={(e) => setFormData({...formData, classLevel: e.target.value})}>
                  <option value="">{t("select_semester")}</option>
                  {(faculties.find((f) => f._id === formData.faculty)?.semesters || Array.from({length:8}, (_,i)=>`Semester ${i+1}`)).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t("password")}</label>
              <input type="password" required className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all" placeholder="At least 8 characters" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>

            {error && <div className="rounded-2xl bg-rose-50 p-4 text-[10px] font-black text-rose-600 border border-rose-100 uppercase tracking-widest">{error}</div>}

            <button disabled={loading} type="submit" className="w-full rounded-2xl bg-emerald-600 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl transition-all hover:bg-slate-900 hover:-translate-y-1 active:scale-95 disabled:opacity-50">
              {loading ? "..." : t("register_now")}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
            {t("already_have_account")}{" "}
            <button type="button" onClick={() => navigate("/login")} className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">{t("login")}</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
