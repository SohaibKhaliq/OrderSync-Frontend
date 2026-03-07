/**
 * CafeWalletPage.jsx
 * ─────────────────────────────────────────────────────────
 * Student-facing wallet page.
 *
 * Features:
 *  • View current wallet balance
 *  • Top-up wallet via JazzCash, Easypaisa, Stripe, or Cash
 *  • Each payment method has an inline simulated flow (no page redirect)
 *  • View full transaction history (top-ups & deductions)
 *  • All data stored in LocalStorage via WalletTransactions + CustomerAccounts
 */

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useCustomer } from "../../contexts/CustomerContext";
import {
  CustomerAccounts,
  WalletTransactions,
  Settings,
} from "../../localdb/LocalDB";
import {
  IconWallet,
  IconCreditCard,
  IconMobiledata,
  IconCash,
  IconHistory,
  IconPlus,
  IconArrowDown,
  IconArrowUp,
  IconX,
  IconCheck,
} from "@tabler/icons-react";

// ── Payment method definitions ─────────────────────────────
const PAYMENT_METHODS = [
  {
    id: "jazzcash",
    label: "JazzCash",
    icon: "📱",
    color: "bg-red-600",
    hover: "hover:bg-red-700",
    badge: "bg-red-100 text-red-700",
    description: "Pay via JazzCash mobile account",
  },
  {
    id: "easypaisa",
    label: "Easypaisa",
    icon: "💚",
    color: "bg-green-600",
    hover: "hover:bg-green-700",
    badge: "bg-green-100 text-green-700",
    description: "Pay via Easypaisa mobile account",
  },
  {
    id: "stripe",
    label: "Credit / Debit Card",
    icon: "💳",
    color: "bg-indigo-600",
    hover: "hover:bg-indigo-700",
    badge: "bg-indigo-100 text-indigo-700",
    description: "Visa, Mastercard, Amex (Stripe)",
  },
  {
    id: "cash",
    label: "Cash Top-Up",
    icon: "💵",
    color: "bg-yellow-500",
    hover: "hover:bg-yellow-600",
    badge: "bg-yellow-100 text-yellow-700",
    description: "Pay at the counter & get credit instantly",
  },
];

// ── Formats a card number string with spaces ─────────────
function fmtCard(v) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}
function fmtExpiry(v) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}

