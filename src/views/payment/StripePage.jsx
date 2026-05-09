import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { createOrderFromQrMenu, createStripePaymentIntent } from "../../controllers/qrmenu.controller";
import { useCafeCart } from "../../contexts/CafeCartContext";

// Initialize Stripe with Public Key from .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ amount, currency }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCafeCart();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    createStripePaymentIntent(amount, currency)
      .then((res) => {
        if (res.data?.success) {
          setClientSecret(res.data.clientSecret);
        } else {
          toast.error("Failed to initialize payment gateway");
        }
      })
      .catch(() => toast.error("Connection error with payment gateway"));
  }, [amount, currency]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
    } else if (paymentIntent.status === "succeeded") {
      // Record order in backend
      const ref = paymentIntent.id;
      const pendingRaw = localStorage.getItem("cafe_pending_order");
      
      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw);
          const res = await createOrderFromQrMenu(
            pending.deliveryType,
            pending.items.map(item => ({...item, addons_ids: item.addons?.map(a => a.id)})),
            "customer",
            { phone: pending.customerPhone, name: pending.customerName },
            pending.tableId || null,
            "Stripe",
            ref,
            "default"
          );
          
          localStorage.removeItem("cafe_pending_order");
          clearCart();
          setLoading(false);
          toast.success("Payment successful!");
          navigate(`/orders/${res.data?.orderId || ''}`);
        } catch (err) {
          setLoading(false);
          toast.error("Payment recorded but order creation failed. Contact support with Ref: " + ref);
          navigate("/payment/result?status=failed&gateway=stripe");
        }
      } else {
        setLoading(false);
        navigate("/payment/result?status=success&gateway=stripe&ref=" + ref);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none h-14 font-bold text-lg rounded-xl shadow-lg shadow-indigo-100 disabled:opacity-50"
      >
        {loading ? (
          <span className="loading loading-spinner" />
        ) : (
          `Pay ${currency === "PKR" ? "Rs." : "$"}${parseFloat(amount).toFixed(2)}`
        )}
      </button>

      <button
        type="button"
        className="text-gray-400 text-sm font-semibold hover:text-gray-600 transition-colors"
        onClick={() => navigate("/checkout")}
      >
        ← Back to Checkout
      </button>
    </form>
  );
}

export default function StripePage() {
  const [searchParams] = useSearchParams();
  const amount = searchParams.get("amount") || "0.00";
  const currency = searchParams.get("currency") || "PKR";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
      <div className="card bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-md rounded-[2.5rem] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-indigo-600 p-10 text-center relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
          </div>
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-2xl">
            <span className="text-4xl">💳</span>
          </div>
          <h2 className="text-white font-black text-3xl tracking-tight">Stripe</h2>
          <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Secure Card Payment</p>
        </div>

        <div className="p-10">
          <div className="text-center mb-10">
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Amount to Pay</p>
            <p className="text-5xl font-black text-gray-900 tracking-tighter">
              <span className="text-2xl font-normal text-gray-400 mr-1">{currency === "PKR" ? "Rs." : "$"}</span>
              {parseFloat(amount).toLocaleString()}
            </p>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm amount={amount} currency={currency} />
          </Elements>

          <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-center gap-2">
            <span className="text-[#635BFF]">
              <svg width="33" height="15" viewBox="0 0 33 15" fill="currentColor"><path d="M29.105 5.535c.022.062.064.054.088-.044.275-1.113.883-3.642.883-3.642.022-.097.054-.132.146-.132h2.24c.094 0 .121.056.101.144l-2.613 10.61c-.02.088-.06.143-.153.143h-2.22c-.092 0-.114-.047-.093-.135 0 0 .61-2.484.887-3.612.02-.083-.005-.125-.088-.125H25.04c-.083 0-.108.042-.128.125l-.893 3.612c-.02.088-.043.135-.136.135h-2.235c-.092 0-.117-.055-.098-.143l2.618-10.61c.02-.088.045-.144.137-.144h2.24c.092 0 .115.035.136.132l.883 3.642c.024.098.051.106.073.044h1.417zM14.004 9.07c0 1.29-.982 2.128-2.394 2.128-1.503 0-2.39-.933-2.39-2.128 0-1.464 1.135-2.26 2.39-2.26 1.412 0 2.394.945 2.394 2.26zm2.39-4.225c-.025-.092-.066-.132-.16-.132h-2.138c-.093 0-.135.053-.122.148.113.856.14 1.345.14 1.706-.395-.494-1.076-.845-1.925-.845-2.12 0-4.083 1.543-4.083 4.298 0 1.912 1.258 3.393 3.303 3.393.812 0 1.57-.318 2.05-.935.08-.103.11-.055.132.043l.18.73c.023.092.053.125.146.125h2.153c.094 0 .114-.067.094-.143l1.96-7.94c.018-.088-.014-.14-.108-.14h-1.63s.018-.4.01-.527zm-7.61 5.3c0 .1.03.14.123.14h3.04c.093 0 .114-.047.094-.135l-.265-1.082c-.02-.088-.046-.143-.138-.143H9.006c-.092 0-.123.05-.123.15V10.145zm11.38-4.43c-1.332 0-2.33 1.052-2.33 2.195 0 1.408 1.08 2.2 2.33 2.2 1.353 0 2.336-1.077 2.336-2.2 0-1.405-.983-2.195-2.336-2.195zM22.56 1.11h-2.24c-.092 0-.125.04-.145.135l-.543 2.2c-.02.083-.008.134.085.134.425 0 1.054.1 1.464.383.084.055.112.03.133-.047l1.35-5.46c.02-.088-.01-.144-.104-.144zm-14.88 4.6c-.023-.092-.058-.132-.15-.132H5.38c-.093 0-.138.053-.125.148.113.856.14 1.345.14 1.706-.394-.494-1.075-.845-1.925-.845-2.12 0-4.083 1.543-4.083 4.298 0 1.912 1.257 3.393 3.303 3.393.812 0 1.57-.318 2.05-.935.08-.103.11-.055.132.043l.18.73c.023.092.053.125.146.125H7.36c.094 0 .113-.067.093-.143l1.96-7.94c.018-.088-.014-.14-.108-.14H7.674s.018-.4.01-.527zm-4.307 3.36c0 1.29-.982 2.128-2.394 2.128-1.503 0-2.39-.933-2.39-2.128 0-1.464 1.135-2.26 2.39-2.26 1.412 0 2.394.945 2.394 2.26z"/></svg>
            </span>
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Powered by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
