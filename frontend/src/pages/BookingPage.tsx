import React, { useEffect, useState } from "react";
import api from "../api/client";

interface TeacherItem {
  _id: string;
  name: string;
  subjects: string[];
  availability?: { day: string; from: string; to: string }[];
}

interface BookingItem {
  _id: string;
  time: string;
  status: string;
}

interface SlotItem {
  day: string;
  from: string;
  to: string;
  capacity: number;
  booked: number;
  spotsLeft: number;
}

const BookingPage: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [teacher, setTeacher] = useState("");
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [selectedSlot, setSelectedSlot] = useState<SlotItem | null>(null);
  const [time, setTime] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentWhatsapp, setStudentWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    api.get("/users/teachers").then((res) => setTeachers(res.data)).catch(() => undefined);
    api.get("/bookings").then((res) => setBookings(res.data)).catch(() => undefined);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!teacher || !selectedDate) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }
    api
      .get(`/users/teachers/${teacher}/availability`, { params: { date: selectedDate } })
      .then((res) => {
        setSlots(res.data.slots || []);
        setSelectedSlot(null);
        setTime("");
      })
      .catch(() => {
        setSlots([]);
        setSelectedSlot(null);
        setTime("");
      });
  }, [teacher, selectedDate]);

  const handleBook = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!teacher || !time || !canBook) return;
    try {
      await api.post("/bookings", { teacher, time, studentName, studentWhatsapp });
      setTeacher("");
      setSelectedSlot(null);
      setTime("");
      setStudentName("");
      setStudentWhatsapp("");
      loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Booking failed");
    }
  };

  const canBook =
    !!selectedSlot &&
    selectedSlot.spotsLeft > 0 &&
    studentName.trim().length > 0 &&
    studentWhatsapp.trim().length > 0;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Book tutoring session</h3>
        <form onSubmit={handleBook} className="mt-4 grid gap-4 md:grid-cols-3">
          <select
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            value={teacher}
            onChange={(event) => setTeacher(event.target.value)}
            required
          >
            <option value="">Select teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} - {t.subjects?.join(", ") || "General"}
              </option>
            ))}
          </select>
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            required
          />
          <button
            type="submit"
            disabled={!canBook}
            className={`md:col-span-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
              canBook ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
            }`}
          >
            Request booking
          </button>
        </form>
        {selectedSlot && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              placeholder="Full name"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              required
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              placeholder="WhatsApp number"
              value={studentWhatsapp}
              onChange={(event) => setStudentWhatsapp(event.target.value)}
              required
            />
          </div>
        )}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-700">Teacher availability</p>
            <div className="mt-3 space-y-2">
              {!teacher && <p className="text-xs text-slate-500">Select a teacher first.</p>}
              {teacher && slots.length === 0 && (
                <p className="text-xs text-slate-500">No availability for the selected day.</p>
              )}
              {teacher &&
                slots.map((slot) => {
                  const isSelected = selectedSlot?.from === slot.from && selectedSlot?.to === slot.to;
                  return (
                    <button
                      key={`${slot.day}-${slot.from}`}
                      type="button"
                      disabled={slot.spotsLeft === 0}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setTime(`${selectedDate}T${slot.from}`);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs ${
                        slot.spotsLeft === 0
                          ? "border-slate-200 bg-slate-100 text-slate-400"
                          : isSelected
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
                      }`}
                    >
                      <span>
                        {slot.day} {slot.from}-{slot.to}
                      </span>
                      {slot.spotsLeft > 0 ? (
                        <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] text-indigo-600">
                          Spots left: {slot.spotsLeft}
                        </span>
                      ) : (
                        <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] text-rose-600">
                          Fully booked
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-700">Selected slot status</p>
            <div className="mt-3 text-xs text-slate-500">
              {!selectedSlot && <p>Select a slot to book.</p>}
              {selectedSlot && selectedSlot.spotsLeft === 0 && (
                <p className="text-rose-500">This slot is fully booked. Pick another time.</p>
              )}
              {selectedSlot && selectedSlot.spotsLeft > 0 && (
                <p className="text-indigo-600">
                  {selectedSlot.day} {selectedSlot.from}-{selectedSlot.to} - Spots left: {selectedSlot.spotsLeft}
                </p>
              )}
              {error && <p className="mt-2 text-rose-500">{error}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Your bookings</h3>
        <div className="mt-4 grid gap-3">
          {bookings.map((booking) => (
            <div key={booking._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="text-sm text-slate-900">{new Date(booking.time).toLocaleString()}</p>
                <p className="text-xs text-slate-500">Status: {booking.status}</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-600">
                Faculty isolated
              </span>
            </div>
          ))}
          {bookings.length === 0 && <p className="text-sm text-slate-500">No bookings yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default BookingPage;
