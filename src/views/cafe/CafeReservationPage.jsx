/**
 * CafeReservationPage.jsx  (full rewrite)
 * ─────────────────────────────────────────────────────────
 * Visual table-layout reservation UI:
 *  • Floor-plan grid — each card shows capacity, floor, availability
 *  • Booked tables greyed out for the selected date
 *  • Click any available table to select it
 *  • Guest count capped to table capacity
 *  • QR code per table (links to /table/:id) in a popup modal
 *  • Confirmation modal before saving
 *  • Persists to LocalStorage via LocalDB
 */
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import QRCode from "qrcode";
import { useCustomer } from "../../contexts/CustomerContext";
import { addNotification } from "../../hooks/useNotifications";
import { FRONTEND_DOMAIN } from "../../config/config";
import {
  IconUsers,
  IconArmchair,
  IconQrcode,
  IconX,
  IconCheck,
  IconBuildingSkyscraper,
} from "@tabler/icons-react";
import { getDB, saveDB, TableBookings } from "../../localdb/LocalDB";

// ── Floor accent colours ───────────────────────────────
const FLOOR_COLORS = {
  "Ground Floor": "bg-emerald-50 border-emerald-200",
  "First Floor": "bg-sky-50 border-sky-200",
  Rooftop: "bg-amber-50 border-amber-200",
  "Private Hall": "bg-purple-50 border-purple-200",
};
const FLOOR_HEADER = {
  "Ground Floor": "bg-emerald-600",
  "First Floor": "bg-sky-600",
  Rooftop: "bg-amber-600",
  "Private Hall": "bg-purple-600",
};

function groupByFloor(tables) {
  return tables.reduce((acc, t) => {
    const f = t.floor || "Main Floor";
    (acc[f] = acc[f] || []).push(t);
    return acc;
  }, {});
}

