import React, { useState, useEffect } from "react";
import api from "../api/client";

const TeacherAvailabilityPage: React.FC = () => {
  const [subjects, setSubjects] = useState("");
  const [day, setDay] = useState("Monday");
  const [from, setFrom] = useState("09:00");
  const [to, setTo] = useState("12:00");
  const [availability, setAvailability] = useState<{ day: string; from: string; to: string }[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get("/users/me").then((res) => {
      setSubjects(res.data?.subjects?.join(", ") || "");
      setAvailability(res.data?.availability || []);
    }).catch(console.error);
  }, []);

  const handleSubjects = async () => {
    const list = subjects
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    await api.put("/teacher/subjects", { subjects: list });
  };

  const addSlot = () => {
    setAvailability((prev) => [...prev, { day, from, to }]);
  };

  const saveAvailability = async () => {
    try {
      await api.put("/teacher/availability", { availability });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const removeSlot = (index: number) => {
    setAvailability((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Subjects</h3>
        <p className="text-sm text-slate-500">Comma-separated list.</p>
        <div className="mt-4 flex gap-3">
          <input
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="Math, Physics, Data Science"
            value={subjects}
            onChange={(event) => setSubjects(event.target.value)}
          />
          <button
            onClick={handleSubjects}
            className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
          >
            Save
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Availability</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            value={day}
            onChange={(event) => setDay(event.target.value)}
          >
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            type="time"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            type="time"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
          <button
            type="button"
            onClick={addSlot}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600"
          >
            Add slot
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {availability.map((slot, index) => (
            <div
              key={`${slot.day}-${index}`}
              className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-600"
            >
              <span>{slot.day} {slot.from}-{slot.to}</span>
              <button 
                onClick={() => removeSlot(index)}
                className="hover:text-rose-500 transition-colors"
                title="Remove slot"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={saveAvailability}
            className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Save availability
          </button>
          {success && (
            <span className="text-sm font-medium text-emerald-600 animate-in fade-in duration-300">
              Saved successfully!
            </span>
          )}
        </div>
      </section>
    </div>
  );
};

export default TeacherAvailabilityPage;
