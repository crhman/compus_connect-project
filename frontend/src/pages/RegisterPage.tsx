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
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[36px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.15)] lg:grid-cols-[1.1fr_1fr]">
        <div className="relative flex flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-400 p-10 text-white">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="SIMAD University logo"
                className="h-10 w-10 rounded-full border border-white/40 object-cover"
              />
              <div>
                <p className="text-sm font-semibold">SIMAD University</p>
                <p className="text-xs text-indigo-100">Academic Hub</p>
              </div>
            </div>

            <h1 className="mt-10 text-3xl font-semibold leading-tight">
              Empowering the next generation of leaders.
            </h1>
            <p className="mt-4 text-sm text-indigo-100">
              Join the Academic Hub to access personalized schedules, tutoring collaboration,
              and campus-wide events.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "Academic integrity verified",
              "Collaborative learning spaces",
              "Secure faculty access"
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-xs">CC</span>
                {item}
              </div>
            ))}
          </div>

          <div className="text-sm text-indigo-100">SIMAD Life - Safe Work</div>
        </div>

        <div className="p-10">
          <h2 className="text-2xl font-semibold text-slate-900">Create an account</h2>
          <p className="mt-2 text-sm text-slate-500">Join our vibrant academic community today.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-500">Full name</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                placeholder="Jane Doe"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500">University email</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                placeholder="jane.doe@campus.edu"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500">Phone / WhatsApp</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                placeholder="+252 61 234 5678"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500">Academic role</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {["student", "teacher"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${
                      role === item
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-200 text-slate-500"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {role === "student" && (
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Class level</label>
                <select
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
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
              <label className="text-[11px] font-semibold text-slate-500">Faculty</label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
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

            <div>
              <label className="text-[11px] font-semibold text-slate-500">Password</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
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
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-xs font-semibold text-white"
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
