import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpg";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-md flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <img
            src={logo}
            alt="SIMAD University logo"
            className="h-14 w-14 rounded-full border border-slate-200 object-cover"
          />
          <h1 className="text-2xl font-semibold text-slate-900">SIMAD University</h1>
          <p className="text-sm text-slate-500">SIMAD Portal</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">Welcome back</h2>
          <p className="text-xs text-slate-500">Please enter your academic credentials to continue.</p>

          <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            
            <div className="h-px flex-1 bg-slate-200" />
          </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Institutional Email</label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-xs text-slate-400">@</span>
                  <input
                    className="w-full bg-transparent text-sm text-slate-700 outline-none"
                    placeholder="student@campus.edu"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-500">Password</label>
                  <button type="button" className="text-[11px] font-semibold text-indigo-500">
                    Forgot password?
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-xs text-slate-400">*</span>
                  <input
                    className="w-full bg-transparent text-sm text-slate-700 outline-none"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-xs text-rose-500">{error}</p>}

              <label className="flex items-center gap-2 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                Remember this device
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-xs font-semibold text-white"
              >
                Sign In
              </button>
            </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            New to SIMAD?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-semibold text-indigo-500"
            >
              Create student account
            </button>
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 text-[11px] text-slate-400">
          <div className="flex flex-wrap justify-center gap-4">
            <button type="button">Privacy Policy</button>
            <button type="button">Terms of Service</button>
            <button type="button">Help Center</button>
          </div>
          <p>2026 SIMAD University. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