// ── Seat dots visualiser ───────────────────────────────
function SeatDots({ capacity, isSelected, isBooked }) {
  const dots = Math.min(capacity, 8);
  return (
    <div className="flex flex-wrap justify-center gap-1 mt-2">
      {Array.from({ length: dots }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${isBooked ? "bg-red-300" : isSelected ? "bg-white" : "bg-primary/30"}`}
        />
      ))}
      {capacity > 8 && (
        <span
          className={`text-[10px] font-bold ${isSelected ? "text-white/70" : "text-gray-400"}`}
        >
          +{capacity - 8}
        </span>
      )}
    </div>
  );
}

export default function CafeReservationPage() {
  const navigate = useNavigate();
  const { customer } = useCustomer();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [bookedMap, setBookedMap] = useState({}); // tableId → bool
  const [qrTable, setQrTable] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    date: "",
    time: "",
    peopleCount: "2",
    tableId: searchParams.get("tableId") || "",
    notes: "",
    name: customer?.name || "",
    phone: customer?.phone || "",
  });

  // ── Load tables & default date ──────────────────────
  useEffect(() => {
    try {
      const db = getDB();
      setTables(db.store_tables || []);
    } catch (err) {
      console.error(err);
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setForm((prev) => ({
      ...prev,
      date: tomorrow.toISOString().split("T")[0],
      time: "19:00",
    }));
  }, []);

  // Re-compute booked status whenever date or tables change
  useEffect(() => {
    if (!form.date) return;
    const map = {};
    tables.forEach((t) => {
      map[t.id] = TableBookings.isBooked(t.id, form.date);
    });
    setBookedMap(map);
  }, [form.date, tables]);

  // ── Select a table by clicking ───────────────────────
  function handleSelectTable(table) {
    if (bookedMap[table.id]) {
      toast.error(`${table.title} is already fully booked for this date.`);
      return;
    }
    const maxSeats = table.seating_capacity;
    setForm((prev) => ({
      ...prev,
      tableId: String(table.id),
      peopleCount: String(Math.min(parseInt(prev.peopleCount) || 2, maxSeats)),
    }));
    toast.success(`${table.title} selected!`);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // ── Step 1: Validate → show confirmation modal ───────
  function handleReviewSubmit(e) {
    e.preventDefault();
    if (!form.date || !form.time || !form.name || !form.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!form.tableId) {
      toast.error("Please select a table from the layout above.");
      return;
    }
    const sel = tables.find((t) => String(t.id) === form.tableId);
    if (sel && parseInt(form.peopleCount) > sel.seating_capacity) {
      toast.error(`${sel.title} only fits ${sel.seating_capacity} people.`);
      return;
    }
    if (bookedMap[form.tableId]) {
      toast.error(
        "This table is fully booked for the selected date. Please choose another.",
      );
      return;
    }
    setShowConfirm(true);
  }

  // ── Step 2: Save to LocalDB ──────────────────────────
  async function handleConfirm() {
    setLoading(true);
    try {
      const db = getDB();
      db.reservations = db.reservations || [];
      const reservationId = Date.now() + Math.floor(Math.random() * 1000);
      const combinedDateTime = `${form.date}T${form.time}:00`;
      const sel = tables.find((t) => String(t.id) === form.tableId);

      const newReservation = {
        id: reservationId,
        customer_id: customer?.id || "GUEST",
        customer_name: form.name,
        customer_phone: form.phone,
        date: combinedDateTime,
        table_id: form.tableId ? parseInt(form.tableId) : null,
        table_title: sel?.title || "Any Table",
        status: "booked",
        notes: form.notes,
        people_count: parseInt(form.peopleCount),
        unique_code: `RES-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      db.reservations.push(newReservation);
      saveDB(db);

      addNotification({
        userId: "admin",
        forAdmin: true,
        message: `New reservation: ${form.peopleCount} pax for ${form.name} at ${sel?.title} on ${new Date(combinedDateTime).toLocaleString()}`,
        type: "info",
      });
      if (customer?.id) {
        addNotification({
          userId: customer.id,
          message: `Your reservation (${newReservation.unique_code}) for ${form.peopleCount} people on ${new Date(combinedDateTime).toLocaleDateString()} is confirmed!`,
          type: "success",
        });
      }

      toast.success(
        `Reservation confirmed! Code: ${newReservation.unique_code}`,
      );
      setShowConfirm(false);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to book. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Generate QR for a table ─────────────────────────
  async function showTableQR(table, e) {
    e.stopPropagation();
    const host = FRONTEND_DOMAIN || window.location.origin;
    const url = `${host}/table/${table.id}`;
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 280,
        margin: 2,
        color: { dark: "#1a1a1a", light: "#ffffff" },
      });
      setQrDataUrl(dataUrl);
      setQrTable({ ...table, qrUrl: url });
    } catch (err) {
      toast.error("Failed to generate QR code");
    }
  }

  const selectedTable = tables.find((t) => String(t.id) === form.tableId);
  const floorGroups = groupByFloor(tables);

  return (
    <div className="bg-theme-light flex-1">
      <div className="py-12 px-6 md:px-12 xl:px-24 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-bold tracking-widest text-xs mb-4 uppercase">
            Experience Dining
          </p>
          <h1 className="text-5xl font-serif font-bold text-secondary mb-4">
            Reserve a Table
          </h1>
          <p className="text-neutral opacity-70 max-w-2xl mx-auto">
            Pick any available table from the floor plan, fill in your details,
            and your spot is yours.
          </p>
        </div>

        {/* Legend + date selector */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-wrap items-end gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Check Availability For Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="h-11 rounded-xl px-4 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary"
            />
          </div>
          <div className="flex items-center gap-5 text-sm flex-wrap">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-white border-2 border-primary/30 inline-block" />
              Available
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-primary inline-block" />
              Selected
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-400 inline-block" />
              Booked
            </span>
            <span className="flex items-center gap-2">
              <IconQrcode size={16} className="text-gray-500" />
              QR Code
            </span>
          </div>
        </div>

        {/* ── Floor-plan table grid ─────────────── */}
        {Object.entries(floorGroups).map(([floor, floorTables]) => (
          <div key={floor} className="mb-10">
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-bold mb-4 ${FLOOR_HEADER[floor] || "bg-gray-600"}`}
            >
              <IconBuildingSkyscraper size={16} />
              {floor}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {floorTables.map((table) => {
                const isBooked = bookedMap[table.id];
                const isSelected = String(form.tableId) === String(table.id);
                return (
                  <div
                    key={table.id}
                    onClick={() => handleSelectTable(table)}
                    className={`
                      relative group rounded-2xl border-2 p-4 text-center cursor-pointer transition-all duration-200 select-none
                      ${
                        isBooked
                          ? "bg-red-50 border-red-200 opacity-60 cursor-not-allowed"
                          : isSelected
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-[1.04]"
                            : `${FLOOR_COLORS[floor] || "bg-gray-50 border-gray-200"} hover:border-primary/50 hover:shadow-md hover:scale-[1.02]`
                      }
                    `}
                  >
                    {/* QR button */}
                    {!isBooked && (
                      <button
                        className={`absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center transition-colors z-10 ${
                          isSelected
                            ? "bg-white/20 hover:bg-white/30 text-white"
                            : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-400"
                        }`}
                        title="Show QR code for this table"
                        onClick={(e) => showTableQR(table, e)}
                      >
                        <IconQrcode size={14} />
                      </button>
                    )}
                    {isBooked && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        BOOKED
                      </span>
                    )}
                    <p
                      className={`font-bold text-lg mb-1 ${isSelected ? "text-white" : "text-secondary"}`}
                    >
                      {table.title}
                    </p>
                    <div
                      className={`flex items-center justify-center gap-1 text-xs font-semibold mb-1 ${isSelected ? "text-white/80" : "text-gray-500"}`}
                    >
                      <IconUsers size={12} />
                      <span>{table.seating_capacity} seats</span>
                    </div>
                    <SeatDots
                      capacity={table.seating_capacity}
                      isSelected={isSelected}
                      isBooked={isBooked}
                    />
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-primary rounded-full flex items-center justify-center">
                        <IconCheck size={13} className="text-primary" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Selected table banner */}
        {selectedTable && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
              <IconArmchair size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-secondary">
                {selectedTable.title} — {selectedTable.floor}
              </p>
              <p className="text-sm text-gray-500">
                Capacity: {selectedTable.seating_capacity} seats
              </p>
            </div>
            <button
              className="text-gray-400 hover:text-red-400 transition-colors"
              onClick={() => setForm((p) => ({ ...p, tableId: "" }))}
            >
              <IconX size={20} />
            </button>
          </div>
        )}

        {/* ── Reservation form ─────────────────────── */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <form
            className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleReviewSubmit}
          >
            <div className="md:col-span-2 mb-2">
              <h3 className="text-xl font-serif font-bold text-secondary border-b border-gray-100 pb-2">
                Reservation Details
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full h-14 rounded-xl px-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full h-14 rounded-xl px-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">
                Guests *
                {selectedTable && (
                  <span className="ml-2 text-xs font-normal text-gray-400 normal-case">
                    (max {selectedTable.seating_capacity})
                  </span>
                )}
              </label>
              <select
                name="peopleCount"
                value={form.peopleCount}
                onChange={handleChange}
                className="w-full h-14 rounded-xl px-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary"
                required
              >
                {Array.from(
                  {
                    length: selectedTable ? selectedTable.seating_capacity : 20,
                  },
                  (_, i) => i + 1,
                ).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Person" : "People"}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">
                Selected Table
              </label>
              <div className="w-full h-14 rounded-xl px-5 bg-gray-50 border border-gray-200 flex items-center text-secondary">
                {selectedTable ? (
                  `${selectedTable.title} — ${selectedTable.floor} (${selectedTable.seating_capacity} seats)`
                ) : (
                  <span className="text-gray-400 italic">
                    Click a table above to select
                  </span>
                )}
              </div>
            </div>

            <div className="md:col-span-2 mt-4 mb-2">
              <h3 className="text-xl font-serif font-bold text-secondary border-b border-gray-100 pb-2">
                Your Information
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full h-14 rounded-xl px-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+92 300 000 0000"
                className="w-full h-14 rounded-xl px-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary"
                required
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">
                Special Requests
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Birthday, dietary restrictions, high chair, etc."
                className="w-full rounded-xl p-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary"
              />
            </div>

            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full h-14 min-h-0 rounded-xl text-white font-bold text-lg border-0 shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-md" />
                ) : (
                  "Review Reservation →"
                )}
              </button>
              {!customer && (
                <p className="text-center text-sm text-gray-400 mt-4">
                  <Link
                    to="/login"
                    className="text-primary font-semibold hover:underline"
                  >
                    Log in
                  </Link>{" "}
                  to receive booking confirmations.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ── QR Code Modal ──────────────────────── */}
      {qrTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xs w-full p-8 text-center relative">
            <button
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={() => {
                setQrTable(null);
                setQrDataUrl("");
              }}
            >
              <IconX size={20} className="text-gray-500" />
            </button>
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconQrcode size={28} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-1">
              {qrTable.title}
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              {qrTable.floor} · {qrTable.seating_capacity} seats
            </p>
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt={`QR for ${qrTable.title}`}
                className="w-48 h-48 mx-auto rounded-xl mb-4"
              />
            )}
            <p className="text-xs text-gray-400 mb-4 break-all">
              {qrTable.qrUrl}
            </p>
            <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
              Scan to open the online ordering page for this specific table.
            </p>
            <button
              onClick={() => {
                setQrTable(null);
                setQrDataUrl("");
              }}
              className="btn btn-primary w-full rounded-xl h-12 min-h-0 font-bold mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Confirmation Modal ──────────────────── */}
      {showConfirm && selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-serif font-bold text-secondary mb-6 text-center">
              Confirm Reservation
            </h3>
            <div className="space-y-3 bg-gray-50 rounded-2xl p-5 mb-6 text-sm">
              {[
                ["Table", `${selectedTable.title} — ${selectedTable.floor}`],
                [
                  "Date",
                  new Date(`${form.date}T${form.time}`).toLocaleDateString(
                    "en-PK",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  ),
                ],
                [
                  "Time",
                  new Date(`${form.date}T${form.time}`).toLocaleTimeString(
                    "en-PK",
                    { hour: "2-digit", minute: "2-digit" },
                  ),
                ],
                ["Guests", `${form.peopleCount} people`],
                ["Name", form.name],
                ["Phone", form.phone],
                ...(form.notes ? [["Notes", form.notes]] : []),
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-gray-500 font-medium shrink-0">
                    {label}
                  </span>
                  <span className="text-secondary font-semibold text-right">
                    {val}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 btn btn-ghost border border-gray-200 rounded-xl h-12 min-h-0 font-semibold"
              >
                Edit
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 btn btn-primary rounded-xl h-12 min-h-0 font-bold"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