// ─────────────────────────────────────────────────────────
export default function CafeWalletPage() {
  const { customer, refreshSession } = useCustomer();

  const [store, setStore] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Top-up modal state
  const [showTopUp, setShowTopUp] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null); // payment method id
  const [step, setStep] = useState("amount"); // amount → form → processing → done

  // Per-method form fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [cnic, setCnic] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Quick-amount presets ────────────────────────────────
  const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

  // ── Load data ───────────────────────────────────────────
  const loadData = useCallback(() => {
    setStore(Settings.getStoreSetting());
    if (customer?.id) {
      setTransactions(WalletTransactions.getByCustomer(customer.id));
    }
  }, [customer?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh session balance whenever wallet changes
  useEffect(() => {
    window.addEventListener("cafe_session", loadData);
    return () => window.removeEventListener("cafe_session", loadData);
  }, [loadData]);

  const currency = store?.currency || "PKR";
  const symbol = currency === "PKR" ? "Rs." : "$";
  const balance = parseFloat(customer?.credit_balance || 0);

  // ── Open top-up modal and reset state ─────────────────
  function openTopUp() {
    setTopupAmount("");
    setSelectedMethod(null);
    setStep("amount");
    setPhoneNumber("");
    setOtp("");
    setCnic("");
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setCardName("");
    setShowTopUp(true);
  }

  // ── Step 1: Validate amount and select method ──────────
  function handleAmountNext() {
    const amt = parseFloat(topupAmount);
    if (!amt || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amt < 10) {
      toast.error(`Minimum top-up is ${symbol}10`);
      return;
    }
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }
    setStep("form");
  }

  // ── Step 2a: JazzCash — phone number → OTP ────────────
  function handleJCPhoneNext(e) {
    e.preventDefault();
    if (!/^(03\d{9}|\+923\d{9})$/.test(phoneNumber.replace(/\s/g, ""))) {
      toast.error("Enter a valid Pakistani mobile number (03xxxxxxxxx)");
      return;
    }
    toast("OTP sent to " + phoneNumber, { icon: "📱" });
    setStep("otp");
  }

  function handleJCOtpSubmit(e) {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error("Enter the 4-digit OTP");
      return;
    }
    processTopUp("JC-" + Date.now());
  }

  // ── Step 2b: Easypaisa — CNIC → phone → PIN ───────────
  function handleEPCnicNext(e) {
    e.preventDefault();
    const cleaned = cnic.replace(/-/g, "");
    if (!/^\d{13}$/.test(cleaned)) {
      toast.error("Enter a valid 13-digit CNIC");
      return;
    }
    toast("OTP sent to your Easypaisa number", { icon: "💚" });
    setStep("ep_phone");
  }

  function handleEPPhoneNext(e) {
    e.preventDefault();
    if (!/^(03\d{9}|\+923\d{9})$/.test(phoneNumber.replace(/\s/g, ""))) {
      toast.error("Enter a valid Pakistani mobile number");
      return;
    }
    setStep("ep_pin");
  }

  function handleEPPinSubmit(e) {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error("Enter your 4-digit Easypaisa PIN");
      return;
    }
    processTopUp("EP-" + Date.now());
  }

  // ── Step 2c: Stripe card ───────────────────────────────
  function handleStripeSubmit(e) {
    e.preventDefault();
    const rawCard = cardNumber.replace(/\s/g, "");
    if (rawCard.length < 16) {
      toast.error("Enter a valid 16-digit card number");
      return;
    }
    if (expiry.length < 5) {
      toast.error("Enter a valid expiry date (MM/YY)");
      return;
    }
    if (cvv.length < 3) {
      toast.error("Enter a valid CVV (3–4 digits)");
      return;
    }
    if (!cardName.trim()) {
      toast.error("Enter the cardholder name");
      return;
    }
    // Test card 4000000000000002 → decline
    if (rawCard === "4000000000000002") {
      toast.error("Card declined. Use 4242 4242 4242 4242 for success.");
      return;
    }
    processTopUp("ST-" + Date.now());
  }

  // ── Step 2d: Cash ──────────────────────────────────────
  function handleCashSubmit(e) {
    e.preventDefault();
    processTopUp("CASH-" + Date.now());
  }

  // ── Simulate processing & credit wallet ───────────────
  function processTopUp(ref) {
    setStep("processing");
    setLoading(true);
    setTimeout(() => {
      try {
        const amt = parseFloat(topupAmount);
        // Add credit to wallet in LocalDB
        CustomerAccounts.addCredit(customer.id, amt);
        // Record transaction
        WalletTransactions.addTopUp({
          customerId: customer.id,
          amount: amt,
          method: selectedMethod,
          ref,
        });
        refreshSession();
        loadData();
        setLoading(false);
        setStep("done");
      } catch (err) {
        setLoading(false);
        toast.error(err.message || "Top-up failed. Please try again.");
        setStep("form");
      }
    }, 2000);
  }

  // ── Close modal ─────────────────────────────────────────
  function closeModal() {
    setShowTopUp(false);
    setStep("amount");
  }

  // ── Format transaction date ──────────────────────────
  function fmtDate(iso) {
    if (!iso) return "-";
    return new Date(iso).toLocaleString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ── Render top-up form based on method & step ─────────
  function renderPaymentForm() {
    if (selectedMethod === "jazzcash") {
      if (step === "form") {
        return (
          <form
            onSubmit={handleJCPhoneNext}
            className="flex flex-col gap-4 mt-4"
          >
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-600">
                JazzCash Mobile Number
              </label>
              <input
                type="tel"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="03xxxxxxxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl h-12 min-h-0 font-bold"
            >
              Send OTP
            </button>
          </form>
        );
      }
      if (step === "otp") {
        return (
          <form
            onSubmit={handleJCOtpSubmit}
            className="flex flex-col gap-4 mt-4"
          >
            <p className="text-sm text-gray-500 text-center">
              Enter the 4-digit OTP sent to <strong>{phoneNumber}</strong>
            </p>
            <input
              type="text"
              maxLength={6}
              inputMode="numeric"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="• • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
            />
            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl h-12 min-h-0 font-bold"
            >
              Confirm Payment
            </button>
          </form>
        );
      }
    }

    if (selectedMethod === "easypaisa") {
      if (step === "form") {
        return (
          <form
            onSubmit={handleEPCnicNext}
            className="flex flex-col gap-4 mt-4"
          >
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-600">
                CNIC (13 digits)
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
                placeholder="3520012345678"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn bg-green-600 hover:bg-green-700 text-white w-full rounded-xl h-12 min-h-0 font-bold border-none"
            >
              Verify CNIC
            </button>
          </form>
        );
      }
      if (step === "ep_phone") {
        return (
          <form
            onSubmit={handleEPPhoneNext}
            className="flex flex-col gap-4 mt-4"
          >
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-600">
                Easypaisa Mobile Number
              </label>
              <input
                type="tel"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
                placeholder="03xxxxxxxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn bg-green-600 hover:bg-green-700 text-white w-full rounded-xl h-12 min-h-0 font-bold border-none"
            >
              Send OTP
            </button>
          </form>
        );
      }
      if (step === "ep_pin") {
        return (
          <form
            onSubmit={handleEPPinSubmit}
            className="flex flex-col gap-4 mt-4"
          >
            <p className="text-sm text-gray-500 text-center">
              Enter your 4-digit Easypaisa PIN
            </p>
            <input
              type="password"
              maxLength={4}
              inputMode="numeric"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="• • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
            />
            <button
              type="submit"
              className="btn bg-green-600 hover:bg-green-700 text-white w-full rounded-xl h-12 min-h-0 font-bold border-none"
            >
              Confirm Payment
            </button>
          </form>
        );
      }
    }

    if (selectedMethod === "stripe") {
      return (
        <form
          onSubmit={handleStripeSubmit}
          className="flex flex-col gap-4 mt-4"
        >
          <p className="text-xs text-gray-400 text-center">
            Test:{" "}
            <code className="bg-gray-100 px-1 rounded">
              4242 4242 4242 4242
            </code>{" "}
            → success
          </p>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">
              Card Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(fmtCard(e.target.value))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-600">
                Expiry
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(fmtExpiry(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-600">
                CVV
              </label>
              <input
                type="text"
                inputMode="numeric"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="123"
                maxLength={4}
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">
              Cardholder Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white w-full rounded-xl h-12 min-h-0 font-bold border-none"
          >
            Pay {symbol}
            {parseFloat(topupAmount || 0).toFixed(2)}
          </button>
        </form>
      );
    }

    if (selectedMethod === "cash") {
      return (
        <form onSubmit={handleCashSubmit} className="flex flex-col gap-4 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
            <p className="font-bold mb-1">Cash Top-Up Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 opacity-80">
              <li>Visit the cashier at the cafe counter</li>
              <li>Tell them you want to top up your wallet</li>
              <li>
                Mention your registered email:{" "}
                <strong>{customer?.email}</strong>
              </li>
              <li>
                Pay {symbol}
                {parseFloat(topupAmount || 0).toFixed(2)} cash
              </li>
              <li>The amount will be added instantly by staff</li>
            </ol>
          </div>
          <button
            type="submit"
            className="btn bg-yellow-500 hover:bg-yellow-600 text-white w-full rounded-xl h-12 min-h-0 font-bold border-none"
          >
            Simulate Cash Top-Up
          </button>
        </form>
      );
    }

    return null;
  }

  // ── Main Render ─────────────────────────────────────────
  return (
    <div className="bg-theme-light flex-1 py-12 px-6 md:px-12 xl:px-24">
      <div className="max-w-[1000px] mx-auto">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <p className="text-primary font-bold tracking-widest text-xs mb-4 uppercase">
            Student Wallet
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
            My Wallet
          </h1>
          <p className="text-neutral opacity-75 max-w-lg mx-auto">
            Add money to your wallet and use it to pay for orders instantly at
            checkout.
          </p>
        </div>

        {/* Balance Card */}
        <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 md:p-10 text-white mb-10 overflow-hidden shadow-2xl shadow-primary/30">
          {/* Background circles decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-semibold tracking-widest uppercase mb-2">
              Available Balance
            </p>
            <p className="text-5xl md:text-6xl font-bold font-serif mb-6">
              {symbol}
              {balance.toFixed(2)}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-sm opacity-80">
                <span className="font-semibold">{customer?.name}</span>
                <span className="mx-2">·</span>
                <span>{customer?.email}</span>
              </div>
              <button
                onClick={openTopUp}
                className="ml-auto btn bg-white text-primary hover:bg-white/90 border-none rounded-full px-6 h-11 min-h-0 font-bold shadow-lg flex items-center gap-2"
              >
                <IconPlus size={18} /> Add Money
              </button>
            </div>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-secondary mb-4">
            Quick Top-Up
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setTopupAmount(String(amt));
                  openTopUp();
                  // After state update, advance to method selection
                  setTimeout(() => setTopupAmount(String(amt)), 10);
                }}
                className="border-2 border-primary/20 hover:border-primary bg-white hover:bg-primary/5 rounded-xl py-3 text-center font-bold text-secondary transition-colors"
              >
                {symbol}
                {amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <IconHistory size={24} className="text-primary" />
            <h2 className="text-xl font-bold text-secondary">
              Transaction History
            </h2>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <IconWallet size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No transactions yet</p>
              <p className="text-sm">Top up your wallet to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {transactions.map((txn) => {
                const method = PAYMENT_METHODS.find((m) => m.id === txn.method);
                const isTopUp = txn.type === "topup";
                return (
                  <div key={txn.id} className="flex items-center gap-4 py-4">
                    {/* Icon */}
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${isTopUp ? "bg-green-100" : "bg-red-100"}`}
                    >
                      {isTopUp ? (
                        <IconArrowDown size={20} className="text-green-600" />
                      ) : (
                        <IconArrowUp size={20} className="text-red-500" />
                      )}
                    </div>
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-secondary text-sm truncate">
                        {isTopUp ? "Wallet Top-Up" : "Order Payment"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {method?.label || txn.method}{" "}
                        {txn.ref ? `· ${txn.ref}` : ""}
                      </p>
                      <p className="text-xs text-gray-400">
                        {fmtDate(txn.created_at)}
                      </p>
                    </div>
                    {/* Amount */}
                    <span
                      className={`font-bold text-base shrink-0 ${isTopUp ? "text-green-600" : "text-red-500"}`}
                    >
                      {isTopUp ? "+" : "-"}
                      {symbol}
                      {parseFloat(txn.amount).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Top-Up Modal ───────────────────────────────────── */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h3 className="text-xl font-bold text-secondary">
                  {step === "done"
                    ? "Top-Up Successful! 🎉"
                    : "Add Money to Wallet"}
                </h3>
                {step !== "done" && (
                  <p className="text-sm text-gray-400 mt-0.5">
                    {step === "amount"
                      ? "Enter amount & choose method"
                      : step === "processing"
                        ? "Processing payment…"
                        : "Complete payment to credit wallet"}
                  </p>
                )}
              </div>
              {step !== "processing" && (
                <button
                  onClick={closeModal}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <IconX size={20} className="text-gray-500" />
                </button>
              )}
            </div>

            <div className="p-6">
              {/* ── Step: done ── */}
              {step === "done" && (
                <div className="text-center py-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconCheck size={40} className="text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-secondary mb-2">
                    +{symbol}
                    {parseFloat(topupAmount).toFixed(2)} added!
                  </p>
                  <p className="text-gray-500 mb-6">
                    Your wallet has been credited successfully via{" "}
                    {
                      PAYMENT_METHODS.find((m) => m.id === selectedMethod)
                        ?.label
                    }
                    .
                  </p>
                  <p className="text-lg font-bold text-primary mb-6">
                    New Balance: {symbol}
                    {parseFloat(customer?.credit_balance || 0).toFixed(2)}
                  </p>
                  <button
                    onClick={closeModal}
                    className="btn btn-primary w-full rounded-xl h-12 min-h-0 font-bold"
                  >
                    Done
                  </button>
                </div>
              )}

              {/* ── Step: processing ── */}
              {step === "processing" && (
                <div className="text-center py-10">
                  <span className="loading loading-spinner loading-lg text-primary" />
                  <p className="mt-4 text-gray-500 font-medium">
                    Processing your payment…
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Please do not close this window
                  </p>
                </div>
              )}

              {/* ── Step: amount ── */}
              {step === "amount" && (
                <>
                  {/* Amount input */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 text-gray-600 uppercase tracking-wider">
                      Amount to Add
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                        {symbol}
                      </span>
                      <input
                        type="number"
                        min="10"
                        step="1"
                        className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-4 text-2xl font-bold text-secondary bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        placeholder="0.00"
                        value={topupAmount}
                        onChange={(e) => setTopupAmount(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {QUICK_AMOUNTS.slice(0, 4).map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setTopupAmount(String(amt))}
                          className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                            topupAmount === String(amt)
                              ? "bg-primary border-primary text-white"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {symbol}
                          {amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment method selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-3 text-gray-600 uppercase tracking-wider">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {PAYMENT_METHODS.map((pm) => (
                        <label
                          key={pm.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedMethod === pm.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-100 hover:border-gray-200 bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            className="radio radio-primary radio-sm bg-white"
                            checked={selectedMethod === pm.id}
                            onChange={() => setSelectedMethod(pm.id)}
                          />
                          <span className="text-2xl">{pm.icon}</span>
                          <div>
                            <p className="font-semibold text-secondary text-sm">
                              {pm.label}
                            </p>
                            <p className="text-xs text-gray-400">
                              {pm.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAmountNext}
                    className="btn btn-primary w-full rounded-xl h-13 min-h-0 font-bold text-lg"
                  >
                    Continue →
                  </button>
                </>
              )}

              {/* ── Step: payment form ── */}
              {step !== "amount" &&
                step !== "processing" &&
                step !== "done" && (
                  <>
                    {/* Summary bar */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-1">
                      <span className="text-sm text-gray-500 font-medium">
                        Topping up
                      </span>
                      <span className="font-bold text-primary text-lg">
                        {symbol}
                        {parseFloat(topupAmount || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 mb-4">
                      <span className="text-lg">
                        {
                          PAYMENT_METHODS.find((m) => m.id === selectedMethod)
                            ?.icon
                        }
                      </span>
                      <span className="text-sm font-semibold text-gray-600">
                        {
                          PAYMENT_METHODS.find((m) => m.id === selectedMethod)
                            ?.label
                        }
                      </span>
                    </div>
                    {renderPaymentForm()}
                    <button
                      type="button"
                      onClick={() => {
                        setStep("amount");
                        setOtp("");
                        setPhoneNumber("");
                        setCnic("");
                      }}
                      className="btn btn-ghost w-full mt-2 text-sm text-gray-400"
                    >
                      ← Change method
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
