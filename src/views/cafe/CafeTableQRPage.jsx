/**
 * CafeTableQRPage.jsx
 * ─────────────────────────────────────────────────────────
 * Landing page when a student scans a table's QR code.
 * Route: /table/:tableId
 *
 * What it does:
 *  1. Reads the tableId from the URL param
 *  2. Loads table details from LocalDB
 *  3. Shows the table info (floor, seats, availability)
 *  4. Provides two CTAs:
 *     - "Order Now" → /menu (pre-selecting this table for dine-in)
 *     - "Reserve Table" → /reserve?tableId=:id
 *  5. If the table is already booked today, warns the user
 *  6. If the user isn't logged in, prompts them to log in first
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import { getDB, TableBookings, Settings } from "../../localdb/LocalDB";
import { useCustomer } from "../../contexts/CustomerContext";
import { FRONTEND_DOMAIN } from "../../config/config";
import {
  IconArmchair,
  IconShoppingBag,
  IconCalendarEvent,
  IconUsers,
  IconCheck,
  IconAlertTriangle,
  IconQrcode,
} from "@tabler/icons-react";

export default function CafeTableQRPage() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { customer } = useCustomer();

  const [table, setTable] = useState(null);
  const [store, setStore] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    try {
      const db = getDB();
      const found = (db.store_tables || []).find(
        (t) => String(t.id) === String(tableId),
      );
      if (!found) {
        setNotFound(true);
        return;
      }
      setTable(found);
      setStore(Settings.getStoreSetting());

      // Check if booked today
      const today = new Date().toISOString().split("T")[0];
      setIsBooked(TableBookings.isBooked(found.id, today));

      // Generate QR code image for display
      const host = FRONTEND_DOMAIN || window.location.origin;
      const url = `${host}/table/${found.id}`;
      QRCode.toDataURL(url, { width: 180, margin: 2 }).then(setQrDataUrl);
    } catch (err) {
      console.error(err);
      setNotFound(true);
    }
  }, [tableId]);

  // Save the selected table in sessionStorage so Checkout can read it
  function handleOrderNow() {
    if (!customer) {
      toast.error("Please log in to place an order.");
      navigate("/login", {
        state: { from: { pathname: `/table/${tableId}` } },
      });
      return;
    }
    // Store pre-selected table + dine-in preference for checkout
    sessionStorage.setItem("qr_table_id", String(table.id));
    sessionStorage.setItem("qr_table_title", table.title);
    navigate("/menu");
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-theme-light flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconAlertTriangle size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-secondary mb-2">
            Table Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            This QR code doesn't match any table in our system.
          </p>
          <Link to="/" className="btn btn-primary rounded-full px-8">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!table) {
    return (
      <div className="min-h-screen bg-theme-light flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-light flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 w-full max-w-sm overflow-hidden">
        {/* Table Hero */}
        <div className="bg-gradient-to-br from-primary to-primary/80 px-8 py-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconArmchair size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-serif font-bold mb-1">
              {table.title}
            </h1>
            <p className="text-white/80 text-sm font-medium">
              {store?.store_name || "Campus Cafe"}
            </p>
          </div>
        </div>

        {/* Table Details */}
        <div className="px-8 py-6">
          {/* Info pills */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm font-semibold text-secondary">
              <IconUsers size={14} />
              {table.seating_capacity} seats
            </span>
            <span className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm font-semibold text-secondary">
              📍 {table.floor}
            </span>
            {isBooked ? (
              <span className="flex items-center gap-1.5 bg-red-100 rounded-full px-3 py-1.5 text-sm font-semibold text-red-600">
                <IconAlertTriangle size={14} />
                Reserved Today
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-green-100 rounded-full px-3 py-1.5 text-sm font-semibold text-green-600">
                <IconCheck size={14} />
                Available
              </span>
            )}
          </div>

          {/* Availability warning */}
          {isBooked && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700 mb-5 flex items-start gap-2">
              <IconAlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>
                This table has a reservation today. You can still walk up if
                seats are free, or choose another table.
              </span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={handleOrderNow}
              className="btn btn-primary w-full rounded-xl h-13 min-h-0 font-bold text-white border-0 shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
            >
              <IconShoppingBag size={20} />
              Order Food Now
            </button>
            <Link
              to={`/reserve?tableId=${table.id}`}
              className="btn btn-ghost border-2 border-primary/20 hover:border-primary w-full rounded-xl h-12 min-h-0 font-bold text-primary flex items-center justify-center gap-2"
            >
              <IconCalendarEvent size={19} />
              Reserve This Table
            </Link>
          </div>

          {/* QR display */}
          <div className="text-center border-t border-gray-100 pt-5">
            <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">
              Table QR Code
            </p>
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Table QR"
                className="w-28 h-28 mx-auto rounded-xl mb-2"
              />
            )}
            <p className="text-xs text-gray-400">
              Share this QR for direct access to this table's ordering page
            </p>
          </div>
        </div>

        {/* Quick nav links */}
        <div className="bg-gray-50 px-8 py-4 flex justify-center gap-6 text-sm font-semibold">
          <Link
            to="/"
            className="text-gray-500 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            to="/menu"
            className="text-gray-500 hover:text-primary transition-colors"
          >
            Full Menu
          </Link>
          <Link
            to="/reserve"
            className="text-gray-500 hover:text-primary transition-colors"
          >
            Reservations
          </Link>
          {!customer ? (
            <Link to="/login" className="text-primary">
              Log In
            </Link>
          ) : (
            <Link
              to="/wallet"
              className="text-gray-500 hover:text-primary transition-colors"
            >
              Wallet
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
