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
    <div className="min-h-screen bg-base-100 flex flex-col">
      <nav className="navbar bg-base-200 shadow-sm px-4 sticky top-0 z-30">
        <Link to="/cart" className="btn btn-ghost btn-sm">
          ← Back to Cart
        </Link>
        <span className="flex-1 text-center font-bold text-lg">Checkout</span>
        <div className="w-24" />
      </nav>

      <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Delivery type */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h3 className="font-bold mb-3">Delivery Type</h3>
            <div className="flex gap-4">
              {[
                { id: "delivery", label: "🚚 Delivery" },
                { id: "pickup", label: "🏪 Pickup" },
                { id: "dine_in", label: "🍽 Dine In" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    className="radio radio-primary radio-sm"
                    value={opt.id}
                    checked={form.deliveryType === opt.id}
                    onChange={handleChange}
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>

            {form.deliveryType === "delivery" && (
              <div className="form-control mt-3">
                <label className="label">
                  <span className="label-text">Delivery Address</span>
                </label>
                <textarea
                  name="address"
                  className="textarea textarea-bordered"
                  rows={2}
                  placeholder="Enter your full delivery address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* Payment method */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h3 className="font-bold mb-3">Payment Method</h3>
            <div className="flex flex-col gap-3">
              {PAYMENT_METHODS.map((pm) => (
                <label
                  key={pm.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    form.paymentMethod === pm.id
                      ? "border-primary bg-primary/5"
                      : "border-base-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="radio radio-primary radio-sm"
                    value={pm.id}
                    checked={form.paymentMethod === pm.id}
                    onChange={handleChange}
                  />
                  <span className="text-xl">{pm.icon}</span>
                  <span className="font-medium">{pm.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h3 className="font-bold mb-3">Order Summary</h3>
            {cartItems.map((item) => (
              <div
                key={item._key}
                className="flex justify-between text-sm mb-1"
              >
                <span>
                  {item.title}
                  {item.variant ? ` (${item.variant.title})` : ""}
                  {" ×"}
                  {item.quantity}
                </span>
                <span>
                  {symbol}
                  {((item.price + item.addonTotal) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="divider my-2" />
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>
                {symbol}
                {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>
                {symbol}
                {taxTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span className="text-primary">
                {symbol}
                {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg w-full"
          disabled={loading}
          onClick={handlePlaceOrder}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : form.paymentMethod === "cash" ? (
            "Place Order"
          ) : (
            `Pay with ${PAYMENT_METHODS.find((p) => p.id === form.paymentMethod)?.label}`
          )}
        </button>
      </div>
    </div>
  );
}
