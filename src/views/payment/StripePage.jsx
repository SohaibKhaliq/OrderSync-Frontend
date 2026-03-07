import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CafeOrders } from "../../localdb/LocalDB";
import { useCafeCart } from "../../contexts/CafeCartContext";

// Test card numbers: 4242424242424242 → success, 4000000000000002 → declined
const TEST_CARDS = {
  4242424242424242: "success",
  4000000000000002: "declined",
};

function formatCardNumber(val) {
  return val
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return digits.slice(0, 2) + "/" + digits.slice(2);
  }
  return digits;
}

export default function StripePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCafeCart();

  const amount = searchParams.get("amount") || "0.00";
  const currency = searchParams.get("currency") || "USD";

  const [form, setForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      setForm((prev) => ({ ...prev, cardNumber: formatCardNumber(value) }));
    } else if (name === "expiry") {
      setForm((prev) => ({ ...prev, expiry: formatExpiry(value) }));
    } else if (name === "cvv") {
      setForm((prev) => ({
        ...prev,
        cvv: value.replace(/\D/g, "").slice(0, 4),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const rawCard = form.cardNumber.replace(/\s/g, "");
    if (rawCard.length < 16) {
      toast.error("Enter a valid 16-digit card number");
      return;
    }
    if (form.expiry.length < 5) {
      toast.error("Enter a valid expiry date (MM/YY)");
      return;
    }
    if (form.cvv.length < 3) {
      toast.error("Enter a valid CVV");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const cardResult = TEST_CARDS[rawCard] || "success";

      if (cardResult === "declined") {
        setLoading(false);
        toast.error("Card declined. Use 4242 4242 4242 4242 for success.");
        navigate(
          "/payment/result?status=failed&gateway=stripe&reason=card_declined",
        );
        return;
      }

      const ref = "ST-" + Date.now();
      const pendingRaw = localStorage.getItem("cafe_pending_order");
      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw);
          const order = CafeOrders.create({
            ...pending,
            paymentGatewayRef: ref,
            paymentMethod: "stripe",
          });
          localStorage.removeItem("cafe_pending_order");
          clearCart();
          setLoading(false);
          navigate(`/orders/${order.id}`);
          toast.success("Payment successful! Ref: " + ref);
        } catch {
          setLoading(false);
          navigate("/payment/result?status=failed&gateway=stripe");
        }
      } else {
        setLoading(false);
        navigate("/payment/result?status=success&gateway=stripe&ref=" + ref);
      }
    }, 2000);
  }

  function handleCancel() {
    localStorage.removeItem("cafe_pending_order");
    navigate("/checkout");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      <div className="card bg-white shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="bg-indigo-600 rounded-t-2xl px-6 py-4 flex items-center gap-3">
          <span className="text-3xl">💳</span>
          <div>
            <h2 className="text-white font-bold text-lg">Stripe</h2>
            <p className="text-indigo-100 text-sm">Credit / Debit Card</p>
          </div>
        </div>

        <div className="card-body">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">Amount to Pay</p>
            <p className="text-3xl font-bold text-indigo-600">
              {currency === "PKR" ? "Rs." : "$"}
              {parseFloat(amount).toFixed(2)}
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <span className="loading loading-spinner loading-lg text-indigo-600" />
              <p className="font-semibold text-gray-700">
                Authorising payment…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Cardholder Name
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered border-indigo-300 focus:border-indigo-500"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="cc-name"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Card Number</span>
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  className="input input-bordered border-indigo-300 focus:border-indigo-500 tracking-widest"
                  placeholder="4242 4242 4242 4242"
                  value={form.cardNumber}
                  onChange={handleChange}
                  required
                  autoComplete="cc-number"
                  inputMode="numeric"
                />
                <label className="label">
                  <span className="label-text-alt text-gray-400">
                    Test: 4242... = success · 4000...0002 = decline
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Expiry</span>
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    className="input input-bordered border-indigo-300 focus:border-indigo-500"
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={handleChange}
                    required
                    autoComplete="cc-exp"
                    inputMode="numeric"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">CVV</span>
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    className="input input-bordered border-indigo-300 focus:border-indigo-500"
                    placeholder="123"
                    value={form.cvv}
                    onChange={handleChange}
                    required
                    autoComplete="cc-csc"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none mt-2"
              >
                Pay {currency === "PKR" ? "Rs." : "$"}
                {parseFloat(amount).toFixed(2)}
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
        </div>
      </div>
    </div>
  );
}
