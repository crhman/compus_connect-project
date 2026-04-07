import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import logo from "../assets/logo.jpg";
import api from "../api/client";

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<{ type: "success" | "error" | null, msg: string }>({ type: null, msg: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      await api.post("/contact", formData);
      setStatus({ type: "success", msg: t("message_sent_success", "Your message has been sent successfully!") });
      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      setStatus({ type: "error", msg: error.response?.data?.message || "Failed to send message. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicNavbar />

      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Contact Info */}
            <div className="space-y-12 text-left">
              <div className="space-y-6">
                <h1 className="text-5xl font-black tracking-tight text-slate-900">{t("contact_title")}</h1>
                <p className="text-lg text-slate-500 leading-relaxed max-w-md">
                  {t("contact_desc")}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-6 rounded-3xl bg-slate-50 space-y-3">
                  <div className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest">{t("email_address")}</div>
                  <p className="font-bold text-slate-900">info@simad.edu.so</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 space-y-3">
                  <div className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest">{t("phone_number")}</div>
                  <p className="font-bold text-slate-900">+252 61 000 000</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 col-span-2 space-y-3">
                  <div className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest">{t("contact_info")}</div>
                  <p className="font-bold text-slate-900">{t("contact_office")}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-12 shadow-2xl shadow-slate-200/50">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {status.type && (
                  <div className={`p-4 rounded-2xl text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {status.msg}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t("full_name")}</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm focus:border-emerald-500 focus:outline-none transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t("email_address")}</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm focus:border-emerald-500 focus:outline-none transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t("bio_info")}</label>
                  <textarea 
                    required
                    rows={4} 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm focus:border-emerald-500 focus:outline-none transition-colors" 
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full rounded-2xl bg-slate-900 py-5 text-sm font-black uppercase tracking-widest text-white hover:bg-emerald-600 transition-colors shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "..." : t("contact_form_send")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 text-slate-900 border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center space-y-6">
          <img src={logo} className="mx-auto h-16 w-16 rounded-full border border-slate-200" alt="" />
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tighter text-slate-900">SIMAD UNIVERSITY</h3>
            <p className="text-sm font-medium uppercase tracking-[0.4em] text-emerald-600">{t("academic_hub")}</p>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm font-bold text-slate-400">
            <button onClick={() => navigate("/about")} className="hover:text-emerald-600 transition-colors">{t("nav_about")}</button>
            <button onClick={() => navigate("/contact")} className="hover:text-emerald-600 transition-colors">{t("nav_contact")}</button>
          </div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 pt-8 border-t border-slate-50 italic">© 2026 SIMAD UNIVERSITY. {t("total")} rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
