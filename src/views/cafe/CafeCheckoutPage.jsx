import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCafeCart } from "../../contexts/CafeCartContext";
import { useCustomer } from "../../contexts/CustomerContext";
import {
  CafeOrders,
  Settings,
  CustomerAccounts,
  WalletTransactions,
  getDB,
  TableBookings,
} from "../../localdb/LocalDB";
import { addNotification } from "../../hooks/useNotifications";

const PAYMENT_METHODS = [
  { id: "wallet", label: "Credit Wallet", icon: "💰" },
  { id: "cash", label: "Pay at Counter (Cash)", icon: "💵" },
  { id: "jazzcash", label: "JazzCash", icon: "📱" },
  { id: "easypaisa", label: "Easypaisa", icon: "💚" },
  { id: "stripe", label: "Credit / Debit Card (Stripe)", icon: "💳" },
];

export default function CafeCheckoutPage() {
  const navigate = useNavigate();
  const { customer } = useCustomer();
  const { cartItems, subtotal, taxTotal, total, clearCart } = useCafeCart();

  const store = Settings.getStoreSetting();
  const currency = store?.currency || "USD";
  const symbol = currency === "PKR" ? "Rs." : "$";

  // Read pre-selected table written by CafeTableQRPage (sessionStorage)
  const qrTableId = sessionStorage.getItem("qr_table_id") || "";
  const qrTableTitle = sessionStorage.getItem("qr_table_title") || "";

  const [form, setForm] = useState({
    deliveryType: "dine_in", // default dine-in for university cafe
    address: "",
    paymentMethod: "cash",
    tableId: qrTableId, // pre-filled from QR scan
  });
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load available tables for dine-in table selection
    try {
      const db = getDB();
      setTables(db.store_tables || []);
    } catch {}

    // Clear QR session keys so they don't persist on next visit
    return () => {
      if (qrTableId) {
        sessionStorage.removeItem("qr_table_id");
        sessionStorage.removeItem("qr_table_title");
      }
    };
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handlePlaceOrder() {
    // ── Basic validation ─────────────────────────────
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (form.deliveryType === "delivery" && !form.address.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }
    // Dine-in table validation
    if (form.deliveryType === "dine_in") {
      if (!form.tableId) {
        toast.error("Please select a table for dine-in.");
        return;
      }
      const today = new Date().toISOString().split("T")[0];
      if (TableBookings.isBooked(form.tableId, today)) {
        toast.error(
          "That table is already reserved today. Please choose a different table.",
        );
        return;
      }
    }

    // ── Wallet payment ───────────────────────────────
    if (form.paymentMethod === "wallet") {
      const balance = parseFloat(customer.credit_balance || 0);
      if (balance < total) {
        toast.error(
          `Insufficient wallet balance. You need ${symbol}${(total - balance).toFixed(2)} more.`,
        );
        return;
      }
      setLoading(true);
      try {
        const ref = `WALLET-${Date.now()}`;
        CustomerAccounts.deductCredit(customer.id, total);
        // Record wallet deduction transaction for history
        WalletTransactions.addDeduction({
          customerId: customer.id,
          amount: total,
        });
        const order = CafeOrders.create({
          customerId: customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          items: cartItems,
          deliveryType: form.deliveryType,
          address: form.deliveryType === "delivery" ? form.address : "",
          tableId: form.tableId || null,
          paymentMethod: "wallet",
          paymentGatewayRef: ref,
          subtotal: subtotal.toFixed(2),
          taxTotal: taxTotal.toFixed(2),
          total: total.toFixed(2),
        });
        clearCart();

        addNotification({
          userId: "admin",
          forAdmin: true,
          message: `New Order #${order.id} placed by ${customer.name} (Wallet) for ${symbol}${total.toFixed(2)}`,
          type: "info",
        });

        addNotification({
          userId: customer.id,
          message: `Your order #${order.id} has been placed successfully for ${symbol}${total.toFixed(2)} using your Wallet.`,
          type: "success",
        });

        toast.success("Order placed successfully with Wallet!");
        navigate(`/orders/${order.id}`);
      } catch (err) {
        toast.error(err.message || "Failed to place order.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // For online payment gateways, redirect to payment page
    if (form.paymentMethod !== "cash" && form.paymentMethod !== "wallet") {
      // Persist pending order data temporarily in localStorage
      const pendingOrder = {
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        items: cartItems,
        deliveryType: form.deliveryType,
        address: form.deliveryType === "delivery" ? form.address : "",
        tableId: form.tableId || null,
        paymentMethod: form.paymentMethod,
        subtotal: subtotal.toFixed(2),
        taxTotal: taxTotal.toFixed(2),
        total: total.toFixed(2),
      };
      localStorage.setItem("cafe_pending_order", JSON.stringify(pendingOrder));
      navigate(
        `/payment/${form.paymentMethod}?amount=${total.toFixed(2)}&currency=${currency}`,
      );
      return;
    }

    // Cash – place order immediately
    setLoading(true);
    try {
      const order = CafeOrders.create({
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        items: cartItems,
        deliveryType: form.deliveryType,
        address: form.deliveryType === "delivery" ? form.address : "",
        tableId: form.tableId || null,
        paymentMethod: "cash",
        paymentGatewayRef: null,
        subtotal: subtotal.toFixed(2),
        taxTotal: taxTotal.toFixed(2),
        total: total.toFixed(2),
      });
      clearCart();

      // Add Notification for Admin
      addNotification({
        userId: "admin",
        forAdmin: true,
        message: `New Order #${order.id} placed by ${customer.name} for ${symbol}${total.toFixed(2)}`,
        type: "info",
      });

      // Add Notification for Customer
      addNotification({
        userId: customer.id,
        message: `Your order #${order.id} has been placed successfully for ${symbol}${total.toFixed(2)}.`,
        type: "success",
      });

      toast.success("Order placed successfully!");
      navigate(`/orders/${order.id}`);
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-theme-light flex-1 py-12 px-6 md:px-12 xl:px-24">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-10 text-center flex flex-col items-center">
          <Link
            to="/cart"
            className="text-primary text-sm font-bold uppercase tracking-widest hover:underline mb-4 inline-block"
          >
            ← Back to Cart
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">
            Checkout
          </h1>
        </div>

        <div className="flex flex-col gap-8">
          {/* ── 1. Order Type section ─────────────────────── */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 p-6 md:p-8 shrink-0">
            <h3 className="font-serif font-bold text-2xl mb-6 text-secondary pb-4 border-b border-gray-100">
              1. Order Type
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { id: "dine_in", label: "🍽 Dine In" },
                { id: "pickup", label: "🏪 Pickup" },
                { id: "delivery", label: "🚚 Delivery" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    form.deliveryType === opt.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-100 shadow-sm hover:border-gray-200 text-secondary"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    className="hidden"
                    value={opt.id}
                    checked={form.deliveryType === opt.id}
                    onChange={handleChange}
                  />
                  <span className="font-semibold">{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Dine-in: table selection */}
            {form.deliveryType === "dine_in" && (
              <div className="form-control">
                <label className="label mb-2">
                  <span className="text-sm font-semibold text-neutral">
                    Select Table *
                  </span>
                  {qrTableTitle && (
                    <span className="badge badge-primary badge-sm">
                      Pre-selected via QR
                    </span>
                  )}
                </label>
                <select
                  name="tableId"
                  value={form.tableId}
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl px-4 border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-secondary"
                >
                  <option value="">— Choose a table —</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} — {t.floor} ({t.seating_capacity} seats)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Delivery: address input */}
            {form.deliveryType === "delivery" && (
              <div className="form-control mt-4">
                <label className="label mb-2">
                  <span className="text-sm font-semibold text-neutral">
                    Delivery Address *
                  </span>
                </label>
                <textarea
                  name="address"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors p-4 resize-none"
                  rows={3}
                  placeholder="Enter your full delivery address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* ── 2. Payment method ─────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 p-6 md:p-8 shrink-0">
            <h3 className="font-serif font-bold text-2xl mb-6 text-secondary pb-4 border-b border-gray-100">
              2. Payment Method
            </h3>
            {/* Show current wallet balance if customer chooses wallet */}
            {form.paymentMethod === "wallet" && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 mb-4 flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">
                  Available Wallet Balance
                </span>
                <span
                  className={`font-bold text-base ${parseFloat(customer?.credit_balance || 0) >= total ? "text-green-600" : "text-red-500"}`}
                >
                  {symbol}
                  {parseFloat(customer?.credit_balance || 0).toFixed(2)}
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PAYMENT_METHODS.map((pm) => (
                <label
                  key={pm.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    form.paymentMethod === pm.id
                      ? "border-primary bg-primary/5 text-secondary"
                      : "border-gray-100 shadow-sm hover:border-gray-200 text-secondary"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="radio radio-primary radio-sm bg-white"
                    value={pm.id}
                    checked={form.paymentMethod === pm.id}
                    onChange={handleChange}
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{pm.icon}</span>
                    <span className="font-semibold">{pm.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-primary/20 p-6 md:p-8 shrink-0">
            <h3 className="font-serif font-bold text-2xl mb-6 text-secondary pb-4 border-b border-gray-100">
              3. Order Summary
            </h3>
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item._key}
                  className="flex justify-between text-neutral text-sm md:text-base border-b border-gray-50 pb-2 border-dashed"
                >
                  <span className="font-medium">
                    {item.title}
                    {item.variant ? ` (${item.variant.title})` : ""}
                    <span className="text-gray-400"> × {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-secondary">
                    {symbol}
                    {((item.price + item.addonTotal) * item.quantity).toFixed(
                      2,
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6 text-neutral text-sm md:text-base">
              <div className="flex justify-between items-center">
                <span className="opacity-80">Subtotal</span>
                <span className="font-semibold text-secondary">
                  {symbol}
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-80">Tax</span>
                <span className="font-semibold text-secondary">
                  {symbol}
                  {taxTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 my-6"></div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-serif font-bold text-2xl text-secondary">
                Total
              </span>
              <span className="text-3xl font-bold text-primary">
                {symbol}
                {total.toFixed(2)}
              </span>
            </div>

            <button
              className="btn btn-primary w-full rounded-full h-14 min-h-0 text-white font-bold text-lg border-0 shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              disabled={loading}
              onClick={handlePlaceOrder}
            >
              {loading ? (
                <span className="loading loading-spinner loading-md" />
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {form.paymentMethod === "cash"
                    ? "Place Order"
                    : `Pay with ${PAYMENT_METHODS.find((p) => p.id === form.paymentMethod)?.label}`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
