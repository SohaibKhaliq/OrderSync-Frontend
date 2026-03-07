import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCafeCart } from "../../contexts/CafeCartContext";
import { useCustomer } from "../../contexts/CustomerContext";
import { CafeOrders, Settings } from "../../localdb/LocalDB";

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash on Delivery", icon: "💵" },
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

  const [form, setForm] = useState({
    deliveryType: "delivery",
    address: "",
    paymentMethod: "cash",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handlePlaceOrder() {
    if (form.deliveryType === "delivery" && !form.address.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // For online payment gateways, redirect to payment page
    if (form.paymentMethod !== "cash") {
      // Persist pending order data temporarily
      const pendingOrder = {
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        items: cartItems,
        deliveryType: form.deliveryType,
        address: form.address,
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

    // Cash on delivery – place order immediately
    setLoading(true);
    try {
      const order = CafeOrders.create({
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        items: cartItems,
        deliveryType: form.deliveryType,
        address: form.address,
        paymentMethod: "cash",
        paymentGatewayRef: null,
        subtotal: subtotal.toFixed(2),
        taxTotal: taxTotal.toFixed(2),
        total: total.toFixed(2),
      });
      clearCart();
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
           <Link to="/cart" className="text-primary text-sm font-bold uppercase tracking-widest hover:underline mb-4 inline-block">
             ← Back to Cart
           </Link>
           <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">
             Checkout
           </h1>
        </div>

        <div className="flex flex-col gap-8">
        {/* Delivery type */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 p-6 md:p-8 shrink-0">
          <h3 className="font-serif font-bold text-2xl mb-6 text-secondary pb-4 border-b border-gray-100">1. Delivery Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { id: "delivery", label: "🚚 Delivery" },
              { id: "pickup", label: "🏪 Pickup" },
              { id: "dine_in", label: "🍽 Dine In" },
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

          {form.deliveryType === "delivery" && (
            <div className="form-control mt-4">
              <label className="label mb-2">
                <span className="text-sm font-semibold text-neutral">Delivery Address</span>
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

        {/* Payment method */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 p-6 md:p-8 shrink-0">
          <h3 className="font-serif font-bold text-2xl mb-6 text-secondary pb-4 border-b border-gray-100">2. Payment Method</h3>
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
          <h3 className="font-serif font-bold text-2xl mb-6 text-secondary pb-4 border-b border-gray-100">3. Order Summary</h3>
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
                  {((item.price + item.addonTotal) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 mb-6 text-neutral text-sm md:text-base">
            <div className="flex justify-between items-center">
              <span className="opacity-80">Subtotal</span>
              <span className="font-semibold text-secondary">
                {symbol}{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-80">Tax</span>
              <span className="font-semibold text-secondary">
                {symbol}{taxTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 my-6"></div>
          
          <div className="flex justify-between items-center mb-8">
            <span className="font-serif font-bold text-2xl text-secondary">Total</span>
            <span className="text-3xl font-bold text-primary">
              {symbol}{total.toFixed(2)}
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
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                 {form.paymentMethod === "cash" ? "Place Order" : `Pay with ${PAYMENT_METHODS.find((p) => p.id === form.paymentMethod)?.label}`}
               </>
            )}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
