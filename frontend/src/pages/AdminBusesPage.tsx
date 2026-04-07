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

interface ScheduleItem {
  _id: string;
  bus: string;
  date: string;
  time: string;
  capacity: number;
  price: number;
  booked?: number;
  spotsLeft?: number;
}

interface BookingItem {
  _id: string;
  status: string;
  amount: number;
  paymentMethod?: string;
  student?: { name: string; email: string; phone?: string };
  bus?: { name: string; from: string; to: string };
  schedule?: { date: string; time: string; price: number };
}

const AdminBusesPage: React.FC = () => {
  const [faculties, setFaculties] = useState<FacultyItem[]>([]);
  const [buses, setBuses] = useState<BusItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);

  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [schedule, setSchedule] = useState("");
  const [faculty, setFaculty] = useState("");
  const [editing, setEditing] = useState<BusItem | null>(null);

  const [scheduleBusId, setScheduleBusId] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleCapacity, setScheduleCapacity] = useState(30);
  const [schedulePrice, setSchedulePrice] = useState(0);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);

  const load = () => {
    api.get("/faculties").then((res) => setFaculties(res.data)).catch(() => undefined);
    api.get("/buses").then((res) => setBuses(res.data)).catch(() => undefined);
    api.get("/buses/bookings").then((res) => setBookings(res.data)).catch(() => undefined);
  };

  const loadSchedules = (busId: string) => {
    if (!busId) {
      setSchedules([]);
      return;
    }
    api.get(`/buses/${busId}/schedules`)
      .then((res) => setSchedules(res.data))
      .catch(() => undefined);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    loadSchedules(scheduleBusId);
  }, [scheduleBusId]);

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

  const handleCreateSchedule = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!scheduleBusId) return;
    await api.post(`/buses/${scheduleBusId}/schedules`, {
      date: scheduleDate,
      time: scheduleTime,
      capacity: scheduleCapacity,
      price: schedulePrice
    });
    setScheduleDate("");
    setScheduleTime("");
    setScheduleCapacity(30);
    setSchedulePrice(0);
    loadSchedules(scheduleBusId);
  };

  const handleUpdateSchedule = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingSchedule) return;
    await api.put(`/buses/schedules/${editingSchedule._id}`, {
      date: editingSchedule.date,
      time: editingSchedule.time,
      capacity: editingSchedule.capacity,
      price: editingSchedule.price
    });
    setEditingSchedule(null);
    loadSchedules(scheduleBusId);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    await api.delete(`/buses/schedules/${scheduleId}`);
    loadSchedules(scheduleBusId);
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
          className="mt-4 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
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

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-slate-900">Bus schedules</h4>
        <form onSubmit={handleCreateSchedule} className="mt-4 grid gap-3 md:grid-cols-5">
          <select
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            value={scheduleBusId}
            onChange={(event) => setScheduleBusId(event.target.value)}
            required
          >
            <option value="">Select bus</option>
            {buses.map((bus) => (
              <option key={bus._id} value={bus._id}>
                {bus.name} ({bus.from} - {bus.to})
              </option>
            ))}
          </select>
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            type="date"
            value={scheduleDate}
            onChange={(event) => setScheduleDate(event.target.value)}
            required
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            type="time"
            value={scheduleTime}
            onChange={(event) => setScheduleTime(event.target.value)}
            required
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            type="number"
            min={1}
            value={scheduleCapacity}
            onChange={(event) => setScheduleCapacity(Number(event.target.value))}
            placeholder="Capacity"
            required
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            type="number"
            min={0}
            value={schedulePrice}
            onChange={(event) => setSchedulePrice(Number(event.target.value))}
            placeholder="Price"
            required
          />
          <button
            type="submit"
            className="md:col-span-5 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
          >
            Add schedule
          </button>
        </form>

        {editingSchedule && (
          <form onSubmit={handleUpdateSchedule} className="mt-4 grid gap-3 md:grid-cols-5">
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              type="date"
              value={editingSchedule.date}
              onChange={(event) => setEditingSchedule({ ...editingSchedule, date: event.target.value })}
              required
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              type="time"
              value={editingSchedule.time}
              onChange={(event) => setEditingSchedule({ ...editingSchedule, time: event.target.value })}
              required
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              type="number"
              min={1}
              value={editingSchedule.capacity}
              onChange={(event) =>
                setEditingSchedule({ ...editingSchedule, capacity: Number(event.target.value) })
              }
              required
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              type="number"
              min={0}
              value={editingSchedule.price}
              onChange={(event) =>
                setEditingSchedule({ ...editingSchedule, price: Number(event.target.value) })
              }
              required
            />
            <div className="flex gap-2 md:col-span-5">
              <button
                type="submit"
                className="rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Save schedule
              </button>
              <button
                type="button"
                onClick={() => setEditingSchedule(null)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-xs text-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 grid gap-3">
          {schedules.map((scheduleItem) => (
            <div key={scheduleItem._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(scheduleItem.date).toLocaleDateString()} at {scheduleItem.time}
                  </p>
                  <p className="text-xs text-slate-500">
                    Capacity: {scheduleItem.capacity} · Price: ${scheduleItem.price}
                  </p>
                  <p className="text-xs text-slate-400">
                    Booked: {scheduleItem.booked ?? 0} · Spots left: {scheduleItem.spotsLeft ?? 0}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                    onClick={() =>
                      setEditingSchedule({
                        ...scheduleItem,
                        date: new Date(scheduleItem.date).toISOString().slice(0, 10)
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-full border border-rose-200 px-3 py-1 text-xs text-rose-600"
                    onClick={() => handleDeleteSchedule(scheduleItem._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {scheduleBusId && schedules.length === 0 && (
            <p className="text-sm text-slate-500">No schedules yet.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-slate-900">Bus bookings</h4>
        <div className="mt-4 grid gap-3">
          {bookings.map((booking) => (
            <div key={booking._id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {booking.student?.name || "Student"}
                  </p>
                  <p className="text-xs text-slate-500">{booking.student?.email}</p>
                  <p className="text-xs text-slate-400">{booking.student?.phone || "No phone"}</p>
                </div>
                <div className="text-xs text-slate-500">
                  <p>
                    {booking.bus?.name} · {booking.bus?.from} → {booking.bus?.to}
                  </p>
                  <p>
                    {booking.schedule?.date
                      ? new Date(booking.schedule.date).toLocaleDateString()
                      : ""} {booking.schedule?.time}
                  </p>
                  <p>
                    Amount: ${booking.amount} · {booking.paymentMethod || "-"}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
          {bookings.length === 0 && <p className="text-sm text-slate-500">No bookings yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminBusesPage;
