import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CafeOrders } from "../../localdb/LocalDB";
import { useCafeCart } from "../../contexts/CafeCartContext";

export default function JazzCashPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCafeCart();

  const amount = searchParams.get("amount") || "0.00";
  const currency = searchParams.get("currency") || "USD";

  const [step, setStep] = useState("phone"); // phone → otp → processing → done
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  function handlePhoneSubmit(e) {
    e.preventDefault();
    if (!/^(03\d{9}|\+923\d{9})$/.test(phone.replace(/\s/g, ""))) {
      toast.error("Enter a valid Pakistani mobile number (03xxxxxxxxx)");
      return;
    }
    setStep("otp");
    toast("OTP sent to " + phone, { icon: "📱" });
  }

  function handleOtpSubmit(e) {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error("Enter the 4-digit OTP");
      return;
    }
    setStep("processing");
    setLoading(true);

    setTimeout(() => {
      const ref = "JC-" + Date.now();
      const pendingRaw = localStorage.getItem("cafe_pending_order");
      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw);
          const order = CafeOrders.create({
            ...pending,
            paymentGatewayRef: ref,
            paymentMethod: "jazzcash",
          });
          localStorage.removeItem("cafe_pending_order");
          clearCart();
          setLoading(false);
          navigate(`/orders/${order.id}`);
          toast.success("Payment successful! Reference: " + ref);
        } catch {
          setLoading(false);
          navigate("/payment/result?status=failed&gateway=jazzcash");
        }
      } else {
        setLoading(false);
        navigate("/payment/result?status=success&gateway=jazzcash&ref=" + ref);
      }
    }, 2500);
  }

  function handleCancel() {
    localStorage.removeItem("cafe_pending_order");
    navigate("/checkout");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center px-4">
      <div className="card bg-white shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="bg-red-600 rounded-t-2xl px-6 py-4 flex items-center gap-3">
          <span className="text-3xl">📱</span>
          <div>
            <h2 className="text-white font-bold text-lg">JazzCash</h2>
            <p className="text-red-100 text-sm">Mobile Account Payment</p>
          </div>
        </div>

        <div className="card-body">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">Amount to Pay</p>
            <p className="text-3xl font-bold text-red-600">
              {currency === "PKR" ? "Rs." : "$"}
              {parseFloat(amount).toFixed(2)}
            </p>
          </div>

          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    JazzCash Mobile Number
                  </span>
                </label>
                <input
                  type="tel"
                  className="input input-bordered border-red-300 focus:border-red-500"
                  placeholder="03xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="tel"
                />
              </div>
              <button
                type="submit"
                className="btn bg-red-600 hover:bg-red-700 text-white border-none"
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

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
              <p className="text-sm text-center text-gray-600">
                Enter the 4-digit OTP sent to <strong>{phone}</strong>
              </p>
              <div className="form-control">
                <input
                  type="text"
                  maxLength={4}
                  className="input input-bordered text-center text-2xl tracking-[0.5em] border-red-300 focus:border-red-500"
                  placeholder="• • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
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
                className="btn bg-red-600 hover:bg-red-700 text-white border-none"
              >
                Confirm Payment
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
              <span className="loading loading-spinner loading-lg text-red-600" />
              <p className="font-semibold text-gray-700">Processing payment…</p>
              <p className="text-sm text-gray-500">Please wait</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
