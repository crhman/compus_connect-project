import React, { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  attendees?: string[];
}

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState<EventItem | null>(null);

  const loadEvents = () => {
    api.get("/events").then((res) => setEvents(res.data)).catch(() => undefined);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleJoin = async (id: string) => {
    try {
      await api.post(`/events/${id}/join`);
      loadEvents();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Faculty events</h3>
        <p className="text-sm text-slate-500">Filtered automatically by your faculty.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <button
            type="button"
            key={event._id}
            onClick={() => setSelected(event)}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-200"
          >
            <h4 className="text-lg font-semibold text-slate-900">{event.title}</h4>
            <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>
            <p className="mt-4 text-xs text-slate-400">
              {new Date(event.date).toLocaleString()}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Attendees: {event.attendees?.length || 0}
              </span>
              {user?.role === "student" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoin(event._id);
                  }}
                  className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white"
                >
                  {event.attendees?.includes(user.id) ? "Joined" : "Join Event"}
                </button>
              )}
            </div>
          </button>
        ))}
        {events.length === 0 && <p className="text-sm text-slate-500">No events found.</p>}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-xl font-semibold text-slate-900">{selected.title}</h4>
                <p className="text-xs text-slate-500">{new Date(selected.date).toLocaleString()}</p>
              </div>
              <button
                type="button"
                className="text-xs text-slate-500"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-600 whitespace-pre-line">
              {selected.description || "No description provided."}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Attendees: {selected.attendees?.length || 0}
              </span>
              {user?.role === "student" && (
                <button
                  onClick={() => handleJoin(selected._id)}
                  className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white"
                >
                  {selected.attendees?.includes(user.id) ? "Joined" : "Join Event"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
