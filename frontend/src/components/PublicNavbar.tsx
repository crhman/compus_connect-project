import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.jpg";

const PublicNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("cc_lang", lang);
  };

  const navLinks = [
    { label: t("home"), path: "/" },
    { label: t("nav_about"), path: "/about" },
    { label: t("nav_contact"), path: "/contact" },
  ];

  return (
    <div className={`sticky top-0 z-[100] transition-all duration-300 ${
      isScrolled 
        ? "border-b border-slate-100 bg-white shadow-sm" 
        : "bg-white md:bg-transparent"
    }`}>
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <header className="relative flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img
              src={logo}
              alt="SIMAD University"
              className="h-10 w-10 rounded-full border border-slate-200 object-cover"
            />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                SIMAD University
              </p>
              <p className="text-[11px] text-slate-400">{t("academic_hub")}</p>
            </div>
          </div>
          
          {/* Centered Navigation Links (Desktop) */}
          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button 
                key={link.path}
                onClick={() => navigate(link.path)} 
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Buttons (Language + Auth) */}
          <div className="flex items-center gap-2 sm:gap-4">
            <select 
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-black uppercase text-slate-500 outline-none hover:border-emerald-200 transition-colors cursor-pointer shadow-sm"
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="so">SO</option>
              <option value="ar">AR</option>
            </select>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-900 text-white transition-all hover:bg-emerald-600 shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Menu */}
        <div className={`fixed inset-0 z-[110] transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-4/5 bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-12">
              <img src={logo} className="h-10 w-10 rounded-full" alt="" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-full bg-slate-50 p-2 text-slate-400"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <button 
                  key={link.path}
                  onClick={() => { navigate(link.path); setIsMobileMenuOpen(false); }} 
                  className="text-left text-lg font-black uppercase tracking-widest text-slate-900 hover:text-emerald-600 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="h-px bg-slate-100 my-4" />
              <button 
                onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}
                className="text-left text-lg font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors"
              >
                {t("login")}
              </button>
              <button 
                onClick={() => { navigate("/register"); setIsMobileMenuOpen(false); }}
                className="mt-4 w-full rounded-2xl bg-slate-900 py-5 text-sm font-black uppercase tracking-widest text-white hover:bg-emerald-600 transition-all shadow-xl"
              >
                {t("get_started")}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicNavbar;
