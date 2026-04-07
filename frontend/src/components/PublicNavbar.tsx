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
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: t("home"), path: "/" },
    { label: t("nav_about"), path: "/about" },
    { label: t("nav_contact"), path: "/contact" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`sticky top-0 z-[100] transition-all duration-300 ${
      isScrolled 
        ? "border-b border-slate-100 bg-white shadow-sm" 
        : "bg-white md:bg-transparent"
    }`}>
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <header className="relative flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate("/")}>
            <img
              src={logo}
              alt="SIMAD University"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-slate-200 object-cover shadow-sm"
            />
            <div className="hidden sm:block">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">
                SIMAD University
              </p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 mt-0.5">{t("academic_hub")}</p>
            </div>
          </div>
          
          {/* Centered Navigation Links (Desktop) */}
          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button 
                key={link.path}
                onClick={() => handleNavigate(link.path)} 
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-2 sm:gap-4">
            <select 
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 sm:px-4 sm:py-2 text-[10px] font-black uppercase text-slate-500 outline-none hover:border-emerald-200 transition-colors shadow-sm"
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="so">SO</option>
              <option value="ar">AR</option>
            </select>

            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => handleNavigate("/login")}
                className="rounded-full border border-slate-200 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all"
              >
                {t("login")}
              </button>
              <button
                onClick={() => handleNavigate("/register")}
                className="rounded-full bg-slate-900 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
              >
                {t("get_started")}
              </button>
            </div>

            {/* Mobile Menu Toggle - Only visible on small/medium screens */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex lg:hidden h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-all hover:bg-emerald-600 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Slide-over Menu */}
        <div className={`fixed inset-0 z-[110] transition-all duration-500 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}>
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-4/5 bg-white p-8 sm:p-12 shadow-[0_0_80px_rgba(0,0,0,0.15)] flex flex-col">
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-3">
                <img src={logo} className="h-10 w-10 rounded-full border border-slate-100 shadow-sm" alt="" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-900">SIMAD Uni</p>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-rose-500 transition-colors"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <nav className="flex flex-col gap-8 flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">Navigation</p>
              {navLinks.map((link) => (
                <button 
                  key={link.path}
                  onClick={() => handleNavigate(link.path)} 
                  className="text-left text-2xl font-black uppercase tracking-tight text-slate-900 hover:text-emerald-600 transition-all hover:translate-x-2"
                >
                  {link.label}
                </button>
              ))}
              
              <div className="mt-auto space-y-4 pt-10 border-t border-slate-50">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Account</p>
                <button 
                  onClick={() => handleNavigate("/login")}
                  className="w-full text-left text-xl font-black uppercase tracking-tight text-slate-700 hover:text-emerald-600 transition-all"
                >
                  {t("login")}
                </button>
                <button 
                  onClick={() => handleNavigate("/register")}
                  className="w-full rounded-2xl bg-slate-900 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-emerald-600 transition-all shadow-2xl mt-4"
                >
                  {t("get_started")}
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicNavbar;
