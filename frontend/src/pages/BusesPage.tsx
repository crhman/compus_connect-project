import React, { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface BusRoute {
  _id: string;
  name: string;
  from: string;
  to: string;
}

interface ScheduleItem {
  _id: string;
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
  bus?: { name: string; from: string; to: string };
  schedule?: { _id: string; date: string; time: string; price: number };
}

const BusesPage: React.FC = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [selectedBus, setSelectedBus] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const bookedScheduleIds = useMemo(() => {
    return new Set(
      bookings
        .filter((booking) => ["pending", "paid"].includes(booking.status))
        .map((booking) => booking.schedule?._id)
        .filter(Boolean) as string[]
    );
  }, [bookings]);

  const loadRoutes = () => {
    api.get("/buses/routes")
      .then((res) => setRoutes(res.data))
      .catch(() => undefined);
  };

  const loadBookings = () => {
    api.get("/buses/bookings/my")
      .then((res) => setBookings(res.data))
      .catch(() => undefined);
  };

  const loadSchedules = () => {
    if (!selectedBus) {
      setSchedules([]);
      return;
    }
    setLoadingSchedules(true);
    api.get(`/buses/${selectedBus}/schedules`, { params: { date } })
      .then((res) => setSchedules(res.data))
      .catch(() => undefined)
      .finally(() => setLoadingSchedules(false));
  };

  useEffect(() => {
    loadRoutes();
    loadBookings();
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [selectedBus, date]);

  const handleBook = async (scheduleId: string, price: number) => {
    setMessage(null);
    if (price > 0 && !paymentMethod) {
      setMessage("Select a payment method first.");
      return;
    }
    try {
      await api.post("/buses/bookings", { scheduleId, paymentMethod });
      loadSchedules();
      loadBookings();
      setMessage("Booking created. Complete payment to confirm.");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Unable to book this schedule");
    }
  };

  const handlePay = async (bookingId: string) => {
    setMessage(null);
    try {
      await api.post(`/buses/bookings/${bookingId}/pay`, { paymentMethod });
      loadBookings();
      loadSchedules();
      setMessage("Payment confirmed.");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Payment failed");
    }
  };

  const handleCancel = async (bookingId: string) => {
    setMessage(null);
    try {
      await api.post(`/buses/bookings/${bookingId}/cancel`);
      loadBookings();
      loadSchedules();
      setMessage("Booking cancelled.");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Unable to cancel booking");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">Campus buses</h3>
          <p className="text-sm text-slate-500">Reserve a seat for your route.</p>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 shadow-sm">
          {user?.classLevel ? `Student: ${user.classLevel}` : "Student routes"}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <select
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            value={selectedBus}
            onChange={(event) => setSelectedBus(event.target.value)}
          >
            <option value="">Select route</option>
            {routes.map((route) => (
              <option key={route._id} value={route._id}>
                {route.name} ({route.from} → {route.to})
              </option>
            ))}
          </select>
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
          <select
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
          >
            <option value="mobile_money">Mobile Money</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
          </select>
          <button
            type="button"
            onClick={loadSchedules}
            className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
          >
            Check schedules
          </button>
        </div>
        {message && <p className="mt-3 text-xs text-emerald-600">{message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loadingSchedules && <p className="text-sm text-slate-500">Loading schedules...</p>}
        {!loadingSchedules && schedules.length === 0 && (
          <p className="text-sm text-slate-500">No schedules found for the selected date.</p>
        )}
        {schedules.map((scheduleItem) => {
          const isBooked = bookedScheduleIds.has(scheduleItem._id);
          const spotsLeft = scheduleItem.spotsLeft ?? 0;
          const isFull = spotsLeft <= 0;
          return (
            <div
              key={scheduleItem._id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(scheduleItem.date).toLocaleDateString()} · {scheduleItem.time}
                  </p>
                  <p className="text-xs text-slate-500">Capacity: {scheduleItem.capacity}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  ${scheduleItem.price}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{isFull ? "Bus full" : `${spotsLeft} spots left`}</span>
                <span>{scheduleItem.booked ?? 0} booked</span>
              </div>
              <button
                type="button"
                onClick={() => handleBook(scheduleItem._id, scheduleItem.price)}
                disabled={isFull || isBooked}
                className={`mt-4 w-full rounded-2xl px-4 py-2 text-xs font-semibold shadow-sm transition ${
                  isFull || isBooked
                    ? "bg-slate-200 text-slate-500"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {isBooked ? "Booked" : isFull ? "Full" : "Book seat"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-slate-900">My bus bookings</h4>
        <div className="mt-4 grid gap-3">
          {bookings.map((booking) => (
            <div key={booking._id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {booking.bus?.name} · {booking.bus?.from} → {booking.bus?.to}
                  </p>
                  <p className="text-xs text-slate-500">
                    {booking.schedule?.date
                      ? new Date(booking.schedule.date).toLocaleDateString()
                      : ""} {booking.schedule?.time}
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  Amount: ${booking.amount} · {booking.paymentMethod || "-"}
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  {booking.status}
                </span>
              </div>
              {booking.status === "pending" && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white"
                    onClick={() => handlePay(booking._id)}
                  >
                    Pay now
                  </button>
                  <button
                    className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600"
                    onClick={() => handleCancel(booking._id)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              {booking.status === "paid" && (
                <div className="mt-3">
                  <button
                    className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600"
                    onClick={() => handleCancel(booking._id)}
                  >
                    Cancel booking
                  </button>
                </div>
              )}
            </div>
          ))}
          {bookings.length === 0 && <p className="text-sm text-slate-500">No bookings yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default BusesPage;
