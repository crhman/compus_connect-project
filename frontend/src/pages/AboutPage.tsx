import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import logo from "../assets/logo.jpg";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative py-20 bg-slate-50 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center space-y-8">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl">
            {t("about_title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 leading-relaxed italic">
            "Educating for a better future."
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-12 rounded-[2.5rem] bg-emerald-50 space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold">M</div>
              <h2 className="text-3xl font-bold text-slate-900">{t("about_mission")}</h2>
              <p className="text-lg text-slate-600 leading-relaxed">{t("about_mission_desc")}</p>
            </div>
            <div className="p-12 rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl font-bold">V</div>
              <h2 className="text-3xl font-bold text-slate-900">{t("about_vision")}</h2>
              <p className="text-lg text-slate-600 leading-relaxed">{t("about_vision_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-black text-emerald-500">10k+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Students</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-black text-emerald-500">500+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Faculty</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-black text-emerald-500">15+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Departments</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-black text-emerald-500">20k+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Alumni</p>
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

export default AboutPage;
