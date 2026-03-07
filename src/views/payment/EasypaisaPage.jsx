import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CafeOrders } from "../../localdb/LocalDB";
import { useCafeCart } from "../../contexts/CafeCartContext";

export default function EasypaisaPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCafeCart();

  const amount = searchParams.get("amount") || "0.00";
  const currency = searchParams.get("currency") || "USD";

  const [step, setStep] = useState("cnic"); // cnic → phone → pin → processing
  const [cnic, setCnic] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  function handleCnicSubmit(e) {
    e.preventDefault();
    const cleaned = cnic.replace(/-/g, "");
    if (!/^\d{13}$/.test(cleaned)) {
      toast.error("Enter a valid 13-digit CNIC");
      return;
    }
    setStep("phone");
  }

  function handlePhoneSubmit(e) {
    e.preventDefault();
    if (!/^(03\d{9}|\+923\d{9})$/.test(phone.replace(/\s/g, ""))) {
      toast.error("Enter a valid Pakistani mobile number (03xxxxxxxxx)");
      return;
    }
    setStep("pin");
    toast("OTP sent to " + phone, { icon: "💚" });
  }

  function handlePinSubmit(e) {
    e.preventDefault();
    if (pin.length < 4) {
      toast.error("Enter the 4-digit PIN / OTP");
      return;
    }
    setStep("processing");
    setLoading(true);

    setTimeout(() => {
      const ref = "EP-" + Date.now();
      const pendingRaw = localStorage.getItem("cafe_pending_order");
      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw);
          const order = CafeOrders.create({
            ...pending,
            paymentGatewayRef: ref,
            paymentMethod: "easypaisa",
          });
          localStorage.removeItem("cafe_pending_order");
          clearCart();
          setLoading(false);
          navigate(`/cafe/orders/${order.id}`);
          toast.success("Payment successful! Reference: " + ref);
        } catch {
          setLoading(false);
          navigate("/payment/result?status=failed&gateway=easypaisa");
        }
      } else {
        setLoading(false);
        navigate("/payment/result?status=success&gateway=easypaisa&ref=" + ref);
      }
    }, 2500);
  }

  function handleCancel() {
    localStorage.removeItem("cafe_pending_order");
    navigate("/cafe/checkout");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center px-4">
      <div className="card bg-white shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="bg-green-600 rounded-t-2xl px-6 py-4 flex items-center gap-3">
          <span className="text-3xl">💚</span>
          <div>
            <h2 className="text-white font-bold text-lg">Easypaisa</h2>
            <p className="text-green-100 text-sm">Mobile Wallet Payment</p>
          </div>
        </div>

        <div className="card-body">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">Amount to Pay</p>
            <p className="text-3xl font-bold text-green-600">
              {currency === "PKR" ? "Rs." : "$"}
              {parseFloat(amount).toFixed(2)}
            </p>
          </div>

          {step === "cnic" && (
            <form onSubmit={handleCnicSubmit} className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">CNIC Number</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered border-green-300 focus:border-green-500"
                  placeholder="3520X-XXXXXXX-X"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  maxLength={15}
                  required
                />
                <label className="label">
                  <span className="label-text-alt text-gray-400">
                    Enter any 13 digits for demo
                  </span>
                </label>
              </div>
              <button
                type="submit"
                className="btn bg-green-600 hover:bg-green-700 text-white border-none"
              >
                Continue
              </button>
              <button
                type="button"
                className="btn btn-ghost text-sm"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </form>
          )}

          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Easypaisa Mobile Number
                  </span>
                </label>
                <input
                  type="tel"
                  className="input input-bordered border-green-300 focus:border-green-500"
                  placeholder="03xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="tel"
                />
              </div>
              <button
                type="submit"
                className="btn bg-green-600 hover:bg-green-700 text-white border-none"
              >
                Send OTP
              </button>
              <button
                type="button"
                className="btn btn-ghost text-sm"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </form>
          )}

          {step === "pin" && (
            <form onSubmit={handlePinSubmit} className="flex flex-col gap-4">
              <p className="text-sm text-center text-gray-600">
                Enter the OTP sent to <strong>{phone}</strong>
              </p>
              <div className="form-control">
                <input
                  type="text"
                  maxLength={4}
                  className="input input-bordered text-center text-2xl tracking-[0.5em] border-green-300 focus:border-green-500"
                  placeholder="• • • •"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/, ""))}
                  required
                  autoFocus
                />
                <label className="label">
                  <span className="label-text-alt text-gray-400">
                    Use any 4 digits for demo
                  </span>
                </label>
              </div>
              <button
                type="submit"
                className="btn bg-green-600 hover:bg-green-700 text-white border-none"
              >
                Pay Now
              </button>
              <button
                type="button"
                className="btn btn-ghost text-sm"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </form>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <span className="loading loading-spinner loading-lg text-green-600" />
              <p className="font-semibold text-gray-700">Processing payment…</p>
              <p className="text-sm text-gray-500">Please wait</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
