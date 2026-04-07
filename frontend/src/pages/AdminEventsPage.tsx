import React, { useEffect, useState } from "react";
import api from "../api/client";

interface FacultyItem {
  _id: string;
  name: string;
}

interface EventItem {
  _id: string;
  title: string;
  date: string;
  faculty: string;
  description?: string;
  attendees?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  }[];
}

const AdminEventsPage: React.FC = () => {
  const [faculties, setFaculties] = useState<FacultyItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [faculty, setFaculty] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = () => {
    api.get("/faculties").then((res) => setFaculties(res.data)).catch(() => undefined);
    api.get("/events").then((res) => setEvents(res.data)).catch(() => undefined);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    await api.post("/events", { title, date, faculty, description });
    setTitle("");
    setDate("");
    setFaculty("");
    setDescription("");
    load();
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    await api.put(`/events/${editing._id}`, {
      title: editing.title,
      date: editing.date,
      faculty: editing.faculty,
      description: editing.description
    });
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/events/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-900">Events</h3>
      <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="Event title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <textarea
            className="min-h-[48px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="Event description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            type="datetime-local"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
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
          className="mt-4 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
        >
          Create event
        </button>
      </form>

      {editing && (
        <form onSubmit={handleUpdate} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-3 md:grid-cols-4">
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={editing.title}
              onChange={(event) => setEditing({ ...editing, title: event.target.value })}
              required
            />
            <textarea
              className="min-h-[48px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={editing.description || ""}
              onChange={(event) => setEditing({ ...editing, description: event.target.value })}
              placeholder="Event description"
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              type="datetime-local"
              value={editing.date}
              onChange={(event) => setEditing({ ...editing, date: event.target.value })}
              required
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
              className="rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white"
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
        {events.map((event) => (
          <div key={event._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                {event.description && <p className="text-xs text-slate-500">{event.description}</p>}
                <p className="text-xs text-slate-500">{new Date(event.date).toLocaleString()}</p>
                <p className="text-xs text-slate-400">
                  Attendees: {event.attendees?.length || 0}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                  onClick={() => setExpandedId(expandedId === event._id ? null : event._id)}
                >
                  {expandedId === event._id ? "Hide attendees" : "View attendees"}
                </button>
                <button
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                  onClick={() =>
                    setEditing({
                      ...event,
                      date: new Date(event.date).toISOString().slice(0, 16)
                    })
                  }
                >
                  Edit
                </button>
                <button
                  className="rounded-full border border-rose-200 px-3 py-1 text-xs text-rose-600"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </button>
              </div>
            </div>
            {expandedId === event._id && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                {event.attendees && event.attendees.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {event.attendees.map((attendee) => (
                      <div
                        key={attendee._id}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                      >
                        <p className="text-xs font-semibold text-slate-800">{attendee.name}</p>
                        <p className="text-[11px] text-slate-500">{attendee.email}</p>
                        <p className="text-[11px] text-slate-500">
                          {attendee.phone || "No phone provided"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No attendees yet.</p>
                )}
              </div>
            )}
          </div>
        ))}
        {events.length === 0 && <p className="text-sm text-slate-500">No events yet.</p>}
      </div>
    </div>
  );
};

export default AdminEventsPage;
