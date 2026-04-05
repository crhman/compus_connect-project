import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.jpg";
import logo from "../assets/logo.jpg";

const ecosystem = [
  {
    title: "Smart Scheduling",
    description:
      "Automate class bookings with AI conflict resolution and direct faculty access.",
    icon: "SS"
  },
  {
    title: "Group Collaboration",
    description: "Build study rooms and mentor circles with role-based visibility.",
    icon: "GC"
  },
  {
    title: "Faculty Access",
    description: "Instantly reach tutors and advisors inside your department.",
    icon: "FA"
  },
  {
    title: "Campus Insights",
    description: "Track engagement trends, outcomes, and faculty performance.",
    icon: "CI"
  }
];

const facultyCards = [
  {
    name: "Faculty of Applied Sciences",
    subtitle: "Engineering, data, and innovation"
  },
  {
    name: "School of Medicine",
    subtitle: "Clinical excellence and research"
  },
  {
    name: "Department of Economics",
    subtitle: "Finance, policy, and analytics"
  }
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="SIMAD University logo"
              className="h-10 w-10 rounded-full border border-slate-200 object-cover"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                SIMAD University
              </p>
              <p className="text-[11px] text-slate-400">Academic Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
            >
              Get Started
            </button>
          </div>
        </header>

        <section className="mt-16 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400">
              New academic era 2026
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Empowering your
              <span className="block text-indigo-600">academic journey.</span>
            </h1>
            <p className="max-w-xl text-sm text-slate-600">
              Unify the university experience with intelligent workflows designed for modern
              scholars. From attendance to tutoring, your future starts here.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/register")}
                className="rounded-full bg-indigo-600 px-6 py-3 text-xs font-semibold text-white"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="rounded-full border border-indigo-200 bg-white px-6 py-3 text-xs font-semibold text-indigo-600"
              >
                Login
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-indigo-200/60 blur-3xl" />
            <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-emerald-200/60 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_35px_90px_rgba(15,23,42,0.15)]">
              <img
                src={heroImage}
                alt="Students collaborating"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      </div>

      <section className="bg-slate-100 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Core Ecosystem</h2>
              <p className="text-sm text-slate-500">Tools engineered for academic excellence.</p>
            </div>
            <div className="h-[2px] w-16 rounded-full bg-indigo-400" />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {ecosystem.map((item) => (
              <div key={item.title} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-xs text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-900">Connect with Excellence</h2>
            <p className="text-sm text-slate-500">Partner with leading academies in your field.</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {facultyCards.map((card) => (
              <div key={card.name} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="h-32 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-600" />
                <h3 className="mt-4 text-sm font-semibold text-slate-900">{card.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{card.subtitle}</p>
                <button className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-indigo-600">
                  View Department
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
