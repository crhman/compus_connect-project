import React, { useEffect, useState } from "react";
import api from "../api/client";

interface FacultyItem {
  _id: string;
  name: string;
}

interface BusItem {
  _id: string;
  name: string;
  from: string;
  to: string;
  schedule?: string;
  faculty: string;
}

const AdminBusesPage: React.FC = () => {
  const [faculties, setFaculties] = useState<FacultyItem[]>([]);
  const [buses, setBuses] = useState<BusItem[]>([]);
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [schedule, setSchedule] = useState("");
  const [faculty, setFaculty] = useState("");
  const [editing, setEditing] = useState<BusItem | null>(null);

  const load = () => {
    api.get("/faculties").then((res) => setFaculties(res.data)).catch(() => undefined);
    api.get("/buses").then((res) => setBuses(res.data)).catch(() => undefined);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    await api.post("/buses", { name, from, to, schedule, faculty });
    setName("");
    setFrom("");
    setTo("");
    setSchedule("");
    setFaculty("");
    load();
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    await api.put(`/buses/${editing._id}`, {
      name: editing.name,
      from: editing.from,
      to: editing.to,
      schedule: editing.schedule,
      faculty: editing.faculty
    });
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/buses/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-900">Buses</h3>
      <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3 md:grid-cols-5">
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="Bus name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="From"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            required
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="To"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            required
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="Schedule (optional)"
            value={schedule}
            onChange={(event) => setSchedule(event.target.value)}
          />
          <select
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            value={faculty}
            onChange={(event) => setFaculty(event.target.value)}
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
        <button
          type="submit"
          className="mt-4 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"
        >
          Add bus
        </button>
      </form>
      {editing && (
        <form onSubmit={handleUpdate} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-3 md:grid-cols-5">
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={editing.name}
              onChange={(event) => setEditing({ ...editing, name: event.target.value })}
              placeholder="Bus name"
              required
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={editing.from}
              onChange={(event) => setEditing({ ...editing, from: event.target.value })}
              placeholder="From"
              required
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={editing.to}
              onChange={(event) => setEditing({ ...editing, to: event.target.value })}
              placeholder="To"
              required
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={editing.schedule || ""}
              onChange={(event) => setEditing({ ...editing, schedule: event.target.value })}
              placeholder="Schedule (optional)"
            />
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={editing.faculty}
              onChange={(event) => setEditing({ ...editing, faculty: event.target.value })}
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
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-xs text-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="grid gap-3">
        {buses.map((bus) => (
          <div key={bus._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{bus.name}</p>
                <p className="text-xs text-slate-500">
                  {bus.from} - {bus.to}
                </p>
                {bus.schedule && <p className="text-xs text-slate-400">{bus.schedule}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                  onClick={() => setEditing(bus)}
                >
                  Edit
                </button>
                <button
                  className="rounded-full border border-rose-200 px-3 py-1 text-xs text-rose-600"
                  onClick={() => handleDelete(bus._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {buses.length === 0 && <p className="text-sm text-slate-500">No buses yet.</p>}
      </div>
    </div>
  );
};

export default AdminBusesPage;
