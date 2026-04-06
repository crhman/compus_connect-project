import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpg";

interface FacultyItem {
  _id: string;
  name: string;
  semesters?: string[];
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [faculties, setFaculties] = useState<FacultyItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [faculty, setFaculty] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/faculties")
      .then((res) => setFaculties(res.data))
      .catch(() => undefined);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
        role,
        faculty,
        classLevel: role === "student" ? classLevel : undefined
      });
      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute -top-24 left-10 h-48 w-48 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur lg:grid-cols-[1.05fr_1fr]">
        <div className="relative flex flex-col justify-between gap-10 bg-gradient-to-br from-indigo-600 via-sky-600 to-emerald-500 p-8 text-white sm:p-10">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="SIMAD University logo"
                className="h-10 w-10 rounded-full border border-white/40 object-cover"
              />
              <div>
                <p className="text-sm font-semibold">SIMAD University</p>
                <p className="text-xs text-white/70">Academic Hub</p>
              </div>
            </div>

            <h1 className="mt-10 text-3xl font-semibold leading-tight sm:text-4xl">
              Build your academic future with confidence.
            </h1>
            <p className="mt-4 text-sm text-white/80">
              Create your SIMAD account to access tutoring, class groups, events, and smart
              scheduling in one secure portal.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Verified academic identity",
              "Faculty-only communities",
              "Instant tutor access",
              "Secure campus workflows"
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-[10px]">
                  SIM
                </span>
                {item}
              </div>
            ))}
          </div>

          <div className="text-xs text-white/70">SIMAD Life - Safe Work</div>
        </div>

        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-slate-900">Create your account</h2>
          <p className="mt-2 text-sm text-slate-500">
            Join our academic community with one secure profile.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Full name
              </label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Jane Doe"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                University email
              </label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="jane.doe@campus.edu"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Phone / WhatsApp
                </label>
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="+252 61 234 5678"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Faculty
                </label>
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={faculty}
                  onChange={(event) => {
                    setFaculty(event.target.value);
                    setClassLevel("");
                  }}
                  required
                >
                  <option value="">Select faculty</option>
                  {faculties.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Academic role
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {["student", "teacher"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                      role === item
                        ? "bg-indigo-600 text-white shadow"
                        : "border border-slate-200 text-slate-600 hover:border-indigo-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {role === "student" && (
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Class level
                </label>
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={classLevel}
                  onChange={(event) => setClassLevel(event.target.value)}
                  required
                >
                  <option value="">Select semester</option>
                  {(faculties.find((item) => item._id === faculty)?.semesters?.length
                    ? faculties.find((item) => item._id === faculty)?.semesters
                    : Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`)
                  )?.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Password
              </label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="At least 8 characters"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {error && <p className="text-xs text-rose-500">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-200/60"
            >
              Register account
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-indigo-500"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
