import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PublicNavbar from "../components/PublicNavbar";
import logo from "../assets/logo.jpg";
import mainCampus from "../assets/main compus.jpeg";
import cultural1 from "../assets/calcural.jpeg";
import cultural2 from "../assets/calcural2.jpeg";
import election from "../assets/election.jpeg";

const sliderImages = [mainCampus, cultural1, cultural2, election];

const ecosystem = [
  { title: "smart_scheduling", description: "scheduling_desc", icon: "SS" },
  { title: "group_collaboration", description: "collaboration_desc", icon: "GC" },
  { title: "faculty_access", description: "faculty_desc", icon: "FA" },
  { title: "campus_insights", description: "insights_desc", icon: "CI" }
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null);

  const departments = [
    {
      name: "Faculty of Applied Sciences",
      subtitle: "Engineering, data, and innovation",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
      description: "Our Faculty of Applied Sciences is at the forefront of technological innovation.",
      gallery: [
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&q=80",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80",
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80"
      ]
    },
    {
      name: "School of Medicine",
      subtitle: "Clinical excellence and research",
      image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80",
      description: "Preparing the next generation of healthcare leaders.",
      gallery: [
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80",
        "https://images.unsplash.com/photo-1559839734-2b71f153671f?w=400&q=80",
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80"
      ]
    },
    {
      name: "Department of Economics",
      subtitle: "Finance, policy, and analytics",
      image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80",
      description: "Understanding the global market and local economic trends.",
      gallery: [
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&q=80",
        "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=400&q=80",
        "https://images.unsplash.com/photo-1454165833965-adc294e927a7?w=400&q=80"
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicNavbar />
      
      <section className="relative min-h-[500px] w-full overflow-hidden bg-slate-900 text-white shadow-2xl sm:min-h-[650px]">
        <div className="absolute inset-0 z-0">
          {sliderImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/50 to-transparent" />
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 flex h-full items-center">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">
                {t("new_academic_era")}
              </p>
              <h1 className="text-5xl font-black leading-[0.9] text-white sm:text-7xl lg:text-8xl tracking-tighter">
                {t("empowering_journey")}
                <span className="block text-emerald-500">{t("academic_journey")}</span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-slate-300 font-medium sm:text-xl">
                {t("hero_description")}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/register")}
                className="rounded-full bg-emerald-600 px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl transition-all hover:bg-emerald-700 hover:-translate-y-1 active:scale-95"
              >
                {t("get_started")}
              </button>
              <button
                onClick={() => navigate("/about")}
                className="rounded-full border-2 border-white/20 bg-white/10 px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-white hover:text-slate-900 active:scale-95"
              >
                {t("read_more")}
              </button>
            </div>
          </div>
        </div>

        <button onClick={() => setCurrentSlide(prev => (prev - 1 + sliderImages.length) % sliderImages.length)} className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-md hover:bg-white hover:text-slate-900 lg:left-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <button onClick={() => setCurrentSlide(prev => (prev + 1) % sliderImages.length)} className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-md hover:bg-white hover:text-slate-900 lg:right-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>

        <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {sliderImages.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "w-12 bg-emerald-500" : "w-3 bg-white/40 hover:bg-white/60"}`} />
          ))}
        </div>
      </section>

      <section className="bg-slate-100 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{t("core_ecosystem")}</h2>
              <p className="text-lg text-slate-500">{t("tools_excellence")}</p>
            </div>
            <div className="h-1.5 w-24 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {ecosystem.map((item) => (
              <div key={item.title} className="group rounded-3xl bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-xl font-bold text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">{item.icon}</div>
                <h3 className="mt-6 text-lg font-bold text-slate-900">{t(item.title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{t(item.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">{t("connect_excellence")}</h2>
            <p className="text-lg text-slate-500">{t("partner_academies")}</p>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {departments.map((card) => (
              <div key={card.name} className="flex flex-col group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-2xl">
                <div className="h-56 overflow-hidden rounded-2xl">
                  <img src={card.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">{card.name}</h3>
                <p className="mt-2 text-sm text-slate-500">{card.subtitle}</p>
                <button onClick={() => setSelectedFaculty(card)} className="mt-6 w-full rounded-2xl border-2 border-slate-100 px-6 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all">{t("view_department")}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedFaculty && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedFaculty(null)} />
          <div className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in duration-300">
            <div className="grid lg:grid-cols-2 h-full">
              <div className="h-64 lg:h-full"><img src={selectedFaculty.image} className="h-full w-full object-cover" alt="" /></div>
              <div className="p-8 sm:p-12 space-y-6 overflow-y-auto max-h-[90vh]">
                <button onClick={() => setSelectedFaculty(null)} className="absolute right-6 top-6 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h3 className="text-3xl font-extrabold text-slate-900">{selectedFaculty.name}</h3>
                <p className="text-lg font-medium text-emerald-600">{selectedFaculty.subtitle}</p>
                <p className="text-slate-600 leading-relaxed">{selectedFaculty.description}</p>
                <div className="pt-6">
                  <h4 className="font-bold text-slate-900 mb-4">Department Gallery</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedFaculty.gallery.map((img: string, i: number) => (
                      <img key={i} src={img} className="h-24 w-full rounded-xl object-cover border border-slate-100 shadow-sm" alt="" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white py-12 text-slate-900 border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center space-y-6">
          <div className="flex flex-col items-center gap-4">
            <img src={logo} className="h-16 w-16 rounded-full border border-slate-200 shadow-sm" alt="Logo" />
            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tighter">SIMAD UNIVERSITY</h3>
              <p className="text-sm font-medium uppercase tracking-[0.4em] text-emerald-600">{t("academic_hub")}</p>
            </div>
          </div>
          <p className="max-w-xl mx-auto text-sm text-slate-500 italic">{t("hero_description")}</p>
          <div className="flex items-center justify-center gap-8 text-sm font-bold text-slate-400">
            <button key="about" onClick={() => navigate("/about")} className="hover:text-emerald-600 transition-colors">{t("nav_about")}</button>
            <button key="contact" onClick={() => navigate("/contact")} className="hover:text-emerald-600 transition-colors">{t("nav_contact")}</button>
          </div>
          <p className="pt-8 border-t border-slate-50 text-[10px] font-medium uppercase tracking-widest text-slate-400">© 2026 SIMAD UNIVERSITY. {t("total")} rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
